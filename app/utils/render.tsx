import { getContext } from 'remix/async-context-middleware';
import type { RemixNode } from 'remix/component';
import {
	type ResolveFrameContext,
	renderToStream,
} from 'remix/component/server';
import type {
	ContextEntries,
	RequestContext,
	Router,
} from 'remix/fetch-router';

export const render = (node: RemixNode, init?: ResponseInit): Response => {
	const context = getContext();
	const request = context.request;
	const router = context.router;

	const stream = renderToStream(node, {
		frameSrc: request.url,
		resolveFrame: (src, target, frameContext) =>
			resolveFrame(router, request, src, target, frameContext),
		onError: (error) => {
			console.error(error);
		},
	});

	const headers = new Headers(init?.headers);

	if (!headers.has('Content-Type')) {
		headers.set('Content-Type', 'text/html; charset=UTF-8');
	}

	return new Response(stream, { ...init, headers });
};

const resolveFrame = async <
	C extends RequestContext<Record<string, unknown>, ContextEntries>,
>(
	router: Router<C>,
	request: Request,
	src: string,
	target?: string,
	context?: ResolveFrameContext,
): Promise<ReadableStream<Uint8Array> | string> => {
	const frameSrc = context?.currentFrameSrc ?? request.url;
	const url = new URL(src, frameSrc);

	const headers = new Headers();
	headers.set('accept', 'text/html');
	headers.set('accept-encoding', 'identity');
	headers.set('x-remix-frame', 'true');
	if (target) {
		headers.set('x-remix-target', target);
	}

	const cookie = request.headers.get('cookie');
	if (cookie) headers.set('cookie', cookie);

	const res = await followFrameRedirects(router, request, url, headers);

	if (!res.ok) {
		return `<pre>Frame error: ${res.status} ${res.statusText}</pre>`;
	}

	if (res.body) return res.body;

	return res.text();
};

const followFrameRedirects = async <
	C extends RequestContext<Record<string, unknown>, ContextEntries>,
>(
	router: Router<C>,
	request: Request,
	url: URL,
	headers: Headers,
) => {
	let currentUrl = url;
	let redirectsRemaining = 10;

	while (true) {
		const response = await router.fetch(
			new Request(currentUrl, {
				method: 'GET',
				headers,
				signal: request.signal,
			}),
		);

		const location = response.headers.get('location');
		if (!location || response.status < 300 || response.status >= 400) {
			return response;
		}

		if (redirectsRemaining-- <= 0) {
			throw new Error('Too many frame redirects');
		}

		currentUrl = new URL(location, currentUrl);
	}
};

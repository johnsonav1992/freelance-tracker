import { getContext } from 'remix/async-context-middleware';
import type { RemixNode } from 'remix/component';
import { renderToStream } from 'remix/component/server';
import type { RequestContext, Router } from 'remix/fetch-router';

export const render = (node: RemixNode, init?: ResponseInit): Response => {
	const context = getContext();
	const request = context.request;
	const router = context.router;

	const stream = renderToStream(node, {
		resolveFrame: (src) => resolveFrame(router, request, src),
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

const resolveFrame = async <C extends RequestContext<Record<string, unknown>, any>>(
	router: Router<C>,
	request: Request,
	src: string,
): Promise<ReadableStream<Uint8Array> | string> => {
	const url = new URL(src, request.url);

	const headers = new Headers();
	headers.set('accept', 'text/html');
	headers.set('accept-encoding', 'identity');

	const cookie = request.headers.get('cookie');
	if (cookie) headers.set('cookie', cookie);

	const res = await router.fetch(
		new Request(url, {
			method: 'GET',
			headers,
			signal: request.signal,
		}),
	);

	if (!res.ok) {
		return `<pre>Frame error: ${res.status} ${res.statusText}</pre>`;
	}

	if (res.body) return res.body;

	return res.text();
};

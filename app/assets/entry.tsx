import { run } from 'remix/component';

const app = run({
	async loadModule(moduleUrl: string, exportName: string) {
		const mod = await import(moduleUrl);
		const Component = (mod as Record<string, unknown>)[exportName];
		if (!Component) {
			throw new Error(`Unknown component: ${moduleUrl}#${exportName}`);
		}
		return Component as Parameters<typeof run>[0]['loadModule'] extends (
			...args: unknown[]
		) => Promise<infer R>
			? R
			: never;
	},
	async resolveFrame(src, signal, target) {
		const headers = new Headers();
		headers.set('accept', 'text/html');
		headers.set('x-remix-frame', 'true');
		if (target) {
			headers.set('x-remix-target', target);
		}

		const response = await fetch(src, {
			headers,
			signal,
		});
		if (!response.ok) {
			return `<pre>Frame error: ${response.status} ${response.statusText}</pre>`;
		}
		if (response.body) return response.body;
		return response.text();
	},
});

app.ready().catch((error: unknown) => {
	console.error('App boot failed:', error);
});

export { AppLink } from '../ui/AppLink.tsx';
export { RestfulForm } from '../ui/RestfulForm.tsx';
export { Timer } from './timer.tsx';

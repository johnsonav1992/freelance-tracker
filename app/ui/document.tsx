import type { RemixNode } from 'remix/component';

import { routes } from '../routes.ts';

export interface DocumentProps {
	title?: string;
	children?: RemixNode;
}

export const Document =
	() =>
	({ title = 'Freelance Tracker', children }: DocumentProps) => (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>{title} — Freelance Tracker</title>
				<script
					type="module"
					async
					src={routes.assets.href({ path: 'entry.js' })}
				/>
				<style innerHTML={globalStyles} />
			</head>
			<body>{children}</body>
		</html>
	);

const globalStyles = `
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; height: 100%; font-family: system-ui, -apple-system, sans-serif; background: #0f0f0f; color: #e8e8e8; }
a { color: #818cf8; text-decoration: none; }
a:hover { text-decoration: underline; }
input, select, textarea { background: #1a1a1a; border: 1px solid #2a2a2a; color: #e8e8e8; border-radius: 6px; padding: 0.5rem 0.75rem; font-size: 0.875rem; width: 100%; }
input:focus, select:focus, textarea:focus { outline: none; border-color: #818cf8; }
button, .btn { cursor: pointer; border: none; border-radius: 6px; padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 500; transition: opacity 0.15s; }
button:hover, .btn:hover { opacity: 0.85; }
.btn-primary { background: #818cf8; color: #fff; }
.btn-secondary { background: #2a2a2a; color: #e8e8e8; }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 0.3rem 0.65rem; font-size: 0.8rem; }
label { display: block; font-size: 0.8rem; font-weight: 500; color: #888; margin-bottom: 0.35rem; }
.form-group { margin-bottom: 1rem; }
.badge { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.badge-active { background: #14532d; color: #4ade80; }
.badge-paused { background: #292524; color: #a8a29e; }
.badge-done { background: #1e3a5f; color: #60a5fa; }
.badge-draft { background: #292524; color: #a8a29e; }
.badge-sent { background: #1c2a4a; color: #818cf8; }
.badge-paid { background: #14532d; color: #4ade80; }
.form-contents { display: contents; }
`;

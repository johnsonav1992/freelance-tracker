import type { RemixNode } from 'remix/component';

import { routes } from '../routes.ts';

export interface DocumentProps {
	title?: string;
	children?: RemixNode;
}

export const Document = () => {
	return ({ title = 'Freelance Tracker', children }: DocumentProps) => (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>{title} — Freelance Tracker</title>
				<link
					rel="preconnect"
					href="https://fonts.googleapis.com"
				/>
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossorigin="anonymous"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&display=swap"
				/>
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
};

const globalStyles = `
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; min-height: 100%; }
html {
	--bg: #f4efe7;
	--surface: rgba(255, 251, 245, 0.86);
	--surface-strong: #fffdf9;
	--surface-tint: rgba(232, 243, 237, 0.92);
	--ink: #19231f;
	--muted: #617169;
	--muted-strong: #425149;
	--line: rgba(74, 91, 82, 0.16);
	--accent: #0f766e;
	--accent-strong: #115e59;
	--accent-soft: #dff5f2;
	--danger: #b42318;
	--danger-soft: #fee4e2;
	--success: #067647;
	--success-soft: #def7ec;
	--warning: #b54708;
	--warning-soft: #fef0c7;
	--shadow: 0 24px 70px rgba(28, 39, 34, 0.08);
}
body {
	font-family: "Manrope", "Segoe UI", sans-serif;
	background:
		radial-gradient(circle at top left, rgba(255, 255, 255, 0.65), transparent 30%),
		radial-gradient(circle at top right, rgba(15, 118, 110, 0.08), transparent 24%),
		linear-gradient(180deg, #f8f3eb 0%, var(--bg) 26%, #f7f2e9 100%);
	color: var(--ink);
}
body::before {
	content: "";
	position: fixed;
	inset: 0;
	pointer-events: none;
	background-image:
		linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
		linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
	background-size: 32px 32px;
	mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.12), transparent 65%);
}
a { color: var(--accent); text-decoration: none; }
a:hover { color: var(--accent-strong); }
button, input, select, textarea { font: inherit; }
button, .btn {
	cursor: pointer;
	border: none;
	border-radius: 999px;
	padding: 0.8rem 1.2rem;
	font-size: 0.95rem;
	font-weight: 700;
	letter-spacing: -0.01em;
	transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, color 120ms ease;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.45rem;
	text-decoration: none;
}
button:hover, .btn:hover { transform: translateY(-1px); text-decoration: none; }
button:active, .btn:active { transform: translateY(0); }
.btn-primary {
	background: var(--ink);
	color: #fffdf9;
	box-shadow: 0 14px 24px rgba(25, 35, 31, 0.14);
}
.btn-secondary {
	background: rgba(255, 255, 255, 0.72);
	color: var(--ink);
	border: 1px solid var(--line);
}
.btn-danger {
	background: var(--danger-soft);
	color: var(--danger);
	border: 1px solid rgba(180, 35, 24, 0.12);
}
.btn-sm { padding: 0.55rem 0.9rem; font-size: 0.84rem; }
input, select, textarea {
	background: rgba(255, 255, 255, 0.9);
	border: 1px solid rgba(74, 91, 82, 0.18);
	color: var(--ink);
	border-radius: 16px;
	padding: 0.85rem 1rem;
	font-size: 0.95rem;
	width: 100%;
	box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
}
input:focus, select:focus, textarea:focus {
	outline: none;
	border-color: rgba(15, 118, 110, 0.45);
	box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.12);
}
textarea { resize: vertical; min-height: 7rem; }
label {
	display: block;
	font-size: 0.82rem;
	font-weight: 700;
	color: var(--muted-strong);
	margin-bottom: 0.45rem;
	letter-spacing: 0.01em;
}
.form-group { margin: 0; }
.field-hint {
	margin-top: 0.45rem;
	font-size: 0.82rem;
	line-height: 1.5;
	color: var(--muted);
}
.badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.38rem 0.7rem;
	border-radius: 999px;
	font-size: 0.76rem;
	font-weight: 800;
	text-transform: capitalize;
	letter-spacing: 0.01em;
}
.badge-active, .badge-paid {
	background: var(--success-soft);
	color: var(--success);
}
.badge-paused, .badge-draft {
	background: rgba(97, 113, 105, 0.12);
	color: var(--muted-strong);
}
.badge-done {
	background: rgba(17, 94, 89, 0.12);
	color: var(--accent-strong);
}
.badge-sent {
	background: var(--warning-soft);
	color: var(--warning);
}
.app-shell { min-height: 100vh; position: relative; }
.app-header {
	position: sticky;
	top: 0;
	z-index: 20;
	backdrop-filter: blur(14px);
	background: rgba(248, 243, 235, 0.72);
	border-bottom: 1px solid rgba(74, 91, 82, 0.1);
}
.app-header-inner {
	max-width: 1240px;
	margin: 0 auto;
	padding: 1rem 1.25rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}
.brand {
	display: flex;
	flex-direction: column;
	gap: 0.1rem;
	min-width: 0;
}
.brand-mark {
	font-size: 1.05rem;
	font-weight: 800;
	color: var(--ink);
	letter-spacing: -0.03em;
}
.brand-mark span {
	font-family: "Fraunces", Georgia, serif;
	font-weight: 600;
}
.brand-copy {
	font-size: 0.78rem;
	color: var(--muted);
}
.app-nav {
	display: flex;
	align-items: center;
	gap: 0.45rem;
	flex-wrap: wrap;
	justify-content: flex-end;
}
.nav-link {
	padding: 0.55rem 0.9rem;
	border-radius: 999px;
	color: var(--muted-strong);
	font-size: 0.88rem;
	font-weight: 700;
}
.nav-link:hover { background: rgba(255, 255, 255, 0.72); }
.nav-link-active {
	background: var(--ink);
	color: #fffdf9;
	box-shadow: 0 12px 22px rgba(25, 35, 31, 0.12);
}
.app-main {
	max-width: 1240px;
	margin: 0 auto;
	padding: 2rem 1.25rem 3rem;
}
.page-stack { display: flex; flex-direction: column; gap: 1.5rem; }
.page-header {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 1rem;
	flex-wrap: wrap;
}
.page-header-copy { max-width: 720px; }
.page-eyebrow {
	font-size: 0.78rem;
	font-weight: 800;
	color: var(--accent-strong);
	text-transform: uppercase;
	letter-spacing: 0.12em;
	margin-bottom: 0.7rem;
}
.page-title {
	margin: 0;
	font-family: "Fraunces", Georgia, serif;
	font-size: clamp(2rem, 4vw, 3.35rem);
	line-height: 0.98;
	letter-spacing: -0.05em;
}
.page-subtitle {
	margin: 0.8rem 0 0;
	max-width: 60ch;
	font-size: 1rem;
	line-height: 1.65;
	color: var(--muted);
}
.page-actions { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
.section-card {
	background: var(--surface);
	border: 1px solid rgba(74, 91, 82, 0.12);
	border-radius: 28px;
	padding: 1.3rem;
	box-shadow: var(--shadow);
	backdrop-filter: blur(12px);
}
.section-card-tint { background: var(--surface-tint); }
.section-card-highlight {
	background: linear-gradient(135deg, rgba(223, 245, 242, 0.96), rgba(255, 255, 255, 0.96));
	border-color: rgba(15, 118, 110, 0.18);
}
.section-card-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 1rem;
	flex-wrap: wrap;
}
.section-card-title {
	margin: 0;
	font-size: 1rem;
	font-weight: 800;
	letter-spacing: -0.02em;
}
.section-card-subtitle {
	margin: 0.3rem 0 0;
	font-size: 0.9rem;
	line-height: 1.55;
	color: var(--muted);
}
.section-card-actions {
	display: flex;
	gap: 0.65rem;
	align-items: center;
	flex-wrap: wrap;
}
.section-card-body { display: flex; flex-direction: column; gap: 1rem; }
.metric-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1rem;
}
.metric-card {
	background: rgba(255, 255, 255, 0.58);
	border: 1px solid rgba(74, 91, 82, 0.1);
	border-radius: 24px;
	padding: 1.15rem 1.2rem;
	min-height: 148px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.metric-card-accent {
	background: linear-gradient(140deg, rgba(223, 245, 242, 0.95), rgba(255, 255, 255, 0.85));
	border-color: rgba(15, 118, 110, 0.14);
}
.metric-label {
	font-size: 0.76rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	color: var(--muted);
}
.metric-value {
	font-size: clamp(1.6rem, 3vw, 2.3rem);
	line-height: 1;
	font-weight: 800;
	letter-spacing: -0.05em;
}
.metric-note {
	font-size: 0.88rem;
	line-height: 1.5;
	color: var(--muted);
}
.split-grid {
	display: grid;
	grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.9fr);
	gap: 1rem;
}
.equal-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}
.triptych-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1rem;
}
.stack-sm, .stack-md, .stack-lg {
	display: flex;
	flex-direction: column;
}
.stack-sm { gap: 0.65rem; }
.stack-md { gap: 1rem; }
.stack-lg { gap: 1.4rem; }
.list-stack {
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
}
.list-item {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 1rem;
	padding: 1rem 1.05rem;
	background: rgba(255, 255, 255, 0.62);
	border: 1px solid rgba(74, 91, 82, 0.1);
	border-radius: 22px;
}
.list-item-primary { flex: 1; min-width: 0; }
.list-item-title {
	margin: 0;
	font-size: 1rem;
	font-weight: 800;
	line-height: 1.35;
	letter-spacing: -0.02em;
}
.list-item-title a { color: var(--ink); }
.list-item-title a:hover { color: var(--accent-strong); }
.list-item-text {
	margin: 0.35rem 0 0;
	font-size: 0.92rem;
	line-height: 1.55;
	color: var(--muted);
}
.meta-row, .meta-pills, .inline-actions {
	display: flex;
	align-items: center;
	gap: 0.55rem;
	flex-wrap: wrap;
}
.meta-row {
	margin-top: 0.65rem;
	font-size: 0.84rem;
	color: var(--muted);
}
.meta-row strong { color: var(--muted-strong); font-weight: 700; }
.meta-dot {
	width: 4px;
	height: 4px;
	border-radius: 999px;
	background: rgba(97, 113, 105, 0.55);
}
.meta-chip {
	display: inline-flex;
	align-items: center;
	padding: 0.34rem 0.6rem;
	border-radius: 999px;
	background: rgba(97, 113, 105, 0.1);
	color: var(--muted-strong);
	font-size: 0.74rem;
	font-weight: 800;
}
.meta-chip-accent {
	background: var(--accent-soft);
	color: var(--accent-strong);
}
.meta-chip-success {
	background: var(--success-soft);
	color: var(--success);
}
.meta-chip-warning {
	background: var(--warning-soft);
	color: var(--warning);
}
.list-item-side {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.85rem;
	min-width: 180px;
}
.value-block { text-align: right; }
.value-label {
	font-size: 0.76rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--muted);
}
.value-main {
	margin-top: 0.32rem;
	font-size: 1.1rem;
	font-weight: 800;
	letter-spacing: -0.03em;
}
.value-sub {
	margin-top: 0.22rem;
	font-size: 0.84rem;
	color: var(--muted);
}
.detail-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}
.detail-list {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.9rem 1.1rem;
	margin: 0;
}
.detail-list div { min-width: 0; }
.detail-list dt {
	font-size: 0.78rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--muted);
	margin-bottom: 0.35rem;
}
.detail-list dd {
	margin: 0;
	font-size: 0.95rem;
	line-height: 1.5;
	color: var(--ink);
}
.callout {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	flex-wrap: wrap;
	padding: 1.05rem 1.15rem;
	border-radius: 24px;
	border: 1px solid rgba(15, 118, 110, 0.14);
	background: linear-gradient(135deg, rgba(223, 245, 242, 0.96), rgba(255, 255, 255, 0.7));
}
.callout-title {
	margin: 0;
	font-size: 1rem;
	font-weight: 800;
}
.callout-copy {
	margin: 0.35rem 0 0;
	font-size: 0.92rem;
	line-height: 1.55;
	color: var(--muted);
}
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 2rem;
	border-radius: 28px;
	background: var(--surface);
	border: 1px solid rgba(74, 91, 82, 0.12);
	box-shadow: var(--shadow);
}
.empty-state-icon {
	width: 2.3rem;
	height: 2.3rem;
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: var(--accent-soft);
	color: var(--accent-strong);
	font-size: 1.35rem;
	margin-bottom: 1rem;
}
.empty-state-title {
	margin: 0;
	font-size: 1.15rem;
	font-weight: 800;
}
.empty-state-description {
	margin: 0.55rem 0 0;
	max-width: 46ch;
	font-size: 0.95rem;
	line-height: 1.65;
	color: var(--muted);
}
.empty-state-action { margin-top: 1rem; }
.form-card {
	max-width: 760px;
	background: var(--surface);
	border: 1px solid rgba(74, 91, 82, 0.12);
	border-radius: 30px;
	padding: 1.4rem;
	box-shadow: var(--shadow);
}
.form-grid {
	display: flex;
	flex-direction: column;
	gap: 1.1rem;
}
.field-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}
.checkbox-card {
	display: flex;
	align-items: center;
	gap: 0.9rem;
	padding: 1rem 1.05rem;
	border-radius: 22px;
	background: rgba(255, 255, 255, 0.72);
	border: 1px solid rgba(74, 91, 82, 0.1);
}
.checkbox-card input {
	width: auto;
	margin: 0;
	box-shadow: none;
}
.checkbox-copy strong {
	display: block;
	font-size: 0.92rem;
	font-weight: 800;
	color: var(--ink);
}
.checkbox-copy span {
	display: block;
	margin-top: 0.2rem;
	font-size: 0.84rem;
	color: var(--muted);
}
.form-actions {
	display: flex;
	gap: 0.8rem;
	flex-wrap: wrap;
	padding-top: 0.6rem;
}
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.muted { color: var(--muted); }
.form-contents { display: contents; }
.table-shell {
	overflow-x: auto;
	border-radius: 24px;
	background: rgba(255, 255, 255, 0.62);
	border: 1px solid rgba(74, 91, 82, 0.1);
}
table { width: 100%; border-collapse: collapse; }
th, td { padding: 0.95rem 1rem; }
th {
	font-size: 0.74rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--muted);
	text-align: left;
	border-bottom: 1px solid rgba(74, 91, 82, 0.12);
}
td { font-size: 0.92rem; border-bottom: 1px solid rgba(74, 91, 82, 0.08); }
tbody tr:last-child td { border-bottom: none; }
.breadcrumb {
	display: inline-flex;
	align-items: center;
	gap: 0.45rem;
	font-size: 0.84rem;
	font-weight: 700;
	color: var(--muted);
}
.breadcrumb:hover { color: var(--accent-strong); }
@media (max-width: 960px) {
	.metric-grid, .split-grid, .equal-grid, .triptych-grid, .detail-grid, .detail-list, .field-grid {
		grid-template-columns: 1fr;
	}
	.list-item {
		flex-direction: column;
	}
	.list-item-side {
		align-items: flex-start;
		min-width: 0;
		width: 100%;
	}
	.value-block { text-align: left; }
}
@media (max-width: 720px) {
	.app-header-inner {
		align-items: flex-start;
		flex-direction: column;
	}
	.app-nav {
		width: 100%;
		justify-content: flex-start;
		overflow-x: auto;
		padding-bottom: 0.2rem;
		flex-wrap: nowrap;
	}
	.nav-link { white-space: nowrap; }
	.app-main { padding-top: 1.35rem; }
	.section-card, .form-card, .empty-state { padding: 1.1rem; border-radius: 24px; }
	.page-title { font-size: clamp(1.8rem, 11vw, 2.6rem); }
}
`;

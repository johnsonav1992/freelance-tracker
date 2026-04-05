import type { RemixNode } from 'remix/component';

import { routes } from '../routes.ts';
import { AppLink } from './AppLink.tsx';
import { Document } from './Document.tsx';

export interface LayoutProps {
	title?: string;
	activeNav?: string;
	children?: RemixNode;
}

export const Layout = () => {
	return ({ title, activeNav, children }: LayoutProps) => (
		<Document title={title}>
			<div class="app-shell">
				<header class="app-header">
					<div class="app-header-inner">
						<AppLink
							href={routes.home.href()}
							class="brand"
						>
							<div class="brand-mark">Freelance Tracker</div>
							<div class="brand-copy">Internal dashboard</div>
						</AppLink>

						<nav class="app-nav">
							{navItems.map(({ href, label, id }) => (
								<AppLink
									href={href}
									class={`nav-link${activeNav === id ? ' nav-link-active' : ''}`}
									ariaCurrent={activeNav === id ? 'page' : undefined}
								>
									{label}
								</AppLink>
							))}
						</nav>
					</div>
				</header>

				<main class="app-main">
					<div class="page-stack">{children}</div>
				</main>
			</div>
		</Document>
	);
};

const navItems = [
	{ id: 'home', label: 'Dashboard', href: routes.home.href() },
	{ id: 'clients', label: 'Clients', href: routes.clients.index.href() },
	{ id: 'projects', label: 'Projects', href: routes.projects.index.href() },
	{ id: 'time', label: 'Time', href: routes.time.index.href() },
	{ id: 'invoices', label: 'Invoices', href: routes.invoices.index.href() },
];

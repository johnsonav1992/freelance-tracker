import type { RemixNode } from 'remix/component';
import { css } from 'remix/component';

import { routes } from '../routes.ts';
import { Document } from './document.tsx';

export interface LayoutProps {
	title?: string;
	activeNav?: string;
	children?: RemixNode;
}

export const Layout =
	() =>
	({ title, activeNav, children }: LayoutProps) => (
		<Document title={title}>
			<div
				mix={css({
					display: 'grid',
					gridTemplateColumns: '220px 1fr',
					minHeight: '100vh',
				})}
			>
				<aside
					mix={css({
						borderRight: '1px solid #1e1e1e',
						display: 'flex',
						flexDirection: 'column',
						padding: '1.25rem 0',
						position: 'sticky',
						top: 0,
						height: '100vh',
						overflowY: 'auto',
					})}
				>
					<a
						href={routes.home.href()}
						mix={css({
							display: 'block',
							padding: '0 1.25rem 1.25rem',
							fontSize: '1rem',
							fontWeight: 700,
							color: '#e8e8e8',
							letterSpacing: '-0.01em',
							textDecoration: 'none',
							borderBottom: '1px solid #1e1e1e',
							marginBottom: '0.5rem',
						})}
					>
						Freelance Tracker
					</a>

					<nav mix={css({ padding: '0.5rem 0.75rem', flex: 1 })}>
						{navItems.map(({ href, label, id }) => (
							<a
								href={href}
								mix={css({
									display: 'block',
									padding: '0.5rem 0.5rem',
									borderRadius: '6px',
									fontSize: '0.875rem',
									fontWeight: activeNav === id ? 600 : 400,
									color: activeNav === id ? '#818cf8' : '#a0a0a0',
									background: activeNav === id ? '#1a1a2e' : 'transparent',
									textDecoration: 'none',
									marginBottom: '2px',
									'&:hover': {
										color: '#e8e8e8',
										background: '#1a1a1a',
									},
								})}
							>
								{label}
							</a>
						))}
					</nav>
				</aside>

				<main mix={css({ padding: '2rem', maxWidth: '960px' })}>
					{children}
				</main>
			</div>
		</Document>
	);

const navItems = [
	{ id: 'home', label: 'Dashboard', href: routes.home.href() },
	{ id: 'clients', label: 'Clients', href: routes.clients.index.href() },
	{ id: 'projects', label: 'Projects', href: routes.projects.index.href() },
	{ id: 'time', label: 'Time', href: routes.time.index.href() },
	{ id: 'invoices', label: 'Invoices', href: routes.invoices.index.href() },
];

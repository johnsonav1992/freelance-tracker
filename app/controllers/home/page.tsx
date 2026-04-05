import { css } from 'remix/component';
import { Timer } from '../../assets/timer.tsx';
import type { Client, Invoice, Project, TimeEntry } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { Layout } from '../../ui/layout.tsx';
import { formatCurrency, formatDuration } from '../../utils/format.ts';

export interface DashboardPageProps {
	clientCount: number;
	activeProjectCount: number;
	unbilledMs: number;
	unbilledAmount: number;
	outstandingAmount: number;
	runningEntry: (TimeEntry & { project: Project & { client: Client } }) | null;
	recentInvoices: (Invoice & { client: Client })[];
}

export const DashboardPage =
	() =>
	({
		clientCount,
		activeProjectCount,
		unbilledMs,
		unbilledAmount,
		outstandingAmount,
		runningEntry,
		recentInvoices,
	}: DashboardPageProps) => (
		<Layout
			title="Dashboard"
			activeNav="home"
		>
			{runningEntry && (
				<div
					mix={css({
						background: '#1a1a2e',
						border: '1px solid #818cf8',
						borderRadius: '8px',
						padding: '1rem 1.25rem',
						marginBottom: '1.5rem',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					})}
				>
					<div>
						<div
							mix={css({
								fontSize: '0.75rem',
								color: '#818cf8',
								marginBottom: '0.25rem',
							})}
						>
							Timer running
						</div>
						<div mix={css({ fontSize: '0.875rem', fontWeight: 500 })}>
							{runningEntry.project.client.name} — {runningEntry.project.name}
						</div>
						{runningEntry.description && (
							<div
								mix={css({
									fontSize: '0.8rem',
									color: '#888',
									marginTop: '0.2rem',
								})}
							>
								{runningEntry.description}
							</div>
						)}
					</div>
					<Timer
						setup={{
							entryId: runningEntry.id,
							startedAt: runningEntry.startedAt,
						}}
					/>
				</div>
			)}

			<div
				mix={css({
					display: 'grid',
					gridTemplateColumns: 'repeat(4, 1fr)',
					gap: '1rem',
					marginBottom: '2rem',
				})}
			>
				<StatCard
					label="Clients"
					value={String(clientCount)}
				/>
				<StatCard
					label="Active Projects"
					value={String(activeProjectCount)}
				/>
				<StatCard
					label="Unbilled Time"
					value={formatDuration(unbilledMs)}
				/>
				<StatCard
					label="Outstanding"
					value={formatCurrency(outstandingAmount)}
				/>
			</div>

			<div
				mix={css({
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: '1.5rem',
				})}
			>
				<div>
					<div
						mix={css({
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '1rem',
						})}
					>
						<h2 mix={css({ margin: 0, fontSize: '1rem', fontWeight: 600 })}>
							Quick Actions
						</h2>
					</div>
					<div
						mix={css({
							display: 'flex',
							flexDirection: 'column',
							gap: '0.5rem',
						})}
					>
						<a
							href={routes.clients.new.href()}
							class="btn btn-secondary"
						>
							+ New Client
						</a>
						<a
							href={routes.projects.new.href()}
							class="btn btn-secondary"
						>
							+ New Project
						</a>
						<a
							href={routes.time.new.href()}
							class="btn btn-secondary"
						>
							+ Log Time
						</a>
						<a
							href={routes.invoices.new.href()}
							class="btn btn-primary"
						>
							Create Invoice
						</a>
					</div>
				</div>

				<div>
					<div
						mix={css({
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '1rem',
						})}
					>
						<h2 mix={css({ margin: 0, fontSize: '1rem', fontWeight: 600 })}>
							Recent Invoices
						</h2>
						<a
							href={routes.invoices.index.href()}
							mix={css({ fontSize: '0.8rem', color: '#818cf8' })}
						>
							View all
						</a>
					</div>
					{recentInvoices.length === 0 ? (
						<p mix={css({ color: '#555', fontSize: '0.875rem' })}>
							No invoices yet.
						</p>
					) : (
						<div
							mix={css({
								display: 'flex',
								flexDirection: 'column',
								gap: '0.5rem',
							})}
						>
							{recentInvoices.map((invoice) => (
								<a
									href={routes.invoices.show.href({ invoiceId: invoice.id })}
									mix={css({
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										padding: '0.75rem',
										background: '#1a1a1a',
										borderRadius: '6px',
										textDecoration: 'none',
										color: '#e8e8e8',
										'&:hover': { background: '#222' },
									})}
								>
									<div>
										<div mix={css({ fontSize: '0.875rem', fontWeight: 500 })}>
											{invoice.number}
										</div>
										<div mix={css({ fontSize: '0.75rem', color: '#888' })}>
											{invoice.client.name}
										</div>
									</div>
									<span class={`badge badge-${invoice.status}`}>
										{invoice.status}
									</span>
								</a>
							))}
						</div>
					)}
				</div>
			</div>

			{unbilledAmount > 0 && (
				<div
					mix={css({
						marginTop: '1.5rem',
						padding: '1rem 1.25rem',
						background: '#1a1a1a',
						borderRadius: '8px',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					})}
				>
					<div>
						<div mix={css({ fontSize: '0.875rem', fontWeight: 500 })}>
							{formatCurrency(unbilledAmount)} unbilled
						</div>
						<div mix={css({ fontSize: '0.75rem', color: '#888' })}>
							{formatDuration(unbilledMs)} across active projects
						</div>
					</div>
					<a
						href={routes.invoices.new.href()}
						class="btn btn-primary btn-sm"
					>
						Create Invoice
					</a>
				</div>
			)}
		</Layout>
	);

const StatCard =
	() =>
	({ label, value }: { label: string; value: string }) => (
		<div
			mix={css({
				background: '#1a1a1a',
				borderRadius: '8px',
				padding: '1.25rem',
				border: '1px solid #2a2a2a',
			})}
		>
			<div
				mix={css({
					fontSize: '0.75rem',
					color: '#666',
					marginBottom: '0.5rem',
					textTransform: 'uppercase',
					letterSpacing: '0.05em',
				})}
			>
				{label}
			</div>
			<div mix={css({ fontSize: '1.5rem', fontWeight: 700 })}>{value}</div>
		</div>
	);

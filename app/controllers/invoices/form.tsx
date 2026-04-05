import { css } from 'remix/component';

import type { Client, Project, TimeEntry } from '../../data/schema.ts';
import { Layout } from '../../ui/layout.tsx';
import { formatCurrency, formatDuration } from '../../utils/format.ts';

export interface InvoiceFormPageProps {
	clients: Client[];
	unbilledByClient: Map<
		number,
		{
			entries: (TimeEntry & { project: Project })[];
			totalMs: number;
			totalAmount: number;
		}
	>;
}

export const InvoiceFormPage =
	() =>
	({ clients, unbilledByClient }: InvoiceFormPageProps) => (
		<Layout
			title="Create Invoice"
			activeNav="invoices"
		>
			<div mix={css({ marginBottom: '1.5rem' })}>
				<h1 mix={css({ margin: 0, fontSize: '1.5rem', fontWeight: 700 })}>
					Create Invoice
				</h1>
			</div>

			{clients.length === 0 ? (
				<div
					mix={css({
						background: '#1a1a1a',
						borderRadius: '8px',
						padding: '3rem',
						textAlign: 'center',
						color: '#555',
						border: '1px solid #2a2a2a',
					})}
				>
					<p mix={css({ margin: 0 })}>No clients with unbilled time entries.</p>
				</div>
			) : (
				<div
					mix={css({ display: 'flex', flexDirection: 'column', gap: '1.5rem' })}
				>
					{clients.map((client) => {
						const data = unbilledByClient.get(client.id);
						if (!data || data.entries.length === 0) return null;

						return (
							<div
								mix={css({
									background: '#1a1a1a',
									borderRadius: '8px',
									border: '1px solid #2a2a2a',
									overflow: 'hidden',
								})}
							>
								<div
									mix={css({
										padding: '1rem 1.25rem',
										borderBottom: '1px solid #2a2a2a',
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									})}
								>
									<div>
										<div mix={css({ fontWeight: 600 })}>{client.name}</div>
										{client.company && (
											<div mix={css({ fontSize: '0.8rem', color: '#888' })}>
												{client.company}
											</div>
										)}
									</div>
									<div mix={css({ textAlign: 'right' })}>
										<div mix={css({ fontWeight: 600 })}>
											{formatCurrency(data.totalAmount)}
										</div>
										<div mix={css({ fontSize: '0.8rem', color: '#888' })}>
											{formatDuration(data.totalMs)}
										</div>
									</div>
								</div>

								<div mix={css({ padding: '0.75rem 1.25rem' })}>
									{data.entries.map((entry) => {
										const ms =
											entry.endedAt !== null
												? entry.endedAt - entry.startedAt
												: 0;
										return (
											<div
												mix={css({
													display: 'flex',
													justifyContent: 'space-between',
													fontSize: '0.8rem',
													padding: '0.4rem 0',
													color: '#888',
													borderBottom: '1px solid #1e1e1e',
													'&:last-child': { borderBottom: 'none' },
												})}
											>
												<span>
													{entry.project.name}
													{entry.description ? ` — ${entry.description}` : ''}
												</span>
												<span>{formatDuration(ms)}</span>
											</div>
										);
									})}
								</div>

								<div
									mix={css({
										padding: '1rem 1.25rem',
										borderTop: '1px solid #2a2a2a',
									})}
								>
									<form
										method="POST"
										action="/invoices"
									>
										<input
											type="hidden"
											name="clientId"
											value={client.id}
										/>
										<button
											type="submit"
											class="btn btn-primary"
										>
											Create Invoice for {client.name}
										</button>
									</form>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</Layout>
	);

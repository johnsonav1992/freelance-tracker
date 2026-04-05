import { css } from 'remix/component';

import type { Client, Invoice, Project, TimeEntry } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { Layout } from '../../ui/layout.tsx';
import { RestfulForm } from '../../ui/restful-form.tsx';
import {
	formatCurrency,
	formatDate,
	formatDuration,
} from '../../utils/format.ts';

export const InvoiceShowPage =
	() =>
	({
		invoice,
		client,
		entries,
		rateFor,
	}: {
		invoice: Invoice;
		client: Client;
		entries: (TimeEntry & { project: Project })[];
		rateFor: (entry: TimeEntry & { project: Project }) => number;
	}) => {
		const lineItems = entries.map((entry) => {
			const ms = entry.endedAt !== null ? entry.endedAt - entry.startedAt : 0;
			const hours = ms / 3600000;
			const rate = rateFor(entry);
			const amount = hours * rate;
			return { entry, ms, hours, rate, amount };
		});

		const total = lineItems.reduce((sum, item) => sum + item.amount, 0);

		return (
			<Layout
				title={invoice.number}
				activeNav="invoices"
			>
				<div
					mix={css({
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						marginBottom: '1.5rem',
					})}
				>
					<div>
						<a
							href={routes.invoices.index.href()}
							mix={css({
								fontSize: '0.8rem',
								color: '#666',
								textDecoration: 'none',
								'&:hover': { color: '#818cf8' },
							})}
						>
							← Invoices
						</a>
						<h1
							mix={css({
								margin: '0.25rem 0 0',
								fontSize: '1.5rem',
								fontWeight: 700,
								fontFamily: 'monospace',
							})}
						>
							{invoice.number}
						</h1>
					</div>

					<div
						mix={css({ display: 'flex', gap: '0.5rem', alignItems: 'center' })}
					>
						<span
							class={`badge badge-${invoice.status}`}
							mix={css({ fontSize: '0.875rem' })}
						>
							{invoice.status}
						</span>
						{invoice.status === 'draft' && (
							<RestfulForm
								method="PUT"
								action={routes.invoices.update.href({ invoiceId: invoice.id })}
							>
								<input
									type="hidden"
									name="status"
									value="sent"
								/>
								<button
									type="submit"
									class="btn btn-secondary"
								>
									Mark Sent
								</button>
							</RestfulForm>
						)}
						{invoice.status === 'sent' && (
							<RestfulForm
								method="PUT"
								action={routes.invoices.update.href({ invoiceId: invoice.id })}
							>
								<input
									type="hidden"
									name="status"
									value="paid"
								/>
								<button
									type="submit"
									class="btn btn-primary"
								>
									Mark Paid
								</button>
							</RestfulForm>
						)}
						<RestfulForm
							method="DELETE"
							action={routes.invoices.destroy.href({ invoiceId: invoice.id })}
						>
							<button
								type="submit"
								class="btn btn-danger"
							>
								Delete
							</button>
						</RestfulForm>
					</div>
				</div>

				<div
					mix={css({
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: '1.5rem',
						marginBottom: '2rem',
					})}
				>
					<div
						mix={css({
							background: '#1a1a1a',
							borderRadius: '8px',
							padding: '1.25rem',
							border: '1px solid #2a2a2a',
						})}
					>
						<h2
							mix={css({
								margin: '0 0 1rem',
								fontSize: '0.875rem',
								color: '#666',
								textTransform: 'uppercase',
								letterSpacing: '0.05em',
							})}
						>
							Bill To
						</h2>
						<div mix={css({ fontWeight: 600 })}>{client.name}</div>
						{client.company && (
							<div mix={css({ fontSize: '0.875rem', color: '#888' })}>
								{client.company}
							</div>
						)}
						<div mix={css({ fontSize: '0.875rem', color: '#888' })}>
							{client.email}
						</div>
					</div>

					<div
						mix={css({
							background: '#1a1a1a',
							borderRadius: '8px',
							padding: '1.25rem',
							border: '1px solid #2a2a2a',
						})}
					>
						<h2
							mix={css({
								margin: '0 0 1rem',
								fontSize: '0.875rem',
								color: '#666',
								textTransform: 'uppercase',
								letterSpacing: '0.05em',
							})}
						>
							Details
						</h2>
						<dl
							mix={css({
								display: 'flex',
								flexDirection: 'column',
								gap: '0.5rem',
								margin: 0,
							})}
						>
							<div
								mix={css({ display: 'flex', justifyContent: 'space-between' })}
							>
								<dt mix={css({ fontSize: '0.8rem', color: '#555' })}>
									Created
								</dt>
								<dd mix={css({ margin: 0, fontSize: '0.8rem' })}>
									{formatDate(invoice.createdAt)}
								</dd>
							</div>
							{invoice.issuedAt && (
								<div
									mix={css({
										display: 'flex',
										justifyContent: 'space-between',
									})}
								>
									<dt mix={css({ fontSize: '0.8rem', color: '#555' })}>
										Issued
									</dt>
									<dd mix={css({ margin: 0, fontSize: '0.8rem' })}>
										{formatDate(invoice.issuedAt)}
									</dd>
								</div>
							)}
							{invoice.dueAt && (
								<div
									mix={css({
										display: 'flex',
										justifyContent: 'space-between',
									})}
								>
									<dt mix={css({ fontSize: '0.8rem', color: '#555' })}>Due</dt>
									<dd mix={css({ margin: 0, fontSize: '0.8rem' })}>
										{formatDate(invoice.dueAt)}
									</dd>
								</div>
							)}
						</dl>
					</div>
				</div>

				<div
					mix={css({
						background: '#1a1a1a',
						borderRadius: '8px',
						border: '1px solid #2a2a2a',
						overflow: 'hidden',
						marginBottom: '1.5rem',
					})}
				>
					<table mix={css({ width: '100%', borderCollapse: 'collapse' })}>
						<thead>
							<tr mix={css({ borderBottom: '1px solid #2a2a2a' })}>
								<th
									mix={css({
										padding: '0.75rem 1rem',
										textAlign: 'left',
										fontSize: '0.75rem',
										color: '#666',
										textTransform: 'uppercase',
										letterSpacing: '0.05em',
									})}
								>
									Description
								</th>
								<th
									mix={css({
										padding: '0.75rem 1rem',
										textAlign: 'right',
										fontSize: '0.75rem',
										color: '#666',
										textTransform: 'uppercase',
										letterSpacing: '0.05em',
									})}
								>
									Duration
								</th>
								<th
									mix={css({
										padding: '0.75rem 1rem',
										textAlign: 'right',
										fontSize: '0.75rem',
										color: '#666',
										textTransform: 'uppercase',
										letterSpacing: '0.05em',
									})}
								>
									Rate
								</th>
								<th
									mix={css({
										padding: '0.75rem 1rem',
										textAlign: 'right',
										fontSize: '0.75rem',
										color: '#666',
										textTransform: 'uppercase',
										letterSpacing: '0.05em',
									})}
								>
									Amount
								</th>
							</tr>
						</thead>
						<tbody>
							{lineItems.map(({ entry, ms, rate, amount }) => (
								<tr
									mix={css({
										borderBottom: '1px solid #1e1e1e',
										'&:last-child': { borderBottom: 'none' },
									})}
								>
									<td mix={css({ padding: '0.75rem 1rem' })}>
										<div mix={css({ fontSize: '0.875rem' })}>
											{entry.project.name}
										</div>
										{entry.description && (
											<div mix={css({ fontSize: '0.75rem', color: '#666' })}>
												{entry.description}
											</div>
										)}
										<div mix={css({ fontSize: '0.75rem', color: '#555' })}>
											{formatDate(entry.startedAt)}
										</div>
									</td>
									<td
										mix={css({
											padding: '0.75rem 1rem',
											textAlign: 'right',
											fontSize: '0.875rem',
										})}
									>
										{formatDuration(ms)}
									</td>
									<td
										mix={css({
											padding: '0.75rem 1rem',
											textAlign: 'right',
											fontSize: '0.875rem',
											color: '#888',
										})}
									>
										{formatCurrency(rate)}/hr
									</td>
									<td
										mix={css({
											padding: '0.75rem 1rem',
											textAlign: 'right',
											fontWeight: 500,
										})}
									>
										{formatCurrency(amount)}
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr mix={css({ borderTop: '1px solid #2a2a2a' })}>
								<td
									colspan={3}
									mix={css({
										padding: '1rem',
										textAlign: 'right',
										fontWeight: 600,
										color: '#888',
										fontSize: '0.875rem',
									})}
								>
									Total
								</td>
								<td
									mix={css({
										padding: '1rem',
										textAlign: 'right',
										fontWeight: 700,
										fontSize: '1.1rem',
									})}
								>
									{formatCurrency(total)}
								</td>
							</tr>
						</tfoot>
					</table>
				</div>

				{invoice.notes && (
					<div
						mix={css({
							background: '#1a1a1a',
							borderRadius: '8px',
							padding: '1.25rem',
							border: '1px solid #2a2a2a',
						})}
					>
						<h2
							mix={css({
								margin: '0 0 0.5rem',
								fontSize: '0.875rem',
								color: '#666',
								textTransform: 'uppercase',
								letterSpacing: '0.05em',
							})}
						>
							Notes
						</h2>
						<p mix={css({ margin: 0, fontSize: '0.875rem', color: '#888' })}>
							{invoice.notes}
						</p>
					</div>
				)}
			</Layout>
		);
	};

import { css } from 'remix/component';

import type { Client, Invoice } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import { formatCurrency, formatDate } from '../../utils/format.ts';

export const InvoicesIndexPage =
	() =>
	({
		invoices,
	}: {
		invoices: (Invoice & { client: Client; total: number })[];
	}) => (
		<Layout
			title="Invoices"
			activeNav="invoices"
		>
			<div
				mix={css({
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '1.5rem',
				})}
			>
				<h1 mix={css({ margin: 0, fontSize: '1.5rem', fontWeight: 700 })}>
					Invoices
				</h1>
				<a
					href={routes.invoices.new.href()}
					class="btn btn-primary"
				>
					+ Create Invoice
				</a>
			</div>

			{invoices.length === 0 ? (
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
					<p mix={css({ margin: 0 })}>No invoices yet.</p>
				</div>
			) : (
				<div
					mix={css({
						background: '#1a1a1a',
						borderRadius: '8px',
						border: '1px solid #2a2a2a',
						overflow: 'hidden',
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
									Invoice #
								</th>
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
									Client
								</th>
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
									Status
								</th>
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
									Issued
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
									Total
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
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{invoices.map((invoice) => (
								<tr
									mix={css({
										borderBottom: '1px solid #1e1e1e',
										'&:last-child': { borderBottom: 'none' },
										'&:hover': { background: '#1f1f1f' },
									})}
								>
									<td mix={css({ padding: '0.75rem 1rem' })}>
										<a
											href={routes.invoices.show.href({
												invoiceId: invoice.id,
											})}
											mix={css({
												color: '#e8e8e8',
												textDecoration: 'none',
												fontWeight: 500,
												fontFamily: 'monospace',
												'&:hover': { color: '#818cf8' },
											})}
										>
											{invoice.number}
										</a>
									</td>
									<td
										mix={css({
											padding: '0.75rem 1rem',
											color: '#888',
											fontSize: '0.875rem',
										})}
									>
										{invoice.client.name}
									</td>
									<td mix={css({ padding: '0.75rem 1rem' })}>
										<span class={`badge badge-${invoice.status}`}>
											{invoice.status}
										</span>
									</td>
									<td
										mix={css({
											padding: '0.75rem 1rem',
											color: '#888',
											fontSize: '0.875rem',
										})}
									>
										{invoice.issuedAt ? formatDate(invoice.issuedAt) : '—'}
									</td>
									<td
										mix={css({
											padding: '0.75rem 1rem',
											textAlign: 'right',
											fontWeight: 600,
										})}
									>
										{formatCurrency(invoice.total)}
									</td>
									<td
										mix={css({ padding: '0.75rem 1rem', textAlign: 'right' })}
									>
										<div
											mix={css({
												display: 'flex',
												gap: '0.5rem',
												justifyContent: 'flex-end',
											})}
										>
											<a
												href={routes.invoices.show.href({
													invoiceId: invoice.id,
												})}
												class="btn btn-secondary"
												mix={css({
													fontSize: '0.8rem',
													padding: '0.25rem 0.625rem',
												})}
											>
												View
											</a>
											<RestfulForm
												method="DELETE"
												action={routes.invoices.destroy.href({
													invoiceId: invoice.id,
												})}
												class="form-contents"
											>
												<button
													type="submit"
													class="btn btn-danger"
													mix={css({
														fontSize: '0.8rem',
														padding: '0.25rem 0.625rem',
													})}
												>
													Delete
												</button>
											</RestfulForm>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</Layout>
	);

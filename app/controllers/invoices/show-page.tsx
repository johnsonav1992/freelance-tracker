import type { Client, Invoice, Project, TimeEntry } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import { PageHeader, SectionCard } from '../../ui/Screen.tsx';
import {
	formatCurrency,
	formatDate,
	formatDuration,
} from '../../utils/format.ts';

export const InvoiceShowPage = () => {
	return ({
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
			return { entry, ms, rate, amount };
		});

		const total = lineItems.reduce((sum, item) => sum + item.amount, 0);

		return (
			<Layout
				title={invoice.number}
				activeNav="invoices"
			>
				<a
					href={routes.invoices.index.href()}
					class="breadcrumb"
				>
					← Back to invoices
				</a>

				<PageHeader
					eyebrow="Invoice"
					title={invoice.number}
					subtitle={`Billing ${client.name}`}
					actions={
						<>
							<span class={`badge badge-${invoice.status}`}>
								{invoice.status}
							</span>
							{invoice.status === 'draft' && (
								<RestfulForm
									method="PUT"
									action={routes.invoices.update.href({
										invoiceId: invoice.id,
									})}
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
										Mark sent
									</button>
								</RestfulForm>
							)}
							{invoice.status === 'sent' && (
								<RestfulForm
									method="PUT"
									action={routes.invoices.update.href({
										invoiceId: invoice.id,
									})}
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
										Mark paid
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
						</>
					}
				/>

				<div class="detail-grid">
					<SectionCard
						title="Bill to"
						subtitle="Client details attached to this invoice."
					>
						<dl class="detail-list">
							<div>
								<dt>Client</dt>
								<dd>{client.name}</dd>
							</div>
							<div>
								<dt>Company</dt>
								<dd>{client.company || 'Not set'}</dd>
							</div>
							<div>
								<dt>Email</dt>
								<dd>{client.email}</dd>
							</div>
							<div>
								<dt>Status</dt>
								<dd>
									<span class={`badge badge-${invoice.status}`}>
										{invoice.status}
									</span>
								</dd>
							</div>
						</dl>
					</SectionCard>

					<SectionCard
						title="Invoice details"
						subtitle="Key dates and the total due."
						tone="tint"
					>
						<dl class="detail-list">
							<div>
								<dt>Created</dt>
								<dd>{formatDate(invoice.createdAt)}</dd>
							</div>
							<div>
								<dt>Issued</dt>
								<dd>
									{invoice.issuedAt
										? formatDate(invoice.issuedAt)
										: 'Not issued'}
								</dd>
							</div>
							<div>
								<dt>Due</dt>
								<dd>
									{invoice.dueAt ? formatDate(invoice.dueAt) : 'No due date'}
								</dd>
							</div>
							<div>
								<dt>Total</dt>
								<dd>{formatCurrency(total)}</dd>
							</div>
						</dl>
					</SectionCard>
				</div>

				<SectionCard
					title="Line items"
					subtitle="Tracked work included on this invoice."
				>
					<div class="table-shell">
						<table>
							<thead>
								<tr>
									<th>Description</th>
									<th>Duration</th>
									<th>Rate</th>
									<th>Amount</th>
								</tr>
							</thead>
							<tbody>
								{lineItems.map(({ entry, ms, rate, amount }) => (
									<tr>
										<td>
											<div class="stack-sm">
												<strong>{entry.project.name}</strong>
												{entry.description && (
													<span class="muted">{entry.description}</span>
												)}
												<span class="muted">{formatDate(entry.startedAt)}</span>
											</div>
										</td>
										<td>{formatDuration(ms)}</td>
										<td>{formatCurrency(rate)}/hr</td>
										<td>{formatCurrency(amount)}</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr>
									<td colspan={3}>
										<strong>Total</strong>
									</td>
									<td>
										<strong>{formatCurrency(total)}</strong>
									</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</SectionCard>

				{invoice.notes && (
					<SectionCard
						title="Notes"
						subtitle="Anything extra attached to this invoice."
					>
						<p class="list-item-text">{invoice.notes}</p>
					</SectionCard>
				)}
			</Layout>
		);
	};
};

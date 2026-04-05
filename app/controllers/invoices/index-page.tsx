import type { Client, Invoice } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import { EmptyState, PageHeader, SectionCard } from '../../ui/Screen.tsx';
import { formatCurrency, formatDate } from '../../utils/format.ts';

export const InvoicesIndexPage = () => {
	return ({
		invoices,
	}: {
		invoices: (Invoice & { client: Client; total: number })[];
	}) => (
		<Layout
			title="Invoices"
			activeNav="invoices"
		>
			<PageHeader
				eyebrow="Invoices"
				title="Stay on top of what you’ve billed."
				subtitle="Draft invoices, sent invoices, and paid invoices are all in one scan-friendly list."
				actions={
					<a
						href={routes.invoices.new.href()}
						class="btn btn-primary"
					>
						Create invoice
					</a>
				}
			/>

			{invoices.length === 0 ? (
				<EmptyState
					title="No invoices yet"
					description="Create an invoice from unbilled time when you’re ready to turn completed work into revenue."
					action={
						<a
							href={routes.invoices.new.href()}
							class="btn btn-primary"
						>
							Start invoicing
						</a>
					}
				/>
			) : (
				<SectionCard
					title={`${invoices.length} invoice${invoices.length === 1 ? '' : 's'}`}
					subtitle="Open an invoice to review line items or update its status."
				>
					<div class="list-stack">
						{invoices.map((invoice) => (
							<div class="list-item">
								<div class="list-item-primary">
									<p class="list-item-title">
										<a
											href={routes.invoices.show.href({
												invoiceId: invoice.id,
											})}
										>
											<span class="mono">{invoice.number}</span>
										</a>
									</p>
									<p class="list-item-text">{invoice.client.name}</p>
									<div class="meta-row">
										<span class={`badge badge-${invoice.status}`}>
											{invoice.status}
										</span>
										<span class="meta-dot" />
										<span>
											{invoice.issuedAt
												? `Issued ${formatDate(invoice.issuedAt)}`
												: 'Not issued yet'}
										</span>
									</div>
								</div>
								<div class="list-item-side">
									<div class="value-block">
										<div class="value-label">Total</div>
										<div class="value-main">
											{formatCurrency(invoice.total)}
										</div>
									</div>
									<div class="inline-actions">
										<a
											href={routes.invoices.show.href({
												invoiceId: invoice.id,
											})}
											class="btn btn-secondary btn-sm"
										>
											Open
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
												class="btn btn-danger btn-sm"
											>
												Delete
											</button>
										</RestfulForm>
									</div>
								</div>
							</div>
						))}
					</div>
				</SectionCard>
			)}
		</Layout>
	);
};

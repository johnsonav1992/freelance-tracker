import type { Client, Project, TimeEntry } from '../../data/schema.ts';
import { Layout } from '../../ui/Layout.tsx';
import { EmptyState, PageHeader, SectionCard } from '../../ui/Screen.tsx';
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

export const InvoiceFormPage = () => {
	return ({ clients, unbilledByClient }: InvoiceFormPageProps) => (
		<Layout
			title="Create Invoice"
			activeNav="invoices"
		>
			<PageHeader
				eyebrow="Invoices"
				title="Create an invoice from unbilled work."
				subtitle="Each client below has finished billable time ready to group into a new invoice."
			/>

			{clients.length === 0 ? (
				<EmptyState
					title="Nothing ready to invoice"
					description="Once you finish billable time entries, they’ll show up here grouped by client."
				/>
			) : (
				<div class="list-stack">
					{clients.map((client) => {
						const data = unbilledByClient.get(client.id);
						if (!data || data.entries.length === 0) return null;

						return (
							<SectionCard
								title={client.name}
								subtitle={client.company || 'Independent client'}
								actions={
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
											class="btn btn-primary btn-sm"
										>
											Create invoice
										</button>
									</form>
								}
								tone="tint"
							>
								<div class="triptych-grid">
									<div class="metric-card">
										<div class="metric-label">Entries</div>
										<div class="metric-value">
											{String(data.entries.length)}
										</div>
									</div>
									<div class="metric-card">
										<div class="metric-label">Time</div>
										<div class="metric-value">
											{formatDuration(data.totalMs)}
										</div>
									</div>
									<div class="metric-card metric-card-accent">
										<div class="metric-label">Amount</div>
										<div class="metric-value">
											{formatCurrency(data.totalAmount)}
										</div>
									</div>
								</div>

								<div class="list-stack">
									{data.entries.map((entry) => {
										const ms =
											entry.endedAt !== null
												? entry.endedAt - entry.startedAt
												: 0;

										return (
											<div class="list-item">
												<div class="list-item-primary">
													<p class="list-item-title">{entry.project.name}</p>
													<p class="list-item-text">
														{entry.description || 'No work note added.'}
													</p>
												</div>
												<div class="list-item-side">
													<div class="value-block">
														<div class="value-label">Duration</div>
														<div class="value-main">{formatDuration(ms)}</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</SectionCard>
						);
					})}
				</div>
			)}
		</Layout>
	);
};

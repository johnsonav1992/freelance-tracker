import type { Client } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import { EmptyState, PageHeader, SectionCard } from '../../ui/Screen.tsx';
import { formatCurrency, formatDate } from '../../utils/format.ts';

export const ClientsIndexPage = () => {
	return ({ clients }: { clients: Client[] }) => (
		<Layout
			title="Clients"
			activeNav="clients"
		>
			<PageHeader
				eyebrow="Clients"
				title="Keep your client list clean."
				subtitle="Every client carries the contact details and baseline rate that the rest of the app relies on."
				actions={
					<a
						href={routes.clients.new.href()}
						class="btn btn-primary"
					>
						New client
					</a>
				}
			/>

			{clients.length === 0 ? (
				<EmptyState
					title="No clients yet"
					description="Create your first client so projects, tracked time, and invoices all have somewhere sensible to live."
					action={
						<a
							href={routes.clients.new.href()}
							class="btn btn-primary"
						>
							Create client
						</a>
					}
				/>
			) : (
				<SectionCard
					title={`${clients.length} client${clients.length === 1 ? '' : 's'}`}
					subtitle="Open a client to see projects and contact details."
				>
					<div class="list-stack">
						{clients.map((client) => (
							<div class="list-item">
								<div class="list-item-primary">
									<p class="list-item-title">
										<a href={routes.clients.show.href({ clientId: client.id })}>
											{client.name}
										</a>
									</p>
									<p class="list-item-text">
										{client.company || 'Independent client'}
									</p>
									<div class="meta-row">
										<strong>{client.email}</strong>
										<span class="meta-dot" />
										<span>Client since {formatDate(client.createdAt)}</span>
									</div>
								</div>
								<div class="list-item-side">
									<div class="value-block">
										<div class="value-label">Rate</div>
										<div class="value-main">
											{formatCurrency(client.hourlyRate)}/hr
										</div>
									</div>
									<div class="inline-actions">
										<a
											href={routes.clients.edit.href({ clientId: client.id })}
											class="btn btn-secondary btn-sm"
										>
											Edit
										</a>
										<RestfulForm
											method="DELETE"
											action={routes.clients.destroy.href({
												clientId: client.id,
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

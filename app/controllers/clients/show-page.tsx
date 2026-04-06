import type { Client, Project } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { AppLink } from '../../ui/AppLink.tsx';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import { EmptyState, PageHeader, SectionCard } from '../../ui/Screen.tsx';
import { formatCurrency, formatDate } from '../../utils/format.ts';

export const ClientShowPage = () => {
	return ({ client, projects }: { client: Client; projects: Project[] }) => (
		<Layout
			title={client.name}
			activeNav="clients"
		>
			<AppLink
				href={routes.clients.index.href()}
				class="breadcrumb"
			>
				← Back to clients
			</AppLink>

			<PageHeader
				eyebrow="Client"
				title={client.name}
				subtitle={client.company || 'No company set'}
				actions={
					<>
						<AppLink
							href={routes.clients.edit.href({ clientId: client.id })}
							class="btn btn-secondary"
						>
							Edit client
						</AppLink>
						<RestfulForm
							method="DELETE"
							action={routes.clients.destroy.href({ clientId: client.id })}
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
					title="Contact details"
					subtitle="Primary contact information."
				>
					<dl class="detail-list">
						<div>
							<dt>Email</dt>
							<dd>
								<a href={`mailto:${client.email}`}>{client.email}</a>
							</dd>
						</div>
						<div>
							<dt>Hourly rate</dt>
							<dd>{formatCurrency(client.hourlyRate)}/hr</dd>
						</div>
						<div>
							<dt>Company</dt>
							<dd>{client.company || 'Not set'}</dd>
						</div>
						<div>
							<dt>Client since</dt>
							<dd>{formatDate(client.createdAt)}</dd>
						</div>
					</dl>
				</SectionCard>

				<SectionCard
					title="Summary"
					subtitle="Project count and default rate."
					tone="tint"
				>
					<div class="triptych-grid">
						<div class="metric-card">
							<div class="metric-label">Projects</div>
							<div class="metric-value">{String(projects.length)}</div>
						</div>
						<div class="metric-card">
							<div class="metric-label">Active</div>
							<div class="metric-value">
								{String(
									projects.filter((project) => project.status === 'active')
										.length,
								)}
							</div>
						</div>
						<div class="metric-card">
							<div class="metric-label">Default rate</div>
							<div class="metric-value">
								{formatCurrency(client.hourlyRate)}
							</div>
						</div>
					</div>
				</SectionCard>
			</div>

			<SectionCard
				title="Projects for this client"
				subtitle="Projects linked to this client."
				actions={
					<AppLink
						href={`${routes.projects.new.href()}?clientId=${client.id}`}
						class="btn btn-primary btn-sm"
					>
						New project
					</AppLink>
				}
			>
				{projects.length === 0 ? (
					<EmptyState
						title="No projects yet"
						description="Create a project to start tracking work for this client."
					/>
				) : (
					<div class="list-stack">
						{projects.map((project) => (
							<div class="list-item">
								<div class="list-item-primary">
									<div class="list-item-title">
										<AppLink
											href={routes.projects.show.href({
												projectId: project.id,
											})}
										>
											{project.name}
										</AppLink>
									</div>
									<p class="list-item-text">
										{project.description || 'No description.'}
									</p>
								</div>
								<div class="list-item-side">
									{project.rateOverride && (
										<div class="value-block">
											<div class="value-label">Custom rate</div>
											<div class="value-main">
												{formatCurrency(project.rateOverride)}/hr
											</div>
										</div>
									)}
									<span class={`badge badge-${project.status}`}>
										{project.status}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</SectionCard>
		</Layout>
	);
};

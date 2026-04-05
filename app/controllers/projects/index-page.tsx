import type { Client, Project } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { AppLink } from '../../ui/AppLink.tsx';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import { EmptyState, PageHeader, SectionCard } from '../../ui/Screen.tsx';
import { formatCurrency } from '../../utils/format.ts';

export const ProjectsIndexPage = () => {
	return ({ projects }: { projects: (Project & { client: Client })[] }) => (
		<Layout
			title="Projects"
			activeNav="projects"
		>
			<PageHeader
				eyebrow="Projects"
				title="Projects"
				subtitle="Project status, client, and rate."
				actions={
					<AppLink
						href={routes.projects.new.href()}
						class="btn btn-primary"
					>
						New project
					</AppLink>
				}
			/>

			{projects.length === 0 ? (
				<EmptyState
					title="No projects yet"
					description="Create a project after adding a client. That gives your time entries and invoices a proper home."
					action={
						<AppLink
							href={routes.projects.new.href()}
							class="btn btn-primary"
						>
							Create project
						</AppLink>
					}
				/>
			) : (
				<SectionCard
					title={`${projects.length} project${projects.length === 1 ? '' : 's'}`}
					subtitle="Project rate overrides the client rate when set."
				>
					<div class="list-stack">
						{projects.map((project) => (
							<div class="list-item">
								<div class="list-item-primary">
									<p class="list-item-title">
										<AppLink
											href={routes.projects.show.href({
												projectId: project.id,
											})}
										>
											{project.name}
										</AppLink>
									</p>
									<p class="list-item-text">
										{project.description || 'No project summary yet.'}
									</p>
									<div class="meta-row">
										<strong>{project.client.name}</strong>
										<span class="meta-dot" />
										<span class={`badge badge-${project.status}`}>
											{project.status}
										</span>
									</div>
								</div>
								<div class="list-item-side">
									<div class="value-block">
										<div class="value-label">Rate</div>
										<div class="value-main">
											{formatCurrency(
												project.rateOverride ?? project.client.hourlyRate,
											)}
											/hr
										</div>
										{project.rateOverride && (
											<div class="value-sub">
												Overrides client default of{' '}
												{formatCurrency(project.client.hourlyRate)}/hr
											</div>
										)}
									</div>
									<div class="inline-actions">
										<AppLink
											href={routes.projects.edit.href({
												projectId: project.id,
											})}
											class="btn btn-secondary btn-sm"
										>
											Edit
										</AppLink>
										<RestfulForm
											method="DELETE"
											action={routes.projects.destroy.href({
												projectId: project.id,
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

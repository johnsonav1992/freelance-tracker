import type { Client, Project } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import { PageHeader } from '../../ui/Screen.tsx';

export interface ProjectFormPageProps {
	action: string;
	method?: 'POST' | 'PUT';
	project?: Project;
	clients: Client[];
	defaultClientId?: number;
}

export const ProjectFormPage = () => {
	return ({
		action,
		method = 'POST',
		project,
		clients,
		defaultClientId,
	}: ProjectFormPageProps) => (
		<Layout
			title={project ? 'Edit Project' : 'New Project'}
			activeNav="projects"
		>
			<PageHeader
				eyebrow="Projects"
				title={project ? 'Edit project' : 'Create a project'}
				subtitle="Set the client, status, and any pricing overrides. Everything else in the app builds from this."
			/>

			<div class="form-card">
				<RestfulForm
					method={method}
					action={action}
				>
					<div class="form-grid">
						<div class="form-group">
							<label for="clientId">Client</label>
							<select
								id="clientId"
								name="clientId"
								required
							>
								<option value="">Select a client…</option>
								{clients.map((client) => (
									<option
										value={client.id}
										selected={
											project
												? project.clientId === client.id
												: defaultClientId === client.id
										}
									>
										{client.name}
									</option>
								))}
							</select>
						</div>

						<div class="form-group">
							<label for="name">Project name</label>
							<input
								type="text"
								id="name"
								name="name"
								value={project?.name}
								required
								placeholder="Website refresh"
							/>
						</div>

						<div class="form-group">
							<label for="description">Project summary</label>
							<textarea
								id="description"
								name="description"
								rows={4}
								placeholder="What is this project, and what kind of work does it cover?"
							>
								{project?.description ?? ''}
							</textarea>
						</div>

						<div class="field-grid">
							<div class="form-group">
								<label for="status">Status</label>
								<select
									id="status"
									name="status"
									required
								>
									<option
										value="active"
										selected={!project || project.status === 'active'}
									>
										Active
									</option>
									<option
										value="paused"
										selected={project?.status === 'paused'}
									>
										Paused
									</option>
									<option
										value="done"
										selected={project?.status === 'done'}
									>
										Done
									</option>
								</select>
							</div>

							<div class="form-group">
								<label for="rateOverride">Project-specific hourly rate</label>
								<input
									type="number"
									id="rateOverride"
									name="rateOverride"
									step="0.01"
									min="0"
									value={project?.rateOverride ?? ''}
									placeholder="Leave blank to use client rate"
								/>
							</div>
						</div>

						<div class="field-grid">
							<div class="form-group">
								<label for="manualHours">Manual carry-over hours</label>
								<input
									type="number"
									id="manualHours"
									name="manualHours"
									step="0.01"
									min="0"
									value={project?.manualHours ?? ''}
									placeholder="Hours done before tracking here"
								/>
							</div>

							<div class="form-group">
								<label for="manualAmount">Manual amount override</label>
								<input
									type="number"
									id="manualAmount"
									name="manualAmount"
									step="0.01"
									min="0"
									value={project?.manualAmount ?? ''}
									placeholder="Optional fixed amount"
								/>
							</div>
						</div>

						<div class="field-hint">
							Use manual values only when some work happened before you started
							tracking this project in the app.
						</div>

						<div class="form-actions">
							<button
								type="submit"
								class="btn btn-primary"
							>
								{project ? 'Save changes' : 'Create project'}
							</button>
							<a
								href={routes.projects.index.href()}
								class="btn btn-secondary"
							>
								Cancel
							</a>
						</div>
					</div>
				</RestfulForm>
			</div>
		</Layout>
	);
};

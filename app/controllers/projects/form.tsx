import type { Client, Project } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { AppLink } from '../../ui/AppLink.tsx';
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
				title={project ? 'Edit project' : 'New project'}
				subtitle="Client, status, rate, and optional manual carry-over."
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
								defaultValue={
									project
										? String(project.clientId)
										: defaultClientId
											? String(defaultClientId)
											: ''
								}
								required
							>
								<option value="">Select a client…</option>
								{clients.map((client) => (
									<option value={client.id}>{client.name}</option>
								))}
							</select>
						</div>

						<div class="form-group">
							<label for="name">Project name</label>
							<input
								type="text"
								id="name"
								name="name"
								defaultValue={project?.name}
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
								defaultValue={project?.description ?? ''}
								placeholder="What is this project, and what kind of work does it cover?"
							/>
						</div>

						<div class="field-grid">
							<div class="form-group">
								<label for="status">Status</label>
								<select
									id="status"
									name="status"
									defaultValue={project?.status ?? 'active'}
									required
								>
									<option value="active">Active</option>
									<option value="paused">Paused</option>
									<option value="done">Done</option>
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
									defaultValue={project?.rateOverride ?? ''}
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
									defaultValue={project?.manualHours ?? ''}
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
									defaultValue={project?.manualAmount ?? ''}
									placeholder="Optional fixed amount"
								/>
							</div>
						</div>

						<div class="field-hint">
							Use manual values only for work tracked outside this app.
						</div>

						<div class="form-actions">
							<button
								type="submit"
								class="btn btn-primary"
							>
								{project ? 'Save changes' : 'Create project'}
							</button>
							<AppLink
								href={routes.projects.index.href()}
								class="btn btn-secondary"
							>
								Cancel
							</AppLink>
						</div>
					</div>
				</RestfulForm>
			</div>
		</Layout>
	);
};

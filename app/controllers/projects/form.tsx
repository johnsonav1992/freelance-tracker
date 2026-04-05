import { css } from 'remix/component';

import type { Client, Project } from '../../data/schema.ts';
import { Layout } from '../../ui/layout.tsx';
import { RestfulForm } from '../../ui/restful-form.tsx';

export interface ProjectFormPageProps {
	action: string;
	method?: 'POST' | 'PUT';
	project?: Project;
	clients: Client[];
	defaultClientId?: number;
}

export const ProjectFormPage =
	() =>
	({
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
			<div mix={css({ marginBottom: '1.5rem' })}>
				<h1 mix={css({ margin: 0, fontSize: '1.5rem', fontWeight: 700 })}>
					{project ? 'Edit Project' : 'New Project'}
				</h1>
			</div>

			<div
				mix={css({
					background: '#1a1a1a',
					borderRadius: '8px',
					padding: '1.5rem',
					border: '1px solid #2a2a2a',
					maxWidth: '560px',
				})}
			>
				<RestfulForm
					method={method}
					action={action}
				>
					<div
						mix={css({ display: 'flex', flexDirection: 'column', gap: '1rem' })}
					>
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
							<label for="name">Project Name</label>
							<input
								type="text"
								id="name"
								name="name"
								value={project?.name}
								required
								placeholder="Website Redesign"
							/>
						</div>

						<div class="form-group">
							<label for="description">Description (optional)</label>
							<textarea
								id="description"
								name="description"
								rows={3}
								placeholder="Brief description of the project"
							>
								{project?.description ?? ''}
							</textarea>
						</div>

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
							<label for="rateOverride">Rate Override (optional)</label>
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

					<div
						mix={css({ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' })}
					>
						<button
							type="submit"
							class="btn btn-primary"
						>
							{project ? 'Update Project' : 'Create Project'}
						</button>
						<a
							href="/projects"
							class="btn btn-secondary"
						>
							Cancel
						</a>
					</div>
				</RestfulForm>
			</div>
		</Layout>
	);

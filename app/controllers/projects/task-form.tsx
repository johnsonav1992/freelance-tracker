import type { Project, ProjectTask } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { AppLink } from '../../ui/AppLink.tsx';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import { PageHeader } from '../../ui/Screen.tsx';

export interface ProjectTaskFormPageProps {
	action: string;
	method?: 'POST' | 'PUT';
	project: Project;
	task?: ProjectTask;
}

export const ProjectTaskFormPage = () => {
	return ({
		action,
		method = 'POST',
		project,
		task,
	}: ProjectTaskFormPageProps) => (
		<Layout
			title={task ? 'Edit Task' : 'New Task'}
			activeNav="projects"
		>
			<AppLink
				href={routes.projects.workspace.tasks.href({ projectId: project.id })}
				class="breadcrumb"
			>
				← Back to project
			</AppLink>

			<PageHeader
				eyebrow="Project task"
				title={task ? 'Edit task' : 'New task'}
				subtitle={project.name}
			/>

			<div class="form-card">
				<RestfulForm
					method={method}
					action={action}
				>
					<div class="form-grid">
						<div class="form-group">
							<label for="title">Title</label>
							<input
								type="text"
								id="title"
								name="title"
								defaultValue={task?.title}
								required
								placeholder="Homepage revisions"
							/>
						</div>

						<div class="form-group">
							<label for="description">Description</label>
							<textarea
								id="description"
								name="description"
								rows={4}
								defaultValue={task?.description ?? ''}
								placeholder="Optional notes for this task"
							/>
						</div>

						<div class="form-group">
							<label for="status">Status</label>
							<select
								id="status"
								name="status"
								defaultValue={task?.status ?? 'todo'}
								required
							>
								<option value="todo">Todo</option>
								<option value="in_progress">In progress</option>
								<option value="done">Done</option>
							</select>
						</div>

						<div class="form-actions">
							<button
								type="submit"
								class="btn btn-primary"
							>
								{task ? 'Save changes' : 'Create task'}
							</button>
							<AppLink
								href={routes.projects.workspace.tasks.href({
									projectId: project.id,
								})}
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

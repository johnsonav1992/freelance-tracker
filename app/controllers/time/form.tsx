import type {
	Client,
	Project,
	ProjectTask,
	TimeEntry,
} from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { AppLink } from '../../ui/AppLink.tsx';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import { PageHeader } from '../../ui/Screen.tsx';

export interface TimeEntryFormPageProps {
	action: string;
	method?: 'POST' | 'PUT';
	entry?: TimeEntry;
	projects: (Project & { client: Client })[];
	tasks: (ProjectTask & { project: Project & { client: Client } })[];
	defaultProjectId?: number;
	defaultTaskId?: number;
}

export const TimeEntryFormPage = () => {
	return ({
		action,
		method = 'POST',
		entry,
		projects,
		tasks,
		defaultProjectId,
		defaultTaskId,
	}: TimeEntryFormPageProps) => {
		const toDatetimeLocal = (ms: number) => {
			const d = new Date(ms);
			const pad = (n: number) => String(n).padStart(2, '0');
			return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
		};

		return (
			<Layout
				title={entry ? 'Edit Time Entry' : 'Log Time'}
				activeNav="time"
			>
				<PageHeader
					eyebrow="Time"
					title={entry ? 'Edit time entry' : 'Log time'}
					subtitle="Project, description, times, and billable status."
				/>

				<div class="form-card">
					<RestfulForm
						method={method}
						action={action}
					>
						<div class="form-grid">
							<div class="form-group">
								<label for="projectId">Project</label>
								<select
									id="projectId"
									name="projectId"
									defaultValue={
										entry
											? String(entry.projectId)
											: defaultProjectId
												? String(defaultProjectId)
												: ''
									}
									required
								>
									<option value="">Select a project…</option>
									{projects.map((project) => (
										<option value={project.id}>
											{project.client.name} — {project.name}
										</option>
									))}
								</select>
							</div>

							<div class="form-group">
								<label for="description">Work note</label>
								<input
									type="text"
									id="description"
									name="description"
									defaultValue={entry?.description ?? ''}
									placeholder="What did you work on?"
								/>
							</div>

							<div class="form-group">
								<label for="taskId">Task</label>
								<select
									id="taskId"
									name="taskId"
									defaultValue={
										entry?.taskId
											? String(entry.taskId)
											: defaultTaskId
												? String(defaultTaskId)
												: ''
									}
								>
									<option value="">No task</option>
									{tasks.map((task) => (
										<option value={task.id}>
											{task.project.name} — {task.title}
										</option>
									))}
								</select>
								<div class="field-hint">
									Optional. Use a task under the selected project.
								</div>
							</div>

							<div class="field-grid">
								<div class="form-group">
									<label for="startedAt">Start time</label>
									<input
										type="datetime-local"
										id="startedAt"
										name="startedAt"
										defaultValue={
											entry
												? toDatetimeLocal(entry.startedAt)
												: toDatetimeLocal(Date.now())
										}
										required
									/>
								</div>

								<div class="form-group">
									<label for="endedAt">End time</label>
									<input
										type="datetime-local"
										id="endedAt"
										name="endedAt"
										defaultValue={
											entry?.endedAt ? toDatetimeLocal(entry.endedAt) : ''
										}
									/>
									<div class="field-hint">Leave blank for a running entry.</div>
								</div>
							</div>

							<label class="checkbox-card">
								<input
									type="checkbox"
									name="billable"
									value="true"
									defaultChecked={entry ? entry.billable : true}
								/>
								<span class="checkbox-copy">
									<strong>Billable entry</strong>
									<span>Include this entry in invoice creation.</span>
								</span>
							</label>

							<div class="form-actions">
								<button
									type="submit"
									class="btn btn-primary"
								>
									{entry ? 'Save changes' : 'Save entry'}
								</button>
								<AppLink
									href={routes.time.index.href()}
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
};

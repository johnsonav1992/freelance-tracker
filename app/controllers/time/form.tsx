import type { Client, Project, TimeEntry } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import { PageHeader } from '../../ui/Screen.tsx';

export interface TimeEntryFormPageProps {
	action: string;
	method?: 'POST' | 'PUT';
	entry?: TimeEntry;
	projects: (Project & { client: Client })[];
	defaultProjectId?: number;
}

export const TimeEntryFormPage = () => {
	return ({
		action,
		method = 'POST',
		entry,
		projects,
		defaultProjectId,
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
					subtitle="Record exactly what you worked on, when it started, and whether it should be billable."
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
									required
								>
									<option value="">Select a project…</option>
									{projects.map((project) => (
										<option
											value={project.id}
											selected={
												entry
													? entry.projectId === project.id
													: defaultProjectId === project.id
											}
										>
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
									value={entry?.description ?? ''}
									placeholder="What did you work on?"
								/>
							</div>

							<div class="field-grid">
								<div class="form-group">
									<label for="startedAt">Start time</label>
									<input
										type="datetime-local"
										id="startedAt"
										name="startedAt"
										value={
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
										value={entry?.endedAt ? toDatetimeLocal(entry.endedAt) : ''}
									/>
									<div class="field-hint">
										Leave this blank if the timer is still running.
									</div>
								</div>
							</div>

							<label class="checkbox-card">
								<input
									type="checkbox"
									name="billable"
									value="true"
									checked={entry ? entry.billable : true}
								/>
								<span class="checkbox-copy">
									<strong>Billable entry</strong>
									<span>
										Include this time when you prepare invoices later.
									</span>
								</span>
							</label>

							<div class="form-actions">
								<button
									type="submit"
									class="btn btn-primary"
								>
									{entry ? 'Save changes' : 'Save entry'}
								</button>
								<a
									href={routes.time.index.href()}
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
};

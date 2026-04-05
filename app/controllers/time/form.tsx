import { css } from 'remix/component';

import type { Client, Project, TimeEntry } from '../../data/schema.ts';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';

export interface TimeEntryFormPageProps {
	action: string;
	method?: 'POST' | 'PUT';
	entry?: TimeEntry;
	projects: (Project & { client: Client })[];
	defaultProjectId?: number;
}

export const TimeEntryFormPage =
	() =>
	({
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
				<div mix={css({ marginBottom: '1.5rem' })}>
					<h1 mix={css({ margin: 0, fontSize: '1.5rem', fontWeight: 700 })}>
						{entry ? 'Edit Time Entry' : 'Log Time'}
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
							mix={css({
								display: 'flex',
								flexDirection: 'column',
								gap: '1rem',
							})}
						>
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
								<label for="description">Description (optional)</label>
								<input
									type="text"
									id="description"
									name="description"
									value={entry?.description ?? ''}
									placeholder="What did you work on?"
								/>
							</div>

							<div
								mix={css({
									display: 'grid',
									gridTemplateColumns: '1fr 1fr',
									gap: '1rem',
								})}
							>
								<div class="form-group">
									<label for="startedAt">Start Time</label>
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
									<label for="endedAt">End Time</label>
									<input
										type="datetime-local"
										id="endedAt"
										name="endedAt"
										value={entry?.endedAt ? toDatetimeLocal(entry.endedAt) : ''}
									/>
								</div>
							</div>

							<div class="form-group">
								<label
									mix={css({
										display: 'flex',
										alignItems: 'center',
										gap: '0.5rem',
										cursor: 'pointer',
									})}
								>
									<input
										type="checkbox"
										name="billable"
										value="true"
										checked={entry ? entry.billable : true}
									/>
									Billable
								</label>
							</div>
						</div>

						<div
							mix={css({
								marginTop: '1.5rem',
								display: 'flex',
								gap: '0.75rem',
							})}
						>
							<button
								type="submit"
								class="btn btn-primary"
							>
								{entry ? 'Update Entry' : 'Save Entry'}
							</button>
							<a
								href="/time"
								class="btn btn-secondary"
							>
								Cancel
							</a>
						</div>
					</RestfulForm>
				</div>
			</Layout>
		);
	};

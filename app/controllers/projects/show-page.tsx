import { Timer } from '../../assets/timer.tsx';
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
import { EmptyState, PageHeader, SectionCard } from '../../ui/Screen.tsx';
import {
	formatCurrency,
	formatDate,
	formatDuration,
} from '../../utils/format.ts';

export const ProjectShowPage = () => {
	return ({
		project,
		client,
		entries,
		tasks,
		runningEntry,
	}: {
		project: Project;
		client: Client;
		entries: TimeEntry[];
		tasks: ProjectTask[];
		runningEntry: TimeEntry | null;
	}) => {
		const effectiveRate = project.rateOverride ?? client.hourlyRate;
		const finishedEntries = entries.filter((entry) => entry.endedAt !== null);
		const trackedMs = finishedEntries.reduce(
			(sum, entry) => sum + ((entry.endedAt ?? 0) - entry.startedAt),
			0,
		);
		const totalMs = trackedMs + (project.manualHours ?? 0) * 3600000;
		const trackedAmount = finishedEntries.reduce((sum, entry) => {
			const hours = ((entry.endedAt ?? 0) - entry.startedAt) / 3600000;
			return sum + hours * effectiveRate;
		}, 0);
		const totalAmount =
			project.manualAmount ??
			trackedAmount + (project.manualHours ?? 0) * effectiveRate;
		const taskMap = new Map(tasks.map((task) => [task.id, task]));

		return (
			<Layout
				title={project.name}
				activeNav="projects"
			>
				<AppLink
					href={routes.projects.index.href()}
					class="breadcrumb"
				>
					← Back to projects
				</AppLink>

				<PageHeader
					eyebrow="Project"
					title={project.name}
					subtitle={client.name}
					actions={
						<>
							{!runningEntry && (
								<RestfulForm
									method="POST"
									action={routes.time.create.href()}
								>
									<input
										type="hidden"
										name="projectId"
										value={project.id}
									/>
									<input
										type="hidden"
										name="billable"
										value="true"
									/>
									<button
										type="submit"
										class="btn btn-primary"
									>
										Start timer
									</button>
								</RestfulForm>
							)}
							<AppLink
								href={routes.projects.edit.href({ projectId: project.id })}
								class="btn btn-secondary"
							>
								Edit project
							</AppLink>
							<RestfulForm
								method="DELETE"
								action={routes.projects.destroy.href({ projectId: project.id })}
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

				{runningEntry && (
					<SectionCard
						title="Timer running"
						subtitle="Active entry for this project."
						actions={
							<Timer
								setup={{
									entryId: runningEntry.id,
									startedAt: runningEntry.startedAt,
								}}
							/>
						}
						tone="highlight"
					>
						<p class="list-item-text">
							{runningEntry.description || 'No session notes yet.'}
						</p>
					</SectionCard>
				)}

				<div class="triptych-grid">
					<div class="metric-card metric-card-accent">
						<div class="metric-label">Total time</div>
						<div class="metric-value">{formatDuration(totalMs)}</div>
						<div class="metric-note">
							Includes {project.manualHours ? `${project.manualHours}h` : 'no'}{' '}
							manual carry-over.
						</div>
					</div>
					<div class="metric-card">
						<div class="metric-label">Total earned</div>
						<div class="metric-value">{formatCurrency(totalAmount)}</div>
						<div class="metric-note">Based on the current effective rate.</div>
					</div>
					<div class="metric-card">
						<div class="metric-label">Effective rate</div>
						<div class="metric-value">{formatCurrency(effectiveRate)}</div>
						<div class="metric-note">
							{project.rateOverride
								? 'Project rate override.'
								: 'Using client default rate.'}
						</div>
					</div>
				</div>

				<div class="detail-grid">
					<SectionCard
						title="Project details"
						subtitle="Current project settings."
					>
						<dl class="detail-list">
							<div>
								<dt>Client</dt>
								<dd>
									<AppLink
										href={routes.clients.show.href({ clientId: client.id })}
									>
										{client.name}
									</AppLink>
								</dd>
							</div>
							<div>
								<dt>Status</dt>
								<dd>
									<span class={`badge badge-${project.status}`}>
										{project.status}
									</span>
								</dd>
							</div>
							<div>
								<dt>Rate override</dt>
								<dd>
									{project.rateOverride
										? `${formatCurrency(project.rateOverride)}/hr`
										: 'Using client default'}
								</dd>
							</div>
							<div>
								<dt>Manual amount</dt>
								<dd>
									{project.manualAmount
										? formatCurrency(project.manualAmount)
										: 'Not set'}
								</dd>
							</div>
						</dl>
						<p class="list-item-text">
							{project.description || 'No description.'}
						</p>
					</SectionCard>

					<SectionCard
						title="Summary"
						subtitle="Time and amount totals."
						tone="tint"
					>
						<dl class="detail-list">
							<div>
								<dt>Tracked sessions</dt>
								<dd>{String(entries.length)}</dd>
							</div>
							<div>
								<dt>Finished sessions</dt>
								<dd>{String(finishedEntries.length)}</dd>
							</div>
							<div>
								<dt>Tracked amount</dt>
								<dd>{formatCurrency(trackedAmount)}</dd>
							</div>
							<div>
								<dt>Manual carry-over</dt>
								<dd>
									{project.manualHours ? `${project.manualHours}h` : 'None'}
								</dd>
							</div>
						</dl>
					</SectionCard>
				</div>

				<SectionCard
					title="Tasks"
					subtitle="Subtasks under this project."
					actions={
						<AppLink
							href={routes.projects.tasks.new.href({ projectId: project.id })}
							class="btn btn-primary btn-sm"
						>
							New task
						</AppLink>
					}
				>
					{tasks.length === 0 ? (
						<EmptyState
							title="No tasks yet"
							description="Add subtasks here instead of creating extra sibling projects."
						/>
					) : (
						<div class="list-stack">
							{tasks.map((task) => {
								const taskEntries = entries.filter(
									(entry) => entry.taskId === task.id,
								);
								const taskMs = taskEntries.reduce((sum, entry) => {
									if (entry.endedAt === null) return sum;
									return sum + (entry.endedAt - entry.startedAt);
								}, 0);

								return (
									<div class="list-item">
										<div class="list-item-primary">
											<p class="list-item-title">{task.title}</p>
											<p class="list-item-text">
												{task.description || 'No description.'}
											</p>
											<div class="meta-row">
												<span
													class={`badge badge-${taskStatusToBadge(task.status)}`}
												>
													{taskStatusLabel(task.status)}
												</span>
												<span class="meta-dot" />
												<span>{taskEntries.length} entries</span>
											</div>
										</div>
										<div class="list-item-side">
											<div class="value-block">
												<div class="value-label">Tracked</div>
												<div class="value-main">{formatDuration(taskMs)}</div>
											</div>
											<div class="inline-actions">
												<AppLink
													href={`${routes.time.new.href()}?projectId=${project.id}&taskId=${task.id}`}
													class="btn btn-secondary btn-sm"
												>
													Log time
												</AppLink>
												<AppLink
													href={routes.projects.tasks.edit.href({
														projectId: project.id,
														taskId: task.id,
													})}
													class="btn btn-secondary btn-sm"
												>
													Edit
												</AppLink>
												<RestfulForm
													method="DELETE"
													action={routes.projects.tasks.destroy.href({
														projectId: project.id,
														taskId: task.id,
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
								);
							})}
						</div>
					)}
				</SectionCard>

				<SectionCard
					title="Time entries"
					subtitle="Entries linked to this project."
					actions={
						<AppLink
							href={`${routes.time.new.href()}?projectId=${project.id}`}
							class="btn btn-primary btn-sm"
						>
							Log time
						</AppLink>
					}
				>
					{entries.length === 0 ? (
						<EmptyState
							title="No time logged yet"
							description="Add a time entry or start a timer for this project."
						/>
					) : (
						<div class="list-stack">
							{entries.map((entry) => {
								const ms =
									entry.endedAt !== null
										? entry.endedAt - entry.startedAt
										: null;
								const amount =
									ms !== null ? (ms / 3600000) * effectiveRate : null;

								return (
									<div class="list-item">
										<div class="list-item-primary">
											<p class="list-item-title">
												{entry.description || 'No description.'}
											</p>
											<div class="meta-row">
												{entry.taskId && taskMap.get(entry.taskId) && (
													<>
														<span>{taskMap.get(entry.taskId)?.title}</span>
														<span class="meta-dot" />
													</>
												)}
												<span>{formatDate(entry.startedAt)}</span>
												{entry.billable && (
													<span class="meta-chip meta-chip-success">
														Billable
													</span>
												)}
												{entry.invoiceId && (
													<span class="meta-chip meta-chip-accent">
														Invoiced
													</span>
												)}
											</div>
										</div>
										<div class="list-item-side">
											<div class="value-block">
												<div class="value-label">
													{ms === null ? 'Elapsed' : 'Duration'}
												</div>
												<div class="value-main">
													{ms !== null ? (
														formatDuration(ms)
													) : (
														<Timer
															setup={{
																entryId: entry.id,
																startedAt: entry.startedAt,
															}}
														/>
													)}
												</div>
												{amount !== null && (
													<div class="value-sub">{formatCurrency(amount)}</div>
												)}
											</div>
											<div class="inline-actions">
												<AppLink
													href={routes.time.edit.href({ entryId: entry.id })}
													class="btn btn-secondary btn-sm"
												>
													Edit
												</AppLink>
												<RestfulForm
													method="DELETE"
													action={routes.time.destroy.href({
														entryId: entry.id,
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
								);
							})}
						</div>
					)}
				</SectionCard>
			</Layout>
		);
	};
};

const taskStatusLabel = (status: string): string => {
	switch (status) {
		case 'in_progress':
			return 'In progress';
		case 'done':
			return 'Done';
		default:
			return 'Todo';
	}
};

const taskStatusToBadge = (status: string): string => {
	switch (status) {
		case 'in_progress':
			return 'active';
		case 'done':
			return 'done';
		default:
			return 'draft';
	}
};

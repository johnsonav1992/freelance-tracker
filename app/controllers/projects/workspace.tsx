import { Timer } from '../../assets/timer.tsx';
import type {
	Client,
	Project,
	ProjectTask,
	TimeEntry,
} from '../../data/schema.ts';
import { frames, routes } from '../../routes.ts';
import { AppLink } from '../../ui/AppLink.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import { EmptyState, SectionCard } from '../../ui/Screen.tsx';
import {
	formatCurrency,
	formatDate,
	formatDuration,
} from '../../utils/format.ts';

export type ProjectWorkspaceTab = 'overview' | 'tasks' | 'time';

export interface ProjectWorkspaceContentProps {
	project: Project;
	client: Client;
	entries: TimeEntry[];
	tasks: ProjectTask[];
	activeTab: ProjectWorkspaceTab;
}

export const ProjectWorkspaceContent = () => {
	return ({
		project,
		client,
		entries,
		tasks,
		activeTab,
	}: ProjectWorkspaceContentProps) => {
		const effectiveRate = project.rateOverride ?? client.hourlyRate;

		return (
			<section class="project-workspace">
				<nav class="workspace-tabs">
					<WorkspaceTab
						href={routes.projects.show.href({ projectId: project.id })}
						label="Overview"
						active={activeTab === 'overview'}
					/>
					<WorkspaceTab
						href={routes.projects.workspace.tasks.href({
							projectId: project.id,
						})}
						label={`Tasks (${tasks.length})`}
						active={activeTab === 'tasks'}
					/>
					<WorkspaceTab
						href={routes.projects.workspace.time.href({
							projectId: project.id,
						})}
						label={`Time (${entries.length})`}
						active={activeTab === 'time'}
					/>
				</nav>

				<div class="workspace-panel">
					{activeTab === 'overview' && (
						<>
							<TasksSection
								project={project}
								tasks={tasks}
								entries={entries}
							/>
							<TimeEntriesSection
								project={project}
								entries={entries}
								tasks={tasks}
								effectiveRate={effectiveRate}
							/>
						</>
					)}

					{activeTab === 'tasks' && (
						<TasksSection
							project={project}
							tasks={tasks}
							entries={entries}
						/>
					)}

					{activeTab === 'time' && (
						<TimeEntriesSection
							project={project}
							entries={entries}
							tasks={tasks}
							effectiveRate={effectiveRate}
						/>
					)}
				</div>
			</section>
		);
	};
};

interface WorkspaceTabProps {
	href: string;
	label: string;
	active: boolean;
}

const WorkspaceTab = () => {
	return ({ href, label, active }: WorkspaceTabProps) => {
		return (
			<AppLink
				href={href}
				target={frames.project}
				class={`workspace-tab${active ? ' workspace-tab-active' : ''}`}
				ariaCurrent={active ? 'page' : undefined}
			>
				{label}
			</AppLink>
		);
	};
};

interface TasksSectionProps {
	project: Project;
	tasks: ProjectTask[];
	entries: TimeEntry[];
}

const TasksSection = () => {
	return ({ project, tasks, entries }: TasksSectionProps) => {
		return (
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
		);
	};
};

interface TimeEntriesSectionProps {
	project: Project;
	entries: TimeEntry[];
	tasks: ProjectTask[];
	effectiveRate: number;
}

const TimeEntriesSection = () => {
	return ({
		project,
		entries,
		tasks,
		effectiveRate,
	}: TimeEntriesSectionProps) => {
		const taskMap = new Map(tasks.map((task) => [task.id, task]));

		return (
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
								entry.endedAt !== null ? entry.endedAt - entry.startedAt : null;
							const amount =
								ms !== null ? (ms / 3600000) * effectiveRate : null;

							return (
								<div class="list-item">
									<div class="list-item-primary">
										<div class="list-item-title">
											{entry.description || 'No description.'}
										</div>
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
												<span class="meta-chip meta-chip-accent">Invoiced</span>
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
												action={routes.time.destroy.href({ entryId: entry.id })}
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

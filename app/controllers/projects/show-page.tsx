import { Frame } from 'remix/component';

import { Timer } from '../../assets/timer.tsx';
import type {
	Client,
	Project,
	ProjectTask,
	TimeEntry,
} from '../../data/schema.ts';
import { frames, routes } from '../../routes.ts';
import { AppLink } from '../../ui/AppLink.tsx';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import { PageHeader, SectionCard } from '../../ui/Screen.tsx';
import { formatCurrency, formatDuration } from '../../utils/format.ts';
import {
	ProjectWorkspaceContent,
	type ProjectWorkspaceTab,
} from './workspace.tsx';

export const ProjectShowPage = () => {
	return ({
		project,
		client,
		entries,
		tasks,
		runningEntry,
		activeTab,
		frameOnly = false,
		workspaceSrc,
	}: {
		project: Project;
		client: Client;
		entries: TimeEntry[];
		tasks: ProjectTask[];
		runningEntry: TimeEntry | null;
		activeTab: ProjectWorkspaceTab;
		frameOnly?: boolean;
		workspaceSrc?: string;
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

		if (frameOnly) {
			return (
				<ProjectWorkspaceContent
					project={project}
					client={client}
					entries={entries}
					tasks={tasks}
					activeTab={activeTab}
				/>
			);
		}

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

				<Frame
					name={frames.project}
					src={
						workspaceSrc ?? routes.projects.show.href({ projectId: project.id })
					}
				/>
			</Layout>
		);
	};
};

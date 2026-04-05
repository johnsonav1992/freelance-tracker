import { Timer } from '../../assets/timer.tsx';
import type { Client, Project, TimeEntry } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
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
		runningEntry,
	}: {
		project: Project;
		client: Client;
		entries: TimeEntry[];
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

		return (
			<Layout
				title={project.name}
				activeNav="projects"
			>
				<a
					href={routes.projects.index.href()}
					class="breadcrumb"
				>
					← Back to projects
				</a>

				<PageHeader
					eyebrow="Project"
					title={project.name}
					subtitle={`For ${client.name}`}
					actions={
						<>
							{!runningEntry && (
								<form
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
								</form>
							)}
							<a
								href={routes.projects.edit.href({ projectId: project.id })}
								class="btn btn-secondary"
							>
								Edit project
							</a>
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
						subtitle="You can stop it here or jump into the time log later."
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
							Tracked time plus{' '}
							{project.manualHours ? `${project.manualHours}h` : 'no'} manual
							carry-over.
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
								? 'Using project-specific pricing.'
								: 'Using the client default rate.'}
						</div>
					</div>
				</div>

				<div class="detail-grid">
					<SectionCard
						title="Project details"
						subtitle="The settings that drive pricing and status."
					>
						<dl class="detail-list">
							<div>
								<dt>Client</dt>
								<dd>
									<a href={routes.clients.show.href({ clientId: client.id })}>
										{client.name}
									</a>
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
							{project.description || 'No project summary added.'}
						</p>
					</SectionCard>

					<SectionCard
						title="Time health"
						subtitle="Useful context before you invoice or pause the work."
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
					title="Time entries"
					subtitle="Everything logged against this project."
					actions={
						<a
							href={`${routes.time.new.href()}?projectId=${project.id}`}
							class="btn btn-primary btn-sm"
						>
							Log time
						</a>
					}
				>
					{entries.length === 0 ? (
						<EmptyState
							title="No time logged yet"
							description="Track a session or add a manual entry so this project starts building useful history."
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
												{entry.description || 'No work note added.'}
											</p>
											<div class="meta-row">
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
												<a
													href={routes.time.edit.href({ entryId: entry.id })}
													class="btn btn-secondary btn-sm"
												>
													Edit
												</a>
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

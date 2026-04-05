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

export const TimeIndexPage = () => {
	return ({
		entries,
		rateFor,
	}: {
		entries: (TimeEntry & { project: Project & { client: Client } })[];
		rateFor: (
			entry: TimeEntry & { project: Project & { client: Client } },
		) => number;
	}) => (
		<Layout
			title="Time"
			activeNav="time"
		>
			<PageHeader
				eyebrow="Time"
				title="See every work session clearly."
				subtitle="Track active timers, edit finished sessions, and keep billable work obvious."
				actions={
					<a
						href={routes.time.new.href()}
						class="btn btn-primary"
					>
						Log time
					</a>
				}
			/>

			{entries.length === 0 ? (
				<EmptyState
					title="No time entries yet"
					description="Start a timer from a project or log a completed session manually."
					action={
						<a
							href={routes.time.new.href()}
							class="btn btn-primary"
						>
							Add first entry
						</a>
					}
				/>
			) : (
				<SectionCard
					title={`${entries.length} time entr${entries.length === 1 ? 'y' : 'ies'}`}
					subtitle="Newest work appears here first."
				>
					<div class="list-stack">
						{entries.map((entry) => {
							const ms =
								entry.endedAt !== null ? entry.endedAt - entry.startedAt : null;
							const rate = rateFor(entry);
							const amount = ms !== null ? (ms / 3600000) * rate : null;

							return (
								<div class="list-item">
									<div class="list-item-primary">
										<p class="list-item-title">
											<a
												href={routes.projects.show.href({
													projectId: entry.project.id,
												})}
											>
												{entry.project.name}
											</a>
										</p>
										<p class="list-item-text">
											{entry.description || 'No work note added.'}
										</p>
										<div class="meta-row">
											<strong>{entry.project.client.name}</strong>
											<span class="meta-dot" />
											<span>{formatDate(entry.startedAt)}</span>
											{entry.billable && (
												<span class="meta-chip meta-chip-success">
													Billable
												</span>
											)}
											{entry.invoiceId && (
												<span class="meta-chip meta-chip-accent">Invoiced</span>
											)}
											{ms === null && (
												<span class="meta-chip meta-chip-warning">Running</span>
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
				</SectionCard>
			)}
		</Layout>
	);
};

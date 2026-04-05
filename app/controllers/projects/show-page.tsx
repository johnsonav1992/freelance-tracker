import { css } from 'remix/component';
import { Timer } from '../../assets/timer.tsx';
import type { Client, Project, TimeEntry } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import {
	formatCurrency,
	formatDate,
	formatDuration,
} from '../../utils/format.ts';

export const ProjectShowPage =
	() =>
	({
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
		const finishedEntries = entries.filter((e) => e.endedAt !== null);
		const totalMs = finishedEntries.reduce(
			(sum, e) => sum + ((e.endedAt ?? 0) - e.startedAt),
			0,
		);
		const totalAmount = finishedEntries.reduce((sum, e) => {
			const hours = ((e.endedAt ?? 0) - e.startedAt) / 3600000;
			return sum + hours * effectiveRate;
		}, 0);

		return (
			<Layout
				title={project.name}
				activeNav="projects"
			>
				<div
					mix={css({
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						marginBottom: '1.5rem',
					})}
				>
					<div>
						<a
							href={routes.projects.index.href()}
							mix={css({
								fontSize: '0.8rem',
								color: '#666',
								textDecoration: 'none',
								'&:hover': { color: '#818cf8' },
							})}
						>
							← Projects
						</a>
						<h1
							mix={css({
								margin: '0.25rem 0 0',
								fontSize: '1.5rem',
								fontWeight: 700,
							})}
						>
							{project.name}
						</h1>
						<div
							mix={css({
								fontSize: '0.875rem',
								color: '#888',
								marginTop: '0.25rem',
							})}
						>
							<a
								href={routes.clients.show.href({ clientId: client.id })}
								mix={css({
									color: '#888',
									textDecoration: 'none',
									'&:hover': { color: '#818cf8' },
								})}
							>
								{client.name}
							</a>
						</div>
					</div>

					<div mix={css({ display: 'flex', gap: '0.5rem' })}>
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
									▶ Start Timer
								</button>
							</form>
						)}
						<a
							href={routes.projects.edit.href({ projectId: project.id })}
							class="btn btn-secondary"
						>
							Edit
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
					</div>
				</div>

				{runningEntry && (
					<div
						mix={css({
							background: '#1a1a2e',
							border: '1px solid #818cf8',
							borderRadius: '8px',
							padding: '1rem 1.25rem',
							marginBottom: '1.5rem',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						})}
					>
						<div mix={css({ fontSize: '0.875rem', color: '#818cf8' })}>
							Timer running
						</div>
						<Timer
							setup={{
								entryId: runningEntry.id,
								startedAt: runningEntry.startedAt,
							}}
						/>
					</div>
				)}

				<div
					mix={css({
						display: 'grid',
						gridTemplateColumns: 'repeat(3, 1fr)',
						gap: '1rem',
						marginBottom: '2rem',
					})}
				>
					<StatCard
						label="Total Time"
						value={formatDuration(totalMs)}
					/>
					<StatCard
						label="Total Earned"
						value={formatCurrency(totalAmount)}
					/>
					<StatCard
						label="Rate"
						value={`${formatCurrency(effectiveRate)}/hr`}
					/>
				</div>

				<div>
					<div
						mix={css({
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '1rem',
						})}
					>
						<h2 mix={css({ margin: 0, fontSize: '1rem', fontWeight: 600 })}>
							Time Entries
						</h2>
						<a
							href={`${routes.time.new.href()}?projectId=${project.id}`}
							class="btn btn-secondary"
							mix={css({ fontSize: '0.8rem' })}
						>
							+ Log Time
						</a>
					</div>

					{entries.length === 0 ? (
						<p mix={css({ color: '#555', fontSize: '0.875rem' })}>
							No time logged yet.
						</p>
					) : (
						<div
							mix={css({
								background: '#1a1a1a',
								borderRadius: '8px',
								border: '1px solid #2a2a2a',
								overflow: 'hidden',
							})}
						>
							{entries.map((entry) => {
								const ms =
									entry.endedAt !== null
										? entry.endedAt - entry.startedAt
										: null;
								const hours = ms !== null ? ms / 3600000 : null;
								const amount = hours !== null ? hours * effectiveRate : null;

								return (
									<div
										mix={css({
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											padding: '0.75rem 1rem',
											borderBottom: '1px solid #1e1e1e',
											'&:last-child': { borderBottom: 'none' },
										})}
									>
										<div>
											<div mix={css({ fontSize: '0.875rem' })}>
												{entry.description ?? (
													<span mix={css({ color: '#555' })}>
														No description
													</span>
												)}
											</div>
											<div
												mix={css({
													fontSize: '0.75rem',
													color: '#555',
													marginTop: '0.2rem',
												})}
											>
												{formatDate(entry.startedAt)}
											</div>
										</div>
										<div
											mix={css({
												display: 'flex',
												alignItems: 'center',
												gap: '1rem',
												textAlign: 'right',
											})}
										>
											<div>
												{ms !== null ? (
													<div mix={css({ fontSize: '0.875rem' })}>
														{formatDuration(ms)}
													</div>
												) : (
													<Timer
														setup={{
															entryId: entry.id,
															startedAt: entry.startedAt,
														}}
													/>
												)}
												{amount !== null && (
													<div
														mix={css({ fontSize: '0.75rem', color: '#888' })}
													>
														{formatCurrency(amount)}
													</div>
												)}
											</div>
											<div mix={css({ display: 'flex', gap: '0.4rem' })}>
												<a
													href={routes.time.edit.href({ entryId: entry.id })}
													class="btn btn-secondary"
													mix={css({
														fontSize: '0.75rem',
														padding: '0.2rem 0.5rem',
													})}
												>
													Edit
												</a>
												<RestfulForm
													method="DELETE"
													action={routes.time.destroy.href({
														entryId: entry.id,
													})}
													mix={css({ display: 'inline' })}
												>
													<button
														type="submit"
														class="btn btn-danger"
														mix={css({
															fontSize: '0.75rem',
															padding: '0.2rem 0.5rem',
														})}
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
				</div>
			</Layout>
		);
	};

const StatCard =
	() =>
	({ label, value }: { label: string; value: string }) => (
		<div
			mix={css({
				background: '#1a1a1a',
				borderRadius: '8px',
				padding: '1.25rem',
				border: '1px solid #2a2a2a',
			})}
		>
			<div
				mix={css({
					fontSize: '0.75rem',
					color: '#666',
					marginBottom: '0.5rem',
					textTransform: 'uppercase',
					letterSpacing: '0.05em',
				})}
			>
				{label}
			</div>
			<div mix={css({ fontSize: '1.5rem', fontWeight: 700 })}>{value}</div>
		</div>
	);

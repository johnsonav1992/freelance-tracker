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

export const TimeIndexPage =
	() =>
	({
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
			<div
				mix={css({
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '1.5rem',
				})}
			>
				<h1 mix={css({ margin: 0, fontSize: '1.5rem', fontWeight: 700 })}>
					Time
				</h1>
				<a
					href={routes.time.new.href()}
					class="btn btn-primary"
				>
					+ Log Time
				</a>
			</div>

			{entries.length === 0 ? (
				<div
					mix={css({
						background: '#1a1a1a',
						borderRadius: '8px',
						padding: '3rem',
						textAlign: 'center',
						color: '#555',
						border: '1px solid #2a2a2a',
					})}
				>
					<p mix={css({ margin: 0 })}>No time entries yet.</p>
				</div>
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
							entry.endedAt !== null ? entry.endedAt - entry.startedAt : null;
						const rate = rateFor(entry);
						const amount = ms !== null ? (ms / 3600000) * rate : null;

						return (
							<div
								mix={css({
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									padding: '0.875rem 1rem',
									borderBottom: '1px solid #1e1e1e',
									'&:last-child': { borderBottom: 'none' },
								})}
							>
								<div mix={css({ flex: 1 })}>
									<div
										mix={css({
											display: 'flex',
											alignItems: 'center',
											gap: '0.5rem',
										})}
									>
										<a
											href={routes.projects.show.href({
												projectId: entry.project.id,
											})}
											mix={css({
												fontSize: '0.875rem',
												fontWeight: 500,
												color: '#e8e8e8',
												textDecoration: 'none',
												'&:hover': { color: '#818cf8' },
											})}
										>
											{entry.project.name}
										</a>
										<span mix={css({ fontSize: '0.75rem', color: '#555' })}>
											·
										</span>
										<span mix={css({ fontSize: '0.75rem', color: '#666' })}>
											{entry.project.client.name}
										</span>
										{entry.billable && (
											<span
												mix={css({
													fontSize: '0.65rem',
													padding: '0.1rem 0.4rem',
													background: '#1a2e1a',
													color: '#4ade80',
													borderRadius: '4px',
													border: '1px solid #2a4a2a',
												})}
											>
												billable
											</span>
										)}
										{entry.invoiceId && (
											<span
												mix={css({
													fontSize: '0.65rem',
													padding: '0.1rem 0.4rem',
													background: '#1e1e2e',
													color: '#818cf8',
													borderRadius: '4px',
													border: '1px solid #2a2a4a',
												})}
											>
												invoiced
											</span>
										)}
									</div>
									{entry.description && (
										<div
											mix={css({
												fontSize: '0.8rem',
												color: '#666',
												marginTop: '0.2rem',
											})}
										>
											{entry.description}
										</div>
									)}
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
									})}
								>
									<div mix={css({ textAlign: 'right' })}>
										{ms !== null ? (
											<div mix={css({ fontSize: '0.875rem', fontWeight: 500 })}>
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
											<div mix={css({ fontSize: '0.75rem', color: '#888' })}>
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
											action={routes.time.destroy.href({ entryId: entry.id })}
											class="form-contents"
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
		</Layout>
	);

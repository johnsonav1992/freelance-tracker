import { css } from 'remix/component';

import type { Client, Project } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import { formatCurrency } from '../../utils/format.ts';

export const ProjectsIndexPage =
	() =>
	({ projects }: { projects: (Project & { client: Client })[] }) => (
		<Layout
			title="Projects"
			activeNav="projects"
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
					Projects
				</h1>
				<a
					href={routes.projects.new.href()}
					class="btn btn-primary"
				>
					+ New Project
				</a>
			</div>

			{projects.length === 0 ? (
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
					<p mix={css({ margin: 0 })}>
						No projects yet. Create a client first, then add a project.
					</p>
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
					<table mix={css({ width: '100%', borderCollapse: 'collapse' })}>
						<thead>
							<tr mix={css({ borderBottom: '1px solid #2a2a2a' })}>
								<th
									mix={css({
										padding: '0.75rem 1rem',
										textAlign: 'left',
										fontSize: '0.75rem',
										color: '#666',
										textTransform: 'uppercase',
										letterSpacing: '0.05em',
									})}
								>
									Project
								</th>
								<th
									mix={css({
										padding: '0.75rem 1rem',
										textAlign: 'left',
										fontSize: '0.75rem',
										color: '#666',
										textTransform: 'uppercase',
										letterSpacing: '0.05em',
									})}
								>
									Client
								</th>
								<th
									mix={css({
										padding: '0.75rem 1rem',
										textAlign: 'left',
										fontSize: '0.75rem',
										color: '#666',
										textTransform: 'uppercase',
										letterSpacing: '0.05em',
									})}
								>
									Status
								</th>
								<th
									mix={css({
										padding: '0.75rem 1rem',
										textAlign: 'right',
										fontSize: '0.75rem',
										color: '#666',
										textTransform: 'uppercase',
										letterSpacing: '0.05em',
									})}
								>
									Rate
								</th>
								<th
									mix={css({
										padding: '0.75rem 1rem',
										textAlign: 'right',
										fontSize: '0.75rem',
										color: '#666',
										textTransform: 'uppercase',
										letterSpacing: '0.05em',
									})}
								>
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{projects.map((project) => (
								<tr
									mix={css({
										borderBottom: '1px solid #1e1e1e',
										'&:last-child': { borderBottom: 'none' },
										'&:hover': { background: '#1f1f1f' },
									})}
								>
									<td mix={css({ padding: '0.75rem 1rem' })}>
										<a
											href={routes.projects.show.href({
												projectId: project.id,
											})}
											mix={css({
												color: '#e8e8e8',
												textDecoration: 'none',
												fontWeight: 500,
												'&:hover': { color: '#818cf8' },
											})}
										>
											{project.name}
										</a>
										{project.description && (
											<div
												mix={css({
													fontSize: '0.75rem',
													color: '#555',
													marginTop: '0.2rem',
												})}
											>
												{project.description}
											</div>
										)}
									</td>
									<td
										mix={css({
											padding: '0.75rem 1rem',
											color: '#888',
											fontSize: '0.875rem',
										})}
									>
										<a
											href={routes.clients.show.href({
												clientId: project.client.id,
											})}
											mix={css({
												color: '#888',
												textDecoration: 'none',
												'&:hover': { color: '#818cf8' },
											})}
										>
											{project.client.name}
										</a>
									</td>
									<td mix={css({ padding: '0.75rem 1rem' })}>
										<span class={`badge badge-${project.status}`}>
											{project.status}
										</span>
									</td>
									<td
										mix={css({
											padding: '0.75rem 1rem',
											textAlign: 'right',
											fontSize: '0.875rem',
										})}
									>
										{project.rateOverride
											? `${formatCurrency(project.rateOverride)}/hr`
											: `${formatCurrency(project.client.hourlyRate)}/hr`}
									</td>
									<td
										mix={css({ padding: '0.75rem 1rem', textAlign: 'right' })}
									>
										<div
											mix={css({
												display: 'flex',
												gap: '0.5rem',
												justifyContent: 'flex-end',
											})}
										>
											<a
												href={routes.projects.edit.href({
													projectId: project.id,
												})}
												class="btn btn-secondary"
												mix={css({
													fontSize: '0.8rem',
													padding: '0.25rem 0.625rem',
												})}
											>
												Edit
											</a>
											<RestfulForm
												method="DELETE"
												action={routes.projects.destroy.href({
													projectId: project.id,
												})}
												class="form-contents"
											>
												<button
													type="submit"
													class="btn btn-danger"
													mix={css({
														fontSize: '0.8rem',
														padding: '0.25rem 0.625rem',
													})}
												>
													Delete
												</button>
											</RestfulForm>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</Layout>
	);

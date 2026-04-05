import { css } from 'remix/component';

import type { Client, Project } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { Layout } from '../../ui/layout.tsx';
import { RestfulForm } from '../../ui/restful-form.tsx';
import { formatCurrency, formatDate } from '../../utils/format.ts';

export const ClientShowPage =
	() =>
	({ client, projects }: { client: Client; projects: Project[] }) => (
		<Layout
			title={client.name}
			activeNav="clients"
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
						href={routes.clients.index.href()}
						mix={css({
							fontSize: '0.8rem',
							color: '#666',
							textDecoration: 'none',
							'&:hover': { color: '#818cf8' },
						})}
					>
						← Clients
					</a>
					<h1
						mix={css({
							margin: '0.25rem 0 0',
							fontSize: '1.5rem',
							fontWeight: 700,
						})}
					>
						{client.name}
					</h1>
					{client.company && (
						<div
							mix={css({
								fontSize: '0.875rem',
								color: '#888',
								marginTop: '0.25rem',
							})}
						>
							{client.company}
						</div>
					)}
				</div>

				<div mix={css({ display: 'flex', gap: '0.5rem' })}>
					<a
						href={routes.clients.edit.href({ clientId: client.id })}
						class="btn btn-secondary"
					>
						Edit
					</a>
					<RestfulForm
						method="DELETE"
						action={routes.clients.destroy.href({ clientId: client.id })}
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

			<div
				mix={css({
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: '1.5rem',
					marginBottom: '2rem',
				})}
			>
				<div
					mix={css({
						background: '#1a1a1a',
						borderRadius: '8px',
						padding: '1.25rem',
						border: '1px solid #2a2a2a',
					})}
				>
					<h2
						mix={css({
							margin: '0 0 1rem',
							fontSize: '0.875rem',
							color: '#666',
							textTransform: 'uppercase',
							letterSpacing: '0.05em',
						})}
					>
						Contact
					</h2>
					<dl
						mix={css({
							display: 'flex',
							flexDirection: 'column',
							gap: '0.75rem',
							margin: 0,
						})}
					>
						<div>
							<dt
								mix={css({
									fontSize: '0.75rem',
									color: '#555',
									marginBottom: '0.2rem',
								})}
							>
								Email
							</dt>
							<dd mix={css({ margin: 0, fontSize: '0.875rem' })}>
								<a
									href={`mailto:${client.email}`}
									mix={css({ color: '#818cf8', textDecoration: 'none' })}
								>
									{client.email}
								</a>
							</dd>
						</div>
						<div>
							<dt
								mix={css({
									fontSize: '0.75rem',
									color: '#555',
									marginBottom: '0.2rem',
								})}
							>
								Hourly Rate
							</dt>
							<dd
								mix={css({ margin: 0, fontSize: '0.875rem', fontWeight: 600 })}
							>
								{formatCurrency(client.hourlyRate)}/hr
							</dd>
						</div>
						<div>
							<dt
								mix={css({
									fontSize: '0.75rem',
									color: '#555',
									marginBottom: '0.2rem',
								})}
							>
								Client Since
							</dt>
							<dd mix={css({ margin: 0, fontSize: '0.875rem' })}>
								{formatDate(client.createdAt)}
							</dd>
						</div>
					</dl>
				</div>

				<div
					mix={css({
						background: '#1a1a1a',
						borderRadius: '8px',
						padding: '1.25rem',
						border: '1px solid #2a2a2a',
					})}
				>
					<h2
						mix={css({
							margin: '0 0 1rem',
							fontSize: '0.875rem',
							color: '#666',
							textTransform: 'uppercase',
							letterSpacing: '0.05em',
						})}
					>
						Stats
					</h2>
					<dl
						mix={css({
							display: 'flex',
							flexDirection: 'column',
							gap: '0.75rem',
							margin: 0,
						})}
					>
						<div>
							<dt
								mix={css({
									fontSize: '0.75rem',
									color: '#555',
									marginBottom: '0.2rem',
								})}
							>
								Projects
							</dt>
							<dd
								mix={css({ margin: 0, fontSize: '1.25rem', fontWeight: 700 })}
							>
								{projects.length}
							</dd>
						</div>
						<div>
							<dt
								mix={css({
									fontSize: '0.75rem',
									color: '#555',
									marginBottom: '0.2rem',
								})}
							>
								Active Projects
							</dt>
							<dd
								mix={css({ margin: 0, fontSize: '1.25rem', fontWeight: 700 })}
							>
								{projects.filter((p) => p.status === 'active').length}
							</dd>
						</div>
					</dl>
				</div>
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
						Projects
					</h2>
					<a
						href={`${routes.projects.new.href()}?clientId=${client.id}`}
						class="btn btn-secondary"
						mix={css({ fontSize: '0.8rem' })}
					>
						+ New Project
					</a>
				</div>

				{projects.length === 0 ? (
					<p mix={css({ color: '#555', fontSize: '0.875rem' })}>
						No projects yet.
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
						{projects.map((project) => (
							<a
								href={routes.projects.show.href({ projectId: project.id })}
								mix={css({
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									padding: '0.875rem 1rem',
									textDecoration: 'none',
									color: '#e8e8e8',
									borderBottom: '1px solid #1e1e1e',
									'&:last-child': { borderBottom: 'none' },
									'&:hover': { background: '#1f1f1f' },
								})}
							>
								<div>
									<div mix={css({ fontSize: '0.875rem', fontWeight: 500 })}>
										{project.name}
									</div>
									{project.description && (
										<div
											mix={css({
												fontSize: '0.75rem',
												color: '#666',
												marginTop: '0.2rem',
											})}
										>
											{project.description}
										</div>
									)}
								</div>
								<div
									mix={css({
										display: 'flex',
										alignItems: 'center',
										gap: '0.75rem',
									})}
								>
									{project.rateOverride && (
										<span mix={css({ fontSize: '0.75rem', color: '#888' })}>
											{formatCurrency(project.rateOverride)}/hr
										</span>
									)}
									<span class={`badge badge-${project.status}`}>
										{project.status}
									</span>
								</div>
							</a>
						))}
					</div>
				)}
			</div>
		</Layout>
	);

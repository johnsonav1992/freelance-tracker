import * as s from 'remix/data-schema';
import * as f from 'remix/data-schema/form-data';
import { Database } from 'remix/data-table';
import type { Controller } from 'remix/fetch-router';
import { redirect } from 'remix/response/redirect';

import {
	clients,
	projectClient,
	projects,
	projectTasks,
	timeEntries,
} from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { parseId } from '../../utils/ids.ts';
import { render } from '../../utils/render.tsx';
import { ProjectFormPage } from './form.tsx';
import { ProjectsIndexPage } from './index-page.tsx';
import { ProjectShowPage } from './show-page.tsx';
import { ProjectTaskFormPage } from './task-form.tsx';

const projectSchema = f.object({
	clientId: f.field(s.defaulted(s.string(), '')),
	name: f.field(s.defaulted(s.string(), '')),
	description: f.field(s.optional(s.string())),
	status: f.field(s.defaulted(s.string(), 'active')),
	rateOverride: f.field(s.optional(s.string())),
	manualHours: f.field(s.optional(s.string())),
	manualAmount: f.field(s.optional(s.string())),
});

const taskSchema = f.object({
	title: f.field(s.defaulted(s.string(), '')),
	description: f.field(s.optional(s.string())),
	status: f.field(s.defaulted(s.string(), 'todo')),
});

export default {
	actions: {
		async index({ get }) {
			const db = get(Database);
			const allProjects = await db.findMany(projects, {
				orderBy: ['name', 'asc'],
				with: { client: projectClient },
			});

			const typed = allProjects.filter(
				(
					p,
				): p is typeof p & {
					client: Awaited<ReturnType<typeof db.findMany<typeof clients>>>[0];
				} => 'client' in p && p.client !== null,
			);

			return render(<ProjectsIndexPage projects={typed} />);
		},

		async new({ get, request }) {
			const db = get(Database);
			const url = new URL(request.url);
			const defaultClientId = parseId(url.searchParams.get('clientId'));
			const allClients = await db.findMany(clients, {
				orderBy: ['name', 'asc'],
			});

			return render(
				<ProjectFormPage
					action={routes.projects.create.href()}
					clients={allClients}
					defaultClientId={defaultClientId}
				/>,
			);
		},

		async create({ get }) {
			const db = get(Database);
			const formData = get(FormData);
			const {
				clientId,
				name,
				description,
				status,
				rateOverride,
				manualHours,
				manualAmount,
			} = s.parse(projectSchema, formData);
			const now = Date.now();

			await db.create(projects, {
				clientId: parseInt(clientId, 10),
				name,
				description: description || null,
				status,
				rateOverride: rateOverride ? parseFloat(rateOverride) : null,
				manualHours: manualHours ? parseFloat(manualHours) : null,
				manualAmount: manualAmount ? parseFloat(manualAmount) : null,
				createdAt: now,
				updatedAt: now,
			});

			return redirect(routes.projects.index.href());
		},

		async show({ get, params }) {
			const db = get(Database);
			const projectId = parseId(params.projectId);
			const project =
				projectId === undefined
					? undefined
					: await db.find(projects, projectId);

			if (!project) {
				return new Response('Project not found', { status: 404 });
			}

			const [client, entries, tasks] = await Promise.all([
				db.find(clients, project.clientId),
				db.findMany(timeEntries, {
					where: { projectId: project.id },
					orderBy: ['startedAt', 'desc'],
				}),
				db.findMany(projectTasks, {
					where: { projectId: project.id },
					orderBy: ['sortOrder', 'asc'],
				}),
			]);

			if (!client) {
				return new Response('Client not found', { status: 404 });
			}

			const runningEntry = entries.find((e) => e.endedAt === null) ?? null;

			return render(
				<ProjectShowPage
					project={project}
					client={client}
					entries={entries}
					tasks={tasks}
					runningEntry={runningEntry}
				/>,
			);
		},

		async edit({ get, params }) {
			const db = get(Database);
			const projectId = parseId(params.projectId);
			const project =
				projectId === undefined
					? undefined
					: await db.find(projects, projectId);

			if (!project) {
				return new Response('Project not found', { status: 404 });
			}

			const allClients = await db.findMany(clients, {
				orderBy: ['name', 'asc'],
			});

			return render(
				<ProjectFormPage
					action={routes.projects.update.href({ projectId: project.id })}
					method="PUT"
					project={project}
					clients={allClients}
				/>,
			);
		},

		async update({ get, params }) {
			const db = get(Database);
			const formData = get(FormData);
			const projectId = parseId(params.projectId);
			const project =
				projectId === undefined
					? undefined
					: await db.find(projects, projectId);

			if (!project) {
				return new Response('Project not found', { status: 404 });
			}

			const {
				clientId,
				name,
				description,
				status,
				rateOverride,
				manualHours,
				manualAmount,
			} = s.parse(projectSchema, formData);

			await db.update(projects, project.id, {
				clientId: parseInt(clientId, 10),
				name,
				description: description || null,
				status,
				rateOverride: rateOverride ? parseFloat(rateOverride) : null,
				manualHours: manualHours ? parseFloat(manualHours) : null,
				manualAmount: manualAmount ? parseFloat(manualAmount) : null,
				updatedAt: Date.now(),
			});

			return redirect(routes.projects.show.href({ projectId: project.id }));
		},

		async destroy({ get, params }) {
			const db = get(Database);
			const projectId = parseId(params.projectId);
			const project =
				projectId === undefined
					? undefined
					: await db.find(projects, projectId);

			if (project) {
				await db.delete(projects, project.id);
			}

			return redirect(routes.projects.index.href());
		},

		tasks: {
			actions: {
				async new({ get, params }) {
					const db = get(Database);
					const projectId = parseId(params.projectId);
					const project =
						projectId === undefined
							? undefined
							: await db.find(projects, projectId);

					if (!project) {
						return new Response('Project not found', { status: 404 });
					}

					return render(
						<ProjectTaskFormPage
							action={routes.projects.tasks.create.href({
								projectId: project.id,
							})}
							project={project}
						/>,
					);
				},

				async create({ get, params }) {
					const db = get(Database);
					const formData = get(FormData);
					const projectId = parseId(params.projectId);
					const project =
						projectId === undefined
							? undefined
							: await db.find(projects, projectId);

					if (!project) {
						return new Response('Project not found', { status: 404 });
					}

					const { title, description, status } = s.parse(taskSchema, formData);
					const now = Date.now();
					const lastTask = await db.findMany(projectTasks, {
						where: { projectId: project.id },
						orderBy: ['sortOrder', 'desc'],
						limit: 1,
					});

					await db.create(projectTasks, {
						projectId: project.id,
						title,
						description: description || null,
						status,
						sortOrder: (lastTask[0]?.sortOrder ?? -1) + 1,
						createdAt: now,
						updatedAt: now,
					});

					return redirect(routes.projects.show.href({ projectId: project.id }));
				},

				async edit({ get, params }) {
					const db = get(Database);
					const projectId = parseId(params.projectId);
					const taskId = parseId(params.taskId);
					const [project, task] = await Promise.all([
						projectId === undefined ? undefined : db.find(projects, projectId),
						taskId === undefined ? undefined : db.find(projectTasks, taskId),
					]);

					if (!project || !task || task.projectId !== project.id) {
						return new Response('Task not found', { status: 404 });
					}

					return render(
						<ProjectTaskFormPage
							action={routes.projects.tasks.update.href({
								projectId: project.id,
								taskId: task.id,
							})}
							method="PUT"
							project={project}
							task={task}
						/>,
					);
				},

				async update({ get, params }) {
					const db = get(Database);
					const formData = get(FormData);
					const projectId = parseId(params.projectId);
					const taskId = parseId(params.taskId);
					const [project, task] = await Promise.all([
						projectId === undefined ? undefined : db.find(projects, projectId),
						taskId === undefined ? undefined : db.find(projectTasks, taskId),
					]);

					if (!project || !task || task.projectId !== project.id) {
						return new Response('Task not found', { status: 404 });
					}

					const { title, description, status } = s.parse(taskSchema, formData);

					await db.update(projectTasks, task.id, {
						title,
						description: description || null,
						status,
						updatedAt: Date.now(),
					});

					return redirect(routes.projects.show.href({ projectId: project.id }));
				},

				async destroy({ get, params }) {
					const db = get(Database);
					const projectId = parseId(params.projectId);
					const taskId = parseId(params.taskId);
					const [project, task] = await Promise.all([
						projectId === undefined ? undefined : db.find(projects, projectId),
						taskId === undefined ? undefined : db.find(projectTasks, taskId),
					]);

					if (!project || !task || task.projectId !== project.id) {
						return new Response('Task not found', { status: 404 });
					}

					await db.delete(projectTasks, task.id);

					return redirect(routes.projects.show.href({ projectId: project.id }));
				},
			},
		},
	},
} satisfies Controller<typeof routes.projects>;

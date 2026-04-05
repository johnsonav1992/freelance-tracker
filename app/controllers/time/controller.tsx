import * as s from 'remix/data-schema';
import * as f from 'remix/data-schema/form-data';
import { Database } from 'remix/data-table';
import type { Controller } from 'remix/fetch-router';
import { redirect } from 'remix/response/redirect';

import {
	clients,
	entryProject,
	projectClient,
	projects,
	projectTasks,
	timeEntries,
} from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { parseId } from '../../utils/ids.ts';
import { render } from '../../utils/render.tsx';
import { TimeEntryFormPage } from './form.tsx';
import { TimeIndexPage } from './index-page.tsx';

const entrySchema = f.object({
	projectId: f.field(s.defaulted(s.string(), '')),
	taskId: f.field(s.optional(s.string())),
	description: f.field(s.optional(s.string())),
	startedAt: f.field(s.defaulted(s.string(), '')),
	endedAt: f.field(s.optional(s.string())),
	billable: f.field(s.optional(s.string())),
});

const parseLocalDatetime = (value: string): number => new Date(value).getTime();

export default {
	actions: {
		async index({ get }) {
			const db = get(Database);

			const allEntries = await db.findMany(timeEntries, {
				orderBy: ['startedAt', 'desc'],
				with: { project: entryProject },
			});

			const projectRows = await db.findMany(projects, {
				with: { client: projectClient },
			});
			const allTasks = await db.findMany(projectTasks, {
				orderBy: ['sortOrder', 'asc'],
			});
			const allProjects = projectRows.filter(
				(
					p,
				): p is typeof p & {
					client: Awaited<ReturnType<typeof db.findMany<typeof clients>>>[0];
				} => 'client' in p && p.client !== null,
			);

			const clientRateMap = new Map(
				(await db.findMany(clients)).map((c) => [c.id, c.hourlyRate]),
			);
			const projectMap = new Map(allProjects.map((p) => [p.id, p]));
			const taskMap = new Map(allTasks.map((task) => [task.id, task]));

			const typed = allEntries.flatMap((entry) => {
				const project = projectMap.get(entry.projectId);
				if (!project) return [];

				return [
					{ ...entry, project, task: taskMap.get(entry.taskId ?? 0) ?? null },
				];
			});

			const rateFor = (entry: (typeof typed)[0]) => {
				const project = projectMap.get(entry.projectId);
				return (
					project?.rateOverride ??
					clientRateMap.get(project?.clientId ?? 0) ??
					0
				);
			};

			return render(
				<TimeIndexPage
					entries={typed}
					rateFor={rateFor}
				/>,
			);
		},

		async new({ get, request }) {
			const db = get(Database);
			const url = new URL(request.url);
			const requestedProjectId = parseId(url.searchParams.get('projectId'));
			const defaultTaskId = parseId(url.searchParams.get('taskId'));

			const allProjects = await db.findMany(projects, {
				where: { status: 'active' },
				orderBy: ['name', 'asc'],
				with: { client: projectClient },
			});
			const allTasks = await db.findMany(projectTasks, {
				orderBy: ['sortOrder', 'asc'],
			});

			const typed = allProjects.filter(
				(
					p,
				): p is typeof p & {
					client: Awaited<ReturnType<typeof db.findMany<typeof clients>>>[0];
				} => 'client' in p && p.client !== null,
			);

			const typedTasks = allTasks.flatMap((task) => {
				const project = typed.find((item) => item.id === task.projectId);
				if (!project) return [];
				return [{ ...task, project }];
			});
			const defaultProjectId =
				requestedProjectId ??
				typedTasks.find((task) => task.id === defaultTaskId)?.projectId;

			return render(
				<TimeEntryFormPage
					action={routes.time.create.href()}
					projects={typed}
					defaultProjectId={defaultProjectId}
					tasks={typedTasks}
					defaultTaskId={defaultTaskId}
				/>,
			);
		},

		async create({ get }) {
			const db = get(Database);
			const formData = get(FormData);
			const { projectId, taskId, description, startedAt, endedAt, billable } =
				s.parse(entrySchema, formData);
			const now = Date.now();
			const parsedProjectId = parseInt(projectId, 10);
			const parsedTaskId = parseId(taskId);
			const task =
				parsedTaskId === undefined
					? null
					: await db.find(projectTasks, parsedTaskId);

			await db.create(timeEntries, {
				projectId: parsedProjectId,
				taskId: task && task.projectId === parsedProjectId ? task.id : null,
				description: description || null,
				startedAt: startedAt ? parseLocalDatetime(startedAt) : now,
				endedAt: endedAt ? parseLocalDatetime(endedAt) : null,
				billable: billable === 'true',
				invoiceId: null,
				createdAt: now,
				updatedAt: now,
			});

			return redirect(routes.time.index.href());
		},

		async show({ params }) {
			const entryId = parseId(params.entryId);

			if (entryId === undefined) {
				return new Response('Time entry not found', { status: 404 });
			}

			return redirect(routes.time.edit.href({ entryId }));
		},

		async edit({ get, params }) {
			const db = get(Database);
			const entryId = parseId(params.entryId);
			const entry =
				entryId === undefined ? undefined : await db.find(timeEntries, entryId);

			if (!entry) {
				return new Response('Time entry not found', { status: 404 });
			}

			const allProjects = await db.findMany(projects, {
				orderBy: ['name', 'asc'],
				with: { client: projectClient },
			});
			const allTasks = await db.findMany(projectTasks, {
				orderBy: ['sortOrder', 'asc'],
			});

			const typed = allProjects.filter(
				(
					p,
				): p is typeof p & {
					client: Awaited<ReturnType<typeof db.findMany<typeof clients>>>[0];
				} => 'client' in p && p.client !== null,
			);

			const typedTasks = allTasks.flatMap((task) => {
				const project = typed.find((item) => item.id === task.projectId);
				if (!project) return [];
				return [{ ...task, project }];
			});

			return render(
				<TimeEntryFormPage
					action={routes.time.update.href({ entryId: entry.id })}
					method="PUT"
					entry={entry}
					projects={typed}
					tasks={typedTasks}
					defaultTaskId={entry.taskId ?? undefined}
				/>,
			);
		},

		async update({ get, params }) {
			const db = get(Database);
			const formData = get(FormData);
			const entryId = parseId(params.entryId);
			const entry =
				entryId === undefined ? undefined : await db.find(timeEntries, entryId);

			if (!entry) {
				return new Response('Time entry not found', { status: 404 });
			}

			const { projectId, taskId, description, startedAt, endedAt, billable } =
				s.parse(entrySchema, formData);
			const parsedProjectId = parseInt(projectId, 10);
			const parsedTaskId = parseId(taskId);
			const task =
				parsedTaskId === undefined
					? null
					: await db.find(projectTasks, parsedTaskId);

			await db.update(timeEntries, entry.id, {
				projectId: parsedProjectId,
				taskId: task && task.projectId === parsedProjectId ? task.id : null,
				description: description || null,
				startedAt: startedAt ? parseLocalDatetime(startedAt) : entry.startedAt,
				endedAt: endedAt ? parseLocalDatetime(endedAt) : null,
				billable: billable === 'true',
				updatedAt: Date.now(),
			});

			return redirect(routes.time.index.href());
		},

		async destroy({ get, params }) {
			const db = get(Database);
			const entryId = parseId(params.entryId);
			const entry =
				entryId === undefined ? undefined : await db.find(timeEntries, entryId);

			if (entry) {
				await db.delete(timeEntries, entry.id);
			}

			return redirect(routes.time.index.href());
		},

		async stop({ get, params }) {
			const db = get(Database);
			const entryId = parseId(params.entryId);
			const entry =
				entryId === undefined ? undefined : await db.find(timeEntries, entryId);

			if (entry && entry.endedAt === null) {
				await db.update(timeEntries, entry.id, {
					endedAt: Date.now(),
					updatedAt: Date.now(),
				});
			}

			return redirect(routes.time.index.href());
		},
	},
} satisfies Controller<typeof routes.time>;

import * as s from 'remix/data-schema';
import * as f from 'remix/data-schema/form-data';
import { Database } from 'remix/data-table';
import type { Controller } from 'remix/fetch-router';
import { redirect } from 'remix/response/redirect';

import {
	clients,
	entryProject,
	invoiceClient,
	invoices,
	projects,
	timeEntries,
} from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { generateInvoiceNumber } from '../../utils/format.ts';
import { parseId } from '../../utils/ids.ts';
import { render } from '../../utils/render.tsx';
import { InvoiceFormPage } from './form.tsx';
import { InvoicesIndexPage } from './index-page.tsx';
import { InvoiceShowPage } from './show-page.tsx';

const updateSchema = f.object({
	status: f.field(s.defaulted(s.string(), 'draft')),
});

export default {
	actions: {
		async index({ get }) {
			const db = get(Database);

			const allInvoices = await db.findMany(invoices, {
				orderBy: ['createdAt', 'desc'],
				with: { client: invoiceClient },
			});

			const allEntries = await db.findMany(timeEntries);
			const allProjects = await db.findMany(projects);
			const allClients = await db.findMany(clients);

			const clientRateMap = new Map(
				allClients.map((c) => [c.id, c.hourlyRate]),
			);
			const projectMap = new Map(allProjects.map((p) => [p.id, p]));

			const totalFor = (invoiceId: number) => {
				const invoiceEntryList = allEntries.filter(
					(e) => e.invoiceId === invoiceId && e.endedAt !== null,
				);
				return invoiceEntryList.reduce((sum, e) => {
					const project = projectMap.get(e.projectId);
					const rate =
						project?.rateOverride ??
						clientRateMap.get(project?.clientId ?? 0) ??
						0;
					const hours = ((e.endedAt ?? 0) - e.startedAt) / 3600000;
					return sum + hours * rate;
				}, 0);
			};

			const typed = allInvoices
				.filter(
					(inv): inv is typeof inv & { client: (typeof allClients)[0] } =>
						'client' in inv && inv.client !== null,
				)
				.map((inv) => ({ ...inv, total: totalFor(inv.id) }));

			return render(<InvoicesIndexPage invoices={typed} />);
		},

		async new({ get }) {
			const db = get(Database);

			const unbilledEntries = await db.findMany(timeEntries, {
				where: { billable: true, invoiceId: null, endedAt: null },
				with: { project: entryProject },
			});

			const finishedEntries = (
				await db.findMany(timeEntries, {
					where: { billable: true, invoiceId: null },
					with: { project: entryProject },
				})
			).filter((e) => e.endedAt !== null);

			const allProjects = await db.findMany(projects);
			const allClients = await db.findMany(clients, {
				orderBy: ['name', 'asc'],
			});
			const clientRateMap = new Map(
				allClients.map((c) => [c.id, c.hourlyRate]),
			);
			const projectMap = new Map(allProjects.map((p) => [p.id, p]));

			const typedEntries = finishedEntries.filter(
				(e): e is typeof e & { project: (typeof allProjects)[0] } =>
					'project' in e && e.project !== null,
			);

			const unbilledByClient = new Map<
				number,
				{
					entries: (typeof typedEntries)[0][];
					totalMs: number;
					totalAmount: number;
				}
			>();

			for (const entry of typedEntries) {
				const project = projectMap.get(entry.projectId);
				if (!project) continue;

				const clientId = project.clientId;
				const rate = project.rateOverride ?? clientRateMap.get(clientId) ?? 0;
				const ms = (entry.endedAt ?? 0) - entry.startedAt;
				const amount = (ms / 3600000) * rate;

				const existing = unbilledByClient.get(clientId) ?? {
					entries: [],
					totalMs: 0,
					totalAmount: 0,
				};
				existing.entries.push(entry);
				existing.totalMs += ms;
				existing.totalAmount += amount;
				unbilledByClient.set(clientId, existing);
			}

			const clientsWithUnbilled = allClients.filter((c) =>
				unbilledByClient.has(c.id),
			);

			void unbilledEntries;

			return render(
				<InvoiceFormPage
					clients={clientsWithUnbilled}
					unbilledByClient={unbilledByClient}
				/>,
			);
		},

		async create({ get }) {
			const db = get(Database);
			const formData = get(FormData);
			const clientId = parseId(formData.get('clientId'));

			if (!clientId) {
				return new Response('Client ID required', { status: 400 });
			}

			const now = Date.now();

			const unbilledEntries = await db.findMany(timeEntries, {
				where: { billable: true, invoiceId: null },
			});

			const allProjects = await db.findMany(projects, { where: { clientId } });
			const projectIds = new Set(allProjects.map((p) => p.id));

			const entriesToBill = unbilledEntries.filter(
				(e) => projectIds.has(e.projectId) && e.endedAt !== null,
			);

			const invoice = await db.transaction(async (tx) => {
				const inv = await tx.create(
					invoices,
					{
						clientId,
						number: generateInvoiceNumber(),
						status: 'draft',
						issuedAt: null,
						dueAt: null,
						notes: null,
						createdAt: now,
						updatedAt: now,
					},
					{ returnRow: true },
				);

				for (const entry of entriesToBill) {
					await tx.update(timeEntries, entry.id, {
						invoiceId: inv.id,
						updatedAt: now,
					});
				}

				return inv;
			});

			return redirect(routes.invoices.show.href({ invoiceId: invoice.id }));
		},

		async show({ get, params }) {
			const db = get(Database);
			const invoiceId = parseId(params.invoiceId);
			const invoice =
				invoiceId === undefined
					? undefined
					: await db.find(invoices, invoiceId);

			if (!invoice) {
				return new Response('Invoice not found', { status: 404 });
			}

			const [client, entries] = await Promise.all([
				db.find(clients, invoice.clientId),
				db.findMany(timeEntries, {
					where: { invoiceId: invoice.id },
					with: { project: entryProject },
				}),
			]);

			if (!client) {
				return new Response('Client not found', { status: 404 });
			}

			const allProjects = await db.findMany(projects);
			const clientRateMap = new Map(
				(await db.findMany(clients)).map((c) => [c.id, c.hourlyRate]),
			);
			const projectMap = new Map(allProjects.map((p) => [p.id, p]));

			const typedEntries = entries.filter(
				(e): e is typeof e & { project: (typeof allProjects)[0] } =>
					'project' in e && e.project !== null,
			);

			const rateFor = (entry: (typeof typedEntries)[0]) => {
				const project = projectMap.get(entry.projectId);
				return (
					project?.rateOverride ??
					clientRateMap.get(project?.clientId ?? 0) ??
					0
				);
			};

			return render(
				<InvoiceShowPage
					invoice={invoice}
					client={client}
					entries={typedEntries}
					rateFor={rateFor}
				/>,
			);
		},

		async edit({ params }) {
			const invoiceId = parseId(params.invoiceId);

			if (invoiceId === undefined) {
				return new Response('Invoice not found', { status: 404 });
			}

			return redirect(routes.invoices.show.href({ invoiceId }));
		},

		async update({ get, params }) {
			const db = get(Database);
			const formData = get(FormData);
			const invoiceId = parseId(params.invoiceId);
			const invoice =
				invoiceId === undefined
					? undefined
					: await db.find(invoices, invoiceId);

			if (!invoice) {
				return new Response('Invoice not found', { status: 404 });
			}

			const { status } = s.parse(updateSchema, formData);
			const now = Date.now();

			await db.update(invoices, invoice.id, {
				status,
				issuedAt:
					status === 'sent' && !invoice.issuedAt ? now : invoice.issuedAt,
				updatedAt: now,
			});

			return redirect(routes.invoices.show.href({ invoiceId: invoice.id }));
		},

		async destroy({ get, params }) {
			const db = get(Database);
			const invoiceId = parseId(params.invoiceId);
			const invoice =
				invoiceId === undefined
					? undefined
					: await db.find(invoices, invoiceId);

			if (invoice) {
				await db.transaction(async (tx) => {
					await tx.updateMany(
						timeEntries,
						{ invoiceId: null, updatedAt: Date.now() },
						{ where: { invoiceId: invoice.id } },
					);
					await tx.delete(invoices, invoice.id);
				});
			}

			return redirect(routes.invoices.index.href());
		},
	},
} satisfies Controller<typeof routes.invoices>;

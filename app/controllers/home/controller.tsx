import { Database } from 'remix/data-table';
import type { BuildAction } from 'remix/fetch-router';

import {
	clients,
	invoiceClient,
	invoices,
	projectClient,
	projects,
	timeEntries,
} from '../../data/schema.ts';
import type { routes } from '../../routes.ts';
import { render } from '../../utils/render.tsx';
import type { DashboardPageProps } from './page.tsx';
import { DashboardPage } from './page.tsx';

export default {
	async handler({ get }) {
		const db = get(Database);

		const [clientCount, activeProjectCount, allProjects, allClients] =
			await Promise.all([
				db.count(clients),
				db.count(projects, { where: { status: 'active' } }),
				db.findMany(projects),
				db.findMany(clients),
			]);

		const clientRateMap = new Map(allClients.map((c) => [c.id, c.hourlyRate]));
		const projectMap = new Map(allProjects.map((p) => [p.id, p]));

		const completedUnbilled = await db.findMany(timeEntries, {
			where: { billable: true, invoiceId: null },
			orderBy: ['startedAt', 'desc'],
		});

		const finished = completedUnbilled.filter((e) => e.endedAt !== null);

		const unbilledMs = finished.reduce(
			(sum, e) => sum + ((e.endedAt ?? 0) - e.startedAt),
			0,
		);

		const unbilledAmount = finished.reduce((sum, e) => {
			const project = projectMap.get(e.projectId);
			const rate =
				project?.rateOverride ?? clientRateMap.get(project?.clientId ?? 0) ?? 0;
			const hours = ((e.endedAt ?? 0) - e.startedAt) / 3600000;
			return sum + hours * rate;
		}, 0);

		const sentInvoices = await db.findMany(invoices, {
			where: { status: 'sent' },
		});
		const outstandingAmount = sentInvoices.reduce(
			(sum, inv) =>
				sum + ((inv as unknown as { total?: number }).total ?? 0),
			0,
		);

		const running = completedUnbilled.find((e) => e.endedAt === null) ?? null;

		let runningEntry: DashboardPageProps['runningEntry'] = null;

		if (running) {
			const project = await db.find(projects, running.projectId, {
				with: { client: projectClient },
			});
			if (project && 'client' in project && project.client) {
				runningEntry = {
					...running,
					project: project as typeof project & {
						client: (typeof allClients)[0];
					},
				};
			}
		}

		const recentInvoiceRows = await db.findMany(invoices, {
			orderBy: ['createdAt', 'desc'],
			limit: 5,
			with: { client: invoiceClient },
		});

		const recentInvoices = recentInvoiceRows.filter(
			(inv): inv is typeof inv & { client: (typeof allClients)[0] } =>
				'client' in inv && inv.client !== null,
		);

		return render(
			<DashboardPage
				clientCount={clientCount}
				activeProjectCount={activeProjectCount}
				unbilledMs={unbilledMs}
				unbilledAmount={unbilledAmount}
				outstandingAmount={outstandingAmount}
				runningEntry={runningEntry}
				recentInvoices={recentInvoices}
			/>,
		);
	},
} satisfies BuildAction<'GET', typeof routes.home>;

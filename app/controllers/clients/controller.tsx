import * as s from 'remix/data-schema';
import * as f from 'remix/data-schema/form-data';
import { Database } from 'remix/data-table';
import type { Controller } from 'remix/fetch-router';
import { redirect } from 'remix/response/redirect';

import { clients, projects } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { parseId } from '../../utils/ids.ts';
import { render } from '../../utils/render.tsx';
import { ClientFormPage } from './form.tsx';
import { ClientsIndexPage } from './index-page.tsx';
import { ClientShowPage } from './show-page.tsx';

const clientSchema = f.object({
	name: f.field(s.defaulted(s.string(), '')),
	email: f.field(s.defaulted(s.string(), '')),
	company: f.field(s.optional(s.string())),
	hourlyRate: f.field(s.defaulted(s.string(), '0')),
});

export default {
	actions: {
		async index({ get }) {
			const db = get(Database);
			const allClients = await db.findMany(clients, {
				orderBy: ['name', 'asc'],
			});

			return render(<ClientsIndexPage clients={allClients} />);
		},

		new() {
			return render(<ClientFormPage action={routes.clients.create.href()} />);
		},

		async create({ get }) {
			const db = get(Database);
			const formData = get(FormData);
			const { name, email, company, hourlyRate } = s.parse(
				clientSchema,
				formData,
			);
			const now = Date.now();

			await db.create(clients, {
				name,
				email,
				company: company || null,
				hourlyRate: parseFloat(hourlyRate),
				createdAt: now,
				updatedAt: now,
			});

			return redirect(routes.clients.index.href());
		},

		async show({ get, params }) {
			const db = get(Database);
			const clientId = parseId(params.clientId);
			const client =
				clientId === undefined ? undefined : await db.find(clients, clientId);

			if (!client) {
				return new Response('Client not found', { status: 404 });
			}

			const clientProjectList = await db.findMany(projects, {
				where: { clientId: client.id },
				orderBy: ['name', 'asc'],
			});

			return render(
				<ClientShowPage
					client={client}
					projects={clientProjectList}
				/>,
			);
		},

		async edit({ get, params }) {
			const db = get(Database);
			const clientId = parseId(params.clientId);
			const client =
				clientId === undefined ? undefined : await db.find(clients, clientId);

			if (!client) {
				return new Response('Client not found', { status: 404 });
			}

			return render(
				<ClientFormPage
					action={routes.clients.update.href({ clientId: client.id })}
					method="PUT"
					client={client}
				/>,
			);
		},

		async update({ get, params }) {
			const db = get(Database);
			const formData = get(FormData);
			const clientId = parseId(params.clientId);
			const client =
				clientId === undefined ? undefined : await db.find(clients, clientId);

			if (!client) {
				return new Response('Client not found', { status: 404 });
			}

			const { name, email, company, hourlyRate } = s.parse(
				clientSchema,
				formData,
			);

			await db.update(clients, client.id, {
				name,
				email,
				company: company || null,
				hourlyRate: parseFloat(hourlyRate),
				updatedAt: Date.now(),
			});

			return redirect(routes.clients.show.href({ clientId: client.id }));
		},

		async destroy({ get, params }) {
			const db = get(Database);
			const clientId = parseId(params.clientId);
			const client =
				clientId === undefined ? undefined : await db.find(clients, clientId);

			if (client) {
				await db.delete(clients, client.id);
			}

			return redirect(routes.clients.index.href());
		},
	},
} satisfies Controller<typeof routes.clients>;

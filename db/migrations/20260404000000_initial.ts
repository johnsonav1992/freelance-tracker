import { table } from 'remix/data-table';
import { column as c, createMigration } from 'remix/data-table/migrations';

export default createMigration({
	async up({ schema }) {
		const clientsTable = table({
			name: 'clients',
			columns: {
				id: c.integer().primaryKey().autoIncrement(),
				name: c.text().notNull(),
				email: c.text().notNull(),
				company: c.text().nullable(),
				hourlyRate: c.decimal(10, 2).notNull(),
				createdAt: c.integer().notNull(),
				updatedAt: c.integer().notNull(),
			},
		});
		await schema.createTable(clientsTable);

		const projectsTable = table({
			name: 'projects',
			columns: {
				id: c.integer().primaryKey().autoIncrement(),
				clientId: c
					.integer()
					.notNull()
					.references('clients', 'id', 'projects_clientId_fk')
					.onDelete('restrict'),
				name: c.text().notNull(),
				description: c.text().nullable(),
				status: c.text().notNull(),
				rateOverride: c.decimal(10, 2).nullable(),
				createdAt: c.integer().notNull(),
				updatedAt: c.integer().notNull(),
			},
		});
		await schema.createTable(projectsTable);
		await schema.createIndex('projects', 'clientId', {
			name: 'projects_clientId_idx',
		});

		const timeEntriesTable = table({
			name: 'time_entries',
			columns: {
				id: c.integer().primaryKey().autoIncrement(),
				projectId: c
					.integer()
					.notNull()
					.references('projects', 'id', 'time_entries_projectId_fk')
					.onDelete('restrict'),
				description: c.text().nullable(),
				startedAt: c.integer().notNull(),
				endedAt: c.integer().nullable(),
				billable: c.boolean().notNull(),
				invoiceId: c.integer().nullable(),
				createdAt: c.integer().notNull(),
				updatedAt: c.integer().notNull(),
			},
		});
		await schema.createTable(timeEntriesTable);
		await schema.createIndex('time_entries', 'projectId', {
			name: 'time_entries_projectId_idx',
		});
		await schema.createIndex('time_entries', 'invoiceId', {
			name: 'time_entries_invoiceId_idx',
		});

		const invoicesTable = table({
			name: 'invoices',
			columns: {
				id: c.integer().primaryKey().autoIncrement(),
				clientId: c
					.integer()
					.notNull()
					.references('clients', 'id', 'invoices_clientId_fk')
					.onDelete('restrict'),
				number: c.text().notNull(),
				status: c.text().notNull(),
				issuedAt: c.integer().nullable(),
				dueAt: c.integer().nullable(),
				notes: c.text().nullable(),
				createdAt: c.integer().notNull(),
				updatedAt: c.integer().notNull(),
			},
		});
		await schema.createTable(invoicesTable);
		await schema.createIndex('invoices', 'clientId', {
			name: 'invoices_clientId_idx',
		});
	},

	async down({ schema }) {
		await schema.dropTable('invoices', { ifExists: true });
		await schema.dropTable('time_entries', { ifExists: true });
		await schema.dropTable('projects', { ifExists: true });
		await schema.dropTable('clients', { ifExists: true });
	},
});

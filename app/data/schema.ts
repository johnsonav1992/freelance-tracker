import type { TableRow } from 'remix/data-table';
import { belongsTo, column as c, hasMany, table } from 'remix/data-table';

export const clients = table({
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

export const projects = table({
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
		manualHours: c.decimal(10, 2).nullable(),
		manualAmount: c.decimal(10, 2).nullable(),
		createdAt: c.integer().notNull(),
		updatedAt: c.integer().notNull(),
	},
});

export const timeEntries = table({
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

export const invoices = table({
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

export const clientProjects = hasMany(clients, projects, { foreignKey: 'clientId' });
export const clientInvoices = hasMany(clients, invoices, { foreignKey: 'clientId' });
export const projectClient = belongsTo(projects, clients, { foreignKey: 'clientId' });
export const projectEntries = hasMany(projects, timeEntries, { foreignKey: 'projectId' });
export const entryProject = belongsTo(timeEntries, projects, { foreignKey: 'projectId' });
export const entryInvoice = belongsTo(timeEntries, invoices, { foreignKey: 'invoiceId' });
export const invoiceEntries = hasMany(invoices, timeEntries, { foreignKey: 'invoiceId' });
export const invoiceClient = belongsTo(invoices, clients, { foreignKey: 'clientId' });

export type Client = TableRow<typeof clients>;
export type Project = TableRow<typeof projects>;
export type TimeEntry = TableRow<typeof timeEntries>;
export type Invoice = TableRow<typeof invoices>;

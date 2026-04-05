import { table } from 'remix/data-table';
import { column as c, createMigration } from 'remix/data-table/migrations';

export default createMigration({
	async up({ schema }) {
		const projectTasksTable = table({
			name: 'project_tasks',
			columns: {
				id: c.integer().primaryKey().autoIncrement(),
				projectId: c
					.integer()
					.notNull()
					.references('projects', 'id', 'project_tasks_projectId_fk')
					.onDelete('restrict'),
				title: c.text().notNull(),
				description: c.text().nullable(),
				status: c.text().notNull(),
				sortOrder: c.integer().notNull(),
				createdAt: c.integer().notNull(),
				updatedAt: c.integer().notNull(),
			},
		});

		await schema.createTable(projectTasksTable);
		await schema.createIndex('project_tasks', 'projectId', {
			name: 'project_tasks_projectId_idx',
		});

		await schema.alterTable('time_entries', (t) => {
			t.addColumn(
				'taskId',
				c
					.integer()
					.nullable()
					.references('project_tasks', 'id', 'time_entries_taskId_fk')
					.onDelete('set null'),
			);
		});

		await schema.createIndex('time_entries', 'taskId', {
			name: 'time_entries_taskId_idx',
		});
	},

	async down({ schema }) {
		await schema.dropIndex('time_entries', 'time_entries_taskId_idx', {
			ifExists: true,
		});

		await schema.alterTable('time_entries', (t) => {
			t.dropColumn('taskId');
		});

		await schema.dropTable('project_tasks', { ifExists: true });
	},
});

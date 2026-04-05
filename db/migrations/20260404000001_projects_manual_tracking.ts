import { column as c, createMigration } from 'remix/data-table/migrations';

export default createMigration({
	async up({ schema }) {
		await schema.alterTable('projects', (t) => {
			t.addColumn('manualHours', c.decimal(10, 2).nullable());
			t.addColumn('manualAmount', c.decimal(10, 2).nullable());
		});
	},
	async down({ schema }) {
		await schema.alterTable('projects', (t) => {
			t.dropColumn('manualHours');
			t.dropColumn('manualAmount');
		});
	},
});

import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import BetterSqlite3 from 'better-sqlite3';
import { createDatabase } from 'remix/data-table';
import { createMigrationRunner } from 'remix/data-table/migrations';
import { loadMigrations } from 'remix/data-table/migrations/node';
import { createSqliteDatabaseAdapter } from 'remix/data-table-sqlite';

const dbDirectoryUrl = new URL('../../db/', import.meta.url);
const dbFilePath = fileURLToPath(new URL('freelance.sqlite', dbDirectoryUrl));
const migrationsPath = fileURLToPath(
	new URL('../../db/migrations/', import.meta.url),
);

fs.mkdirSync(fileURLToPath(dbDirectoryUrl), { recursive: true });

const sqlite = new BetterSqlite3(dbFilePath);
sqlite.pragma('foreign_keys = ON');
sqlite.pragma('journal_mode = WAL');

const adapter = createSqliteDatabaseAdapter(sqlite);

export const db = createDatabase(adapter);

let initializePromise: Promise<void> | null = null;

export const initializeDatabase = (): Promise<void> => {
	if (!initializePromise) {
		initializePromise = runInitialize();
	}

	return initializePromise;
};

const runInitialize = async (): Promise<void> => {
	const migrations = await loadMigrations(migrationsPath);
	const runner = createMigrationRunner(adapter, migrations);

	await runner.up();
};

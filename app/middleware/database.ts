import { Database } from 'remix/data-table';
import type { Middleware } from 'remix/fetch-router';

import { db } from '../data/setup.ts';

type SetDatabaseContextTransform = readonly [
	readonly [typeof Database, Database],
];

export const loadDatabase = (): Middleware<
	'ANY',
	Record<string, never>,
	SetDatabaseContextTransform
> => {
	return async (context, next) => {
		context.set(Database, db);
		return next();
	};
};

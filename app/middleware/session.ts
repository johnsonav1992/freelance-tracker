import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCookie } from 'remix/cookie';
import { Session } from 'remix/session';
import { createFsSessionStorage } from 'remix/session/fs-storage';

const rootPath = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'..',
	'..',
);
const sessionDirectoryPath = path.join(rootPath, 'tmp', 'sessions');

fs.mkdirSync(sessionDirectoryPath, { recursive: true });

export const sessionCookie = createCookie('session', {
	secrets: ['freelance-tracker-secret-change-in-prod'],
	httpOnly: true,
	sameSite: 'Lax',
	maxAge: 2592000,
	path: '/',
});

export const sessionStorage = createFsSessionStorage(sessionDirectoryPath);

export { Session };

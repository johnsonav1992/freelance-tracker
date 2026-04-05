import * as http from 'node:http';
import { createRequestListener } from 'remix/node-fetch-server';

import { initializeDatabase } from './app/data/setup.ts';
import { createAppRouter } from './app/router.ts';

await initializeDatabase();

const router = createAppRouter();

const server = http.createServer(
	createRequestListener(async (request) => {
		try {
			return await router.fetch(request);
		} catch (error) {
			console.error(error);
			return new Response('Internal Server Error', { status: 500 });
		}
	}),
);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

server.listen(port, () => {
	console.log(`Freelance Tracker running on http://localhost:${port}`);
});

let shuttingDown = false;

const shutdown = () => {
	if (shuttingDown) return;
	shuttingDown = true;
	server.close(() => process.exit(0));
	server.closeAllConnections();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

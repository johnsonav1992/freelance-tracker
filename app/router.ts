import { asyncContext } from 'remix/async-context-middleware';
import { compression } from 'remix/compression-middleware';
import { createRouter } from 'remix/fetch-router';
import { formData } from 'remix/form-data-middleware';
import { logger } from 'remix/logger-middleware';
import { methodOverride } from 'remix/method-override-middleware';
import { session } from 'remix/session-middleware';
import { staticFiles } from 'remix/static-middleware';

import clientsController from './controllers/clients/controller.tsx';
import homeController from './controllers/home/controller.tsx';
import invoicesController from './controllers/invoices/controller.tsx';
import projectsController from './controllers/projects/controller.tsx';
import timeController from './controllers/time/controller.tsx';
import { loadDatabase } from './middleware/database.ts';
import { sessionCookie, sessionStorage } from './middleware/session.ts';
import { routes } from './routes.ts';

export const createAppRouter = () => {
	const middleware = [];

	if (process.env.NODE_ENV === 'development') {
		middleware.push(logger());
	}

	middleware.push(compression());
	middleware.push(
		staticFiles('./public', {
			cacheControl: 'no-store, must-revalidate',
			etag: false,
			lastModified: false,
		}),
	);
	middleware.push(formData());
	middleware.push(methodOverride());
	middleware.push(session(sessionCookie, sessionStorage));
	middleware.push(asyncContext());
	middleware.push(loadDatabase());

	const router = createRouter({ middleware });

	router.map(routes.home, homeController);
	router.map(routes.clients, clientsController);
	router.map(routes.projects, projectsController);
	router.map(routes.time, timeController);
	router.map(routes.invoices, invoicesController);

	return router;
};

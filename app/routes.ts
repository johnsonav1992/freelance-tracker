import {
	del,
	get,
	post,
	put,
	resources,
	route,
} from 'remix/fetch-router/routes';

export const routes = route({
	assets: '/assets/*path',

	home: '/',

	clients: resources('clients', { param: 'clientId' }),

	projects: {
		...resources('projects', { param: 'projectId' }),
		tasks: resources('projects/:projectId/tasks', {
			param: 'taskId',
			only: ['new', 'create', 'edit', 'update', 'destroy'],
		}),
	},

	time: route('time', {
		index: get('/'),
		new: get('/new'),
		create: post('/'),
		show: get('/:entryId'),
		edit: get('/:entryId/edit'),
		update: put('/:entryId'),
		destroy: del('/:entryId'),
		stop: post('/:entryId/stop'),
	}),

	invoices: resources('invoices', { param: 'invoiceId' }),
});

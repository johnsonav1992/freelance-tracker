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

	projects: resources('projects', { param: 'projectId' }),

	time: route('time', {
		index: get('/time'),
		new: get('/time/new'),
		create: post('/time'),
		show: get('/time/:entryId'),
		edit: get('/time/:entryId/edit'),
		update: put('/time/:entryId'),
		destroy: del('/time/:entryId'),
		stop: post('/time/:entryId/stop'),
	}),

	invoices: resources('invoices', { param: 'invoiceId' }),
});

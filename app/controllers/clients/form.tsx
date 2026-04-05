import { css } from 'remix/component';

import type { Client } from '../../data/schema.ts';
import { Layout } from '../../ui/layout.tsx';
import { RestfulForm } from '../../ui/restful-form.tsx';

export interface ClientFormPageProps {
	action: string;
	method?: 'POST' | 'PUT';
	client?: Client;
}

export const ClientFormPage =
	() =>
	({ action, method = 'POST', client }: ClientFormPageProps) => (
		<Layout
			title={client ? 'Edit Client' : 'New Client'}
			activeNav="clients"
		>
			<div mix={css({ marginBottom: '1.5rem' })}>
				<h1 mix={css({ margin: 0, fontSize: '1.5rem', fontWeight: 700 })}>
					{client ? 'Edit Client' : 'New Client'}
				</h1>
			</div>

			<div
				mix={css({
					background: '#1a1a1a',
					borderRadius: '8px',
					padding: '1.5rem',
					border: '1px solid #2a2a2a',
					maxWidth: '560px',
				})}
			>
				<RestfulForm
					method={method}
					action={action}
				>
					<div
						mix={css({ display: 'flex', flexDirection: 'column', gap: '1rem' })}
					>
						<div class="form-group">
							<label for="name">Name</label>
							<input
								type="text"
								id="name"
								name="name"
								value={client?.name}
								required
								placeholder="Jane Smith"
							/>
						</div>

						<div class="form-group">
							<label for="email">Email</label>
							<input
								type="email"
								id="email"
								name="email"
								value={client?.email}
								required
								placeholder="jane@example.com"
							/>
						</div>

						<div class="form-group">
							<label for="company">Company (optional)</label>
							<input
								type="text"
								id="company"
								name="company"
								value={client?.company ?? ''}
								placeholder="Acme Corp"
							/>
						</div>

						<div class="form-group">
							<label for="hourlyRate">Hourly Rate ($)</label>
							<input
								type="number"
								id="hourlyRate"
								name="hourlyRate"
								step="0.01"
								min="0"
								value={client?.hourlyRate ?? 0}
								required
							/>
						</div>
					</div>

					<div
						mix={css({ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' })}
					>
						<button
							type="submit"
							class="btn btn-primary"
						>
							{client ? 'Update Client' : 'Create Client'}
						</button>
						<a
							href="/clients"
							class="btn btn-secondary"
						>
							Cancel
						</a>
					</div>
				</RestfulForm>
			</div>
		</Layout>
	);

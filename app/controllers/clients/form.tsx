import type { Client } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { Layout } from '../../ui/Layout.tsx';
import { RestfulForm } from '../../ui/RestfulForm.tsx';
import { PageHeader } from '../../ui/Screen.tsx';

export interface ClientFormPageProps {
	action: string;
	method?: 'POST' | 'PUT';
	client?: Client;
}

export const ClientFormPage = () => {
	return ({ action, method = 'POST', client }: ClientFormPageProps) => (
		<Layout
			title={client ? 'Edit Client' : 'New Client'}
			activeNav="clients"
		>
			<PageHeader
				eyebrow="Clients"
				title={client ? 'Edit client' : 'Create a client'}
				subtitle="Keep the record minimal: contact info, company, and the default hourly rate you want the app to use."
			/>

			<div class="form-card">
				<RestfulForm
					method={method}
					action={action}
				>
					<div class="form-grid">
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

						<div class="field-grid">
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
								<label for="company">Company</label>
								<input
									type="text"
									id="company"
									name="company"
									value={client?.company ?? ''}
									placeholder="Acme Studio"
								/>
								<div class="field-hint">
									Optional if you mainly work with individuals.
								</div>
							</div>
						</div>

						<div class="form-group">
							<label for="hourlyRate">Default hourly rate</label>
							<input
								type="number"
								id="hourlyRate"
								name="hourlyRate"
								step="0.01"
								min="0"
								value={client?.hourlyRate ?? 0}
								required
							/>
							<div class="field-hint">
								Projects can override this later, but this is the rate the app
								will assume by default.
							</div>
						</div>

						<div class="form-actions">
							<button
								type="submit"
								class="btn btn-primary"
							>
								{client ? 'Save changes' : 'Create client'}
							</button>
							<a
								href={routes.clients.index.href()}
								class="btn btn-secondary"
							>
								Cancel
							</a>
						</div>
					</div>
				</RestfulForm>
			</div>
		</Layout>
	);
};

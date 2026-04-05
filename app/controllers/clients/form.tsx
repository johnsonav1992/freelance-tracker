import type { Client } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { AppLink } from '../../ui/AppLink.tsx';
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
				title={client ? 'Edit client' : 'New client'}
				subtitle="Name, email, company, and default hourly rate."
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
								defaultValue={client?.name}
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
									defaultValue={client?.email}
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
									defaultValue={client?.company ?? ''}
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
								defaultValue={client?.hourlyRate ?? 0}
								required
							/>
							<div class="field-hint">
								Projects can override this rate later.
							</div>
						</div>

						<div class="form-actions">
							<button
								type="submit"
								class="btn btn-primary"
							>
								{client ? 'Save changes' : 'Create client'}
							</button>
							<AppLink
								href={routes.clients.index.href()}
								class="btn btn-secondary"
							>
								Cancel
							</AppLink>
						</div>
					</div>
				</RestfulForm>
			</div>
		</Layout>
	);
};

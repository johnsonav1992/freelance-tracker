import { Timer } from '../../assets/timer.tsx';
import type { Client, Invoice, Project, TimeEntry } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
import { AppLink } from '../../ui/AppLink.tsx';
import { Layout } from '../../ui/Layout.tsx';
import {
	EmptyState,
	MetricCard,
	PageHeader,
	SectionCard,
} from '../../ui/Screen.tsx';
import { formatCurrency, formatDuration } from '../../utils/format.ts';

export interface DashboardPageProps {
	clientCount: number;
	activeProjectCount: number;
	unbilledMs: number;
	unbilledAmount: number;
	outstandingAmount: number;
	runningEntry: (TimeEntry & { project: Project & { client: Client } }) | null;
	recentInvoices: (Invoice & { client: Client })[];
}

export const DashboardPage = () => {
	return ({
		clientCount,
		activeProjectCount,
		unbilledMs,
		unbilledAmount,
		outstandingAmount,
		runningEntry,
		recentInvoices,
	}: DashboardPageProps) => (
		<Layout
			title="Dashboard"
			activeNav="home"
		>
			<PageHeader
				eyebrow="Dashboard"
				title="Dashboard"
				subtitle="Summary of active work, unbilled time, and recent invoices."
				actions={
					<>
						<AppLink
							href={routes.time.new.href()}
							class="btn btn-primary"
						>
							Log time
						</AppLink>
						<AppLink
							href={routes.invoices.new.href()}
							class="btn btn-secondary"
						>
							Create invoice
						</AppLink>
					</>
				}
			/>

			{runningEntry && (
				<SectionCard
					title="Timer running"
					subtitle={`${runningEntry.project.client.name} • ${runningEntry.project.name}`}
					actions={
						<Timer
							setup={{
								entryId: runningEntry.id,
								startedAt: runningEntry.startedAt,
							}}
						/>
					}
					tone="highlight"
				>
					<p class="list-item-text">
						{runningEntry.description || 'No session notes yet.'}
					</p>
				</SectionCard>
			)}

			<div class="metric-grid">
				<MetricCard
					label="Clients"
					value={String(clientCount)}
					note="Total clients"
				/>
				<MetricCard
					label="Active projects"
					value={String(activeProjectCount)}
					note="Projects not marked done"
				/>
				<MetricCard
					label="Unbilled time"
					value={formatDuration(unbilledMs)}
					note={
						unbilledAmount > 0
							? formatCurrency(unbilledAmount)
							: 'Nothing ready to invoice.'
					}
					tone="accent"
				/>
				<MetricCard
					label="Outstanding"
					value={formatCurrency(outstandingAmount)}
					note="Sent invoices not marked paid"
				/>
			</div>

			<div class="split-grid">
				<SectionCard
					title="Quick actions"
					subtitle="Common tasks"
					tone="tint"
				>
					<div class="list-stack">
						<ActionRow
							href={routes.clients.new.href()}
							title="Add a client"
							copy="Create a client record."
						/>
						<ActionRow
							href={routes.projects.new.href()}
							title="Create a project"
							copy="Add a project under a client."
						/>
						<ActionRow
							href={routes.time.new.href()}
							title="Log time"
							copy="Add or edit a completed entry."
						/>
						<ActionRow
							href={routes.invoices.new.href()}
							title="Invoice unbilled work"
							copy="Create an invoice from unbilled entries."
						/>
					</div>
				</SectionCard>

				<SectionCard
					title="Recent invoices"
					subtitle="Latest invoice records"
				>
					{recentInvoices.length === 0 ? (
						<EmptyState
							title="No invoices yet"
							description="Invoices will appear here after you create them."
						/>
					) : (
						<div class="list-stack">
							{recentInvoices.map((invoice) => (
								<div class="list-item">
									<div class="list-item-primary">
										<div class="list-item-title">
											<AppLink
												href={routes.invoices.show.href({
													invoiceId: invoice.id,
												})}
											>
												<span class="mono">{invoice.number}</span>
											</AppLink>
										</div>
										<div class="meta-row">
											<strong>{invoice.client.name}</strong>
										</div>
									</div>
									<div class="list-item-side">
										<span class={`badge badge-${invoice.status}`}>
											{invoice.status}
										</span>
										<AppLink
											href={routes.invoices.show.href({
												invoiceId: invoice.id,
											})}
											class="btn btn-secondary btn-sm"
										>
											Open
										</AppLink>
									</div>
								</div>
							))}
						</div>
					)}
				</SectionCard>
			</div>

			{unbilledAmount > 0 && (
				<div class="callout">
					<div>
						<h2 class="callout-title">
							Unbilled total: {formatCurrency(unbilledAmount)}
						</h2>
						<p class="callout-copy">
							{formatDuration(unbilledMs)} of finished billable time is not
							attached to an invoice yet.
						</p>
					</div>
					<AppLink
						href={routes.invoices.new.href()}
						class="btn btn-primary"
					>
						Review unbilled work
					</AppLink>
				</div>
			)}
		</Layout>
	);
};

const ActionRow = () => {
	return ({
		href,
		title,
		copy,
	}: {
		href: string;
		title: string;
		copy: string;
	}) => (
		<AppLink
			href={href}
			class="list-item"
		>
			<span class="list-item-primary">
				<p class="list-item-title">{title}</p>
				<p class="list-item-text">{copy}</p>
			</span>
			<span class="list-item-side">
				<span class="meta-chip meta-chip-accent">Open</span>
			</span>
		</AppLink>
	);
};

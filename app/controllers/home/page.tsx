import { Timer } from '../../assets/timer.tsx';
import type { Client, Invoice, Project, TimeEntry } from '../../data/schema.ts';
import { routes } from '../../routes.ts';
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
				eyebrow="Overview"
				title="Keep the business side easy."
				subtitle="The dashboard keeps today’s work, unbilled time, and invoice follow-ups in one place so you can act without hunting around."
				actions={
					<>
						<a
							href={routes.time.new.href()}
							class="btn btn-primary"
						>
							Log time
						</a>
						<a
							href={routes.invoices.new.href()}
							class="btn btn-secondary"
						>
							Create invoice
						</a>
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
					note="Active relationships you’re managing."
				/>
				<MetricCard
					label="Active projects"
					value={String(activeProjectCount)}
					note="Work that still needs attention."
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
					note="Invoices marked sent but not yet paid."
				/>
			</div>

			<div class="split-grid">
				<SectionCard
					title="Next actions"
					subtitle="The fastest paths through your regular admin work."
					tone="tint"
				>
					<div class="list-stack">
						<ActionRow
							href={routes.clients.new.href()}
							title="Add a client"
							copy="Start a new relationship with contact details and an hourly rate."
						/>
						<ActionRow
							href={routes.projects.new.href()}
							title="Create a project"
							copy="Attach work to a client so time and invoices stay organized."
						/>
						<ActionRow
							href={routes.time.new.href()}
							title="Log time"
							copy="Capture completed work or clean up a recent session."
						/>
						<ActionRow
							href={routes.invoices.new.href()}
							title="Invoice unbilled work"
							copy="Turn tracked time into money without leaving the app."
						/>
					</div>
				</SectionCard>

				<SectionCard
					title="Recent invoices"
					subtitle="Keep an eye on what’s drafted, sent, or paid."
				>
					{recentInvoices.length === 0 ? (
						<EmptyState
							title="No invoices yet"
							description="When you create invoices, they’ll show up here so you can track status quickly."
						/>
					) : (
						<div class="list-stack">
							{recentInvoices.map((invoice) => (
								<div class="list-item">
									<div class="list-item-primary">
										<p class="list-item-title">
											<a
												href={routes.invoices.show.href({
													invoiceId: invoice.id,
												})}
											>
												<span class="mono">{invoice.number}</span>
											</a>
										</p>
										<div class="meta-row">
											<strong>{invoice.client.name}</strong>
										</div>
									</div>
									<div class="list-item-side">
										<span class={`badge badge-${invoice.status}`}>
											{invoice.status}
										</span>
										<a
											href={routes.invoices.show.href({
												invoiceId: invoice.id,
											})}
											class="btn btn-secondary btn-sm"
										>
											Open
										</a>
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
							{formatCurrency(unbilledAmount)} is ready to invoice
						</h2>
						<p class="callout-copy">
							You have {formatDuration(unbilledMs)} of finished billable time
							waiting to be turned into an invoice.
						</p>
					</div>
					<a
						href={routes.invoices.new.href()}
						class="btn btn-primary"
					>
						Review unbilled work
					</a>
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
		<a
			href={href}
			class="list-item"
		>
			<div class="list-item-primary">
				<p class="list-item-title">{title}</p>
				<p class="list-item-text">{copy}</p>
			</div>
			<div class="list-item-side">
				<span class="meta-chip meta-chip-accent">Open</span>
			</div>
		</a>
	);
};

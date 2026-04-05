import type { RemixNode } from 'remix/component';

export interface PageHeaderProps {
	eyebrow?: string;
	title: string;
	subtitle?: string;
	actions?: RemixNode;
}

export const PageHeader = () => {
	return ({ eyebrow, title, subtitle, actions }: PageHeaderProps) => (
		<header class="page-header">
			<div class="page-header-copy">
				{eyebrow && <div class="page-eyebrow">{eyebrow}</div>}
				<h1 class="page-title">{title}</h1>
				{subtitle && <p class="page-subtitle">{subtitle}</p>}
			</div>
			{actions && <div class="page-actions">{actions}</div>}
		</header>
	);
};

export interface SectionCardProps {
	title?: string;
	subtitle?: string;
	actions?: RemixNode;
	children?: RemixNode;
	tone?: 'default' | 'tint' | 'highlight';
}

export const SectionCard = () => {
	return ({
		title,
		subtitle,
		actions,
		children,
		tone = 'default',
	}: SectionCardProps) => (
		<section class={`section-card section-card-${tone}`}>
			{(title || subtitle || actions) && (
				<div class="section-card-header">
					<div>
						{title && <h2 class="section-card-title">{title}</h2>}
						{subtitle && <p class="section-card-subtitle">{subtitle}</p>}
					</div>
					{actions && <div class="section-card-actions">{actions}</div>}
				</div>
			)}
			<div class="section-card-body">{children}</div>
		</section>
	);
};

export interface MetricCardProps {
	label: string;
	value: string;
	note?: string;
	tone?: 'default' | 'accent';
}

export const MetricCard = () => {
	return ({ label, value, note, tone = 'default' }: MetricCardProps) => (
		<div class={`metric-card metric-card-${tone}`}>
			<div class="metric-label">{label}</div>
			<div class="metric-value">{value}</div>
			{note && <div class="metric-note">{note}</div>}
		</div>
	);
};

export interface EmptyStateProps {
	title: string;
	description: string;
	action?: RemixNode;
}

export const EmptyState = () => {
	return ({ title, description, action }: EmptyStateProps) => (
		<div class="empty-state">
			<h2 class="empty-state-title">{title}</h2>
			<p class="empty-state-description">{description}</p>
			{action && <div class="empty-state-action">{action}</div>}
		</div>
	);
};

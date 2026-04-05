import type { RemixNode } from 'remix/component';
import { link } from 'remix/component';

export interface AppLinkProps {
	href: string;
	class?: string;
	children?: RemixNode;
	ariaCurrent?: 'page';
}

export const AppLink = () => {
	return ({ href, class: className, children, ariaCurrent }: AppLinkProps) => {
		return (
			<a
				href={href}
				class={className}
				aria-current={ariaCurrent}
				mix={link(href)}
			>
				{children}
			</a>
		);
	};
};

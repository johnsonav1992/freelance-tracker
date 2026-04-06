import type {
	Handle,
	NavigationOptions,
	RemixNode,
	SerializableValue,
} from 'remix/component';
import { clientEntry, navigate, on } from 'remix/component';

import { routes } from '../routes.ts';

export interface AppLinkProps {
	[key: string]: SerializableValue;
	href: string;
	class?: string;
	children?: RemixNode;
	ariaCurrent?: 'page';
	target?: NavigationOptions['target'];
}

export const AppLink = clientEntry(
	routes.assets.href({ path: 'entry.js#AppLink' }),
	function AppLink(_handle: Handle) {
		return ({
			href,
			class: className,
			children,
			ariaCurrent,
			target,
		}: AppLinkProps) => {
			const resolvedClassName = className
				? `app-link ${className}`
				: 'app-link app-link-inline';

			return (
				<button
					type="button"
					class={resolvedClassName}
					aria-current={ariaCurrent}
					mix={on<HTMLButtonElement, 'click'>('click', () => {
						void navigate(href, target ? { target } : undefined);
					})}
				>
					{children}
				</button>
			);
		};
	},
);

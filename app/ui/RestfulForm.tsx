import type { RemixNode, SerializableValue } from 'remix/component';
import { clientEntry, type Handle, navigate, on } from 'remix/component';

import { routes } from '../routes.ts';

export interface RestfulFormProps {
	[key: string]: SerializableValue;
	action: string;
	method?: string;
	methodOverrideField?: string;
	class?: string;
	children?: RemixNode;
}

export const RestfulForm = clientEntry(
	routes.assets.href({ path: 'entry.js#RestfulForm' }),
	(_handle: Handle) =>
		({
			method = 'GET',
			methodOverrideField = '_method',
			action,
			class: className,
			children,
		}: RestfulFormProps) => {
			const upperMethod = method.toUpperCase();

			if (upperMethod === 'GET') {
				return (
					<form
						method="GET"
						action={action}
						class={className}
					>
						{children}
					</form>
				);
			}

			return (
				<form
					method="POST"
					action={action}
					class={className}
					mix={on<HTMLFormElement, 'submit'>(
						'submit',
						async (event, signal) => {
							event.preventDefault();
							const form = event.currentTarget as HTMLFormElement;
							const response = await fetch(form.action, {
								method: 'POST',
								body: new FormData(form),
								signal,
							});
							await navigate(response.url);
						},
					)}
				>
					{upperMethod !== 'POST' && (
						<input
							type="hidden"
							name={methodOverrideField}
							value={upperMethod}
						/>
					)}
					{children}
				</form>
			);
		},
);

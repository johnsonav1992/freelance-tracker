import type { Props } from 'remix/component';

export interface RestfulFormProps extends Props<'form'> {
	methodOverrideField?: string;
}

export const RestfulForm =
	() =>
	({
		method = 'GET',
		methodOverrideField = '_method',
		...props
	}: RestfulFormProps) => {
		const upperMethod = method.toUpperCase();

		if (upperMethod === 'GET') {
			return (
				<form
					method="GET"
					{...props}
				/>
			);
		}

		return (
			<form
				method="POST"
				{...props}
			>
				{upperMethod !== 'POST' && (
					<input
						type="hidden"
						name={methodOverrideField}
						value={upperMethod}
					/>
				)}
				{props.children}
			</form>
		);
	};

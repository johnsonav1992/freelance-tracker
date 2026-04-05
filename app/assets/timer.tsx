import { clientEntry, css, type Handle, navigate, on } from 'remix/component';

import { routes } from '../routes.ts';

export const Timer = clientEntry(
	routes.assets.href({ path: 'entry.js#Timer' }),
	function Timer(
		handle: Handle,
		setup: { entryId: number; startedAt: number },
	) {
		const { entryId, startedAt } = setup;
		let elapsed = Date.now() - startedAt;

		handle.queueTask(() => {
			const interval = setInterval(() => {
				elapsed = Date.now() - startedAt;
				handle.update();
			}, 1000);

			handle.signal.addEventListener('abort', () => clearInterval(interval));
		});

		return () => {
			const totalSeconds = Math.floor(elapsed / 1000);
			const h = Math.floor(totalSeconds / 3600);
			const m = Math.floor((totalSeconds % 3600) / 60);
			const s = totalSeconds % 60;
			const display = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

			return (
				<div
					mix={css({
						display: 'flex',
						alignItems: 'center',
						gap: '0.75rem',
						flexWrap: 'wrap',
					})}
				>
					<span
						mix={css({
							fontFamily: 'monospace',
							fontSize: '0.98rem',
							fontWeight: 700,
							lineHeight: 1,
						})}
					>
						{display}
					</span>
					<form
						method="POST"
						action={routes.time.stop.href({ entryId })}
						mix={on<HTMLFormElement, 'submit'>(
							'submit',
							async (event, signal) => {
								event.preventDefault();
								const form = event.currentTarget;
								const response = await fetch(form.action, {
									method: 'POST',
									body: new FormData(form),
									signal,
								});
								await navigate(response.url);
							},
						)}
					>
						<button
							type="submit"
							mix={css({
								background: 'rgba(244, 63, 94, 0.14)',
								color: '#fda4af',
								border: '1px solid rgba(253, 164, 175, 0.14)',
								borderRadius: '10px',
								padding: '0.55rem 0.9rem',
								fontSize: '0.84rem',
								fontWeight: 700,
								lineHeight: 1,
								cursor: 'pointer',
								'&:hover': {
									background: 'rgba(244, 63, 94, 0.2)',
								},
							})}
						>
							Stop
						</button>
					</form>
				</div>
			);
		};
	},
);

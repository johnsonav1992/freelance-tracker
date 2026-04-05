import { clientEntry, css, type Handle } from 'remix/component';

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
					mix={css({ display: 'flex', alignItems: 'center', gap: '0.75rem' })}
				>
					<span
						mix={css({
							fontFamily: 'monospace',
							fontSize: '1rem',
							fontWeight: 600,
						})}
					>
						{display}
					</span>
					<form
						method="POST"
						action={routes.time.stop.href({ entryId })}
					>
						<button
							type="submit"
							mix={css({
								background: '#dc2626',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								padding: '0.3rem 0.75rem',
								fontSize: '0.8rem',
								cursor: 'pointer',
								'&:hover': { background: '#b91c1c' },
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { initializeRGSClient, ParseAmount } from './rgsClient';
	import { setupAllEventListeners, removeAllEventListeners } from './eventListeners';
	import { stateBet } from './stateBet';
	import { stateConfig } from './stateConfig';
	import { stateRGS } from '../game/stateRGS';

	let authenticated = false;
	let authError: string | null = null;
	let isDemoMode = false;

	const MOST_USED_BET_INDEXES = [0, 4, 9, 19, 29, 49, 99];
	const DEFAULT_BET_LEVELS = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];

	const setupDemoMode = () => {
		console.log('[Auth] Setting up demo mode...');

		stateBet.update(state => ({
			...state,
			currency: 'USD',
			balanceAmount: 1000,
			betAmount: 1,
			wageredBetAmount: 1,
		}));

		const betMenuOptions = DEFAULT_BET_LEVELS.filter((_, index) =>
			MOST_USED_BET_INDEXES.includes(index),
		);

		stateConfig.update(state => ({
			...state,
			betAmountOptions: DEFAULT_BET_LEVELS,
			betMenuOptions,
		}));

		stateRGS.setBalance(1000, 'USD');
		stateRGS.setBetAmount(1);
		stateRGS.setAvailableBetLevels(DEFAULT_BET_LEVELS);
		stateRGS.setAuthenticated(true);
		stateRGS.updateCanSpin();

		console.log('[Auth] Demo mode configured successfully');
	};

	const authenticate = async () => {
		try {
			const rgsClient = initializeRGSClient();

			console.log('[Auth] Starting authentication with SDK...');

			const authenticateData = await rgsClient.Authenticate();

			console.log('[Auth] SDK Response:', authenticateData);

			if (authenticateData?.balance) {
				const balanceAmount = ParseAmount(authenticateData.balance.amount);

				stateBet.update(state => ({
					...state,
					currency: authenticateData.balance.currency,
					balanceAmount,
				}));

				stateRGS.setBalance(balanceAmount, authenticateData.balance.currency);

				console.log('[Auth] Balance set:', balanceAmount, authenticateData.balance.currency);
			}

			if (authenticateData?.config) {
				const betAmountOptions = authenticateData.config.betLevels;
				const betMenuOptions = betAmountOptions.filter((_, index) =>
					MOST_USED_BET_INDEXES.includes(index),
				);

				stateConfig.update(state => ({
					...state,
					jurisdiction: authenticateData.jurisdictionFlags,
					betAmountOptions,
					betMenuOptions,
				}));

				if (betAmountOptions.length > 0) {
					const defaultBet = authenticateData.config.defaultBetLevel || betAmountOptions[0];

					stateBet.update(state => ({
						...state,
						betAmount: defaultBet,
						wageredBetAmount: defaultBet,
					}));

					stateRGS.setBetAmount(defaultBet);
					stateRGS.setAvailableBetLevels(betAmountOptions);
				}

				const betState = get(stateBet);
				console.log('[Auth] Config loaded:', {
					betLevels: betAmountOptions,
					defaultBet: betState.betAmount,
				});
			}

			if (authenticateData?.round) {
				if (authenticateData.round?.state) {
					stateBet.update(state => ({
						...state,
						lastBet: authenticateData.round,
					}));
				}

				if (authenticateData.round?.amount) {
					const betState = get(stateBet);
					const betAmountValue = authenticateData.round.amount > 0
						? authenticateData.round.amount
						: betState.betAmount;

					stateBet.update(state => ({
						...state,
						betAmount: betAmountValue,
						wageredBetAmount: betAmountValue,
					}));
				}

				if (authenticateData.round?.mode) {
					stateBet.update(state => ({
						...state,
						activeBetModeKey: authenticateData.round.mode,
					}));
				}

				stateRGS.setRoundActive(authenticateData.round.active || false);

				const betState = get(stateBet);
				console.log('[Auth] Active round detected:', {
					active: authenticateData.round.active,
					betAmount: betState.betAmount,
				});
			}

			stateRGS.setAuthenticated(true);
			stateRGS.updateCanSpin();

			console.log('[Auth] Authentication successful!');
		} catch (error) {
			console.error('[Auth] Authentication failed:', error);

			if (error instanceof Error && error.message.includes('sessionID is not in set in url parameters')) {
				console.warn('[Auth] Missing URL parameters. Starting in demo mode...');
				isDemoMode = true;
				setupDemoMode();
				return;
			}

			authError = error instanceof Error ? error.message : 'Authentication failed';
			stateRGS.setError(authError);
		}
	};

	onMount(async () => {
		setupAllEventListeners();
		await authenticate();
		authenticated = true;
	});

	onDestroy(() => {
		removeAllEventListeners();
	});
</script>

{#if authError}
	<div class="auth-error">
		<div class="error-container">
			<h2>Authentication Error</h2>
			<p class="error-message">{authError}</p>
			<div class="error-details">
				<p class="error-hint">This game requires the following URL parameters:</p>
				<ul>
					<li><code>sessionID</code> - Your session identifier</li>
					<li><code>rgs_url</code> - The RGS server URL</li>
				</ul>
				<p class="error-example">
					Example: <code>?sessionID=abc123&rgs_url=https://rgs.example.com</code>
				</p>
			</div>
			<button on:click={() => window.location.reload()}>Try Again</button>
		</div>
	</div>
{:else if authenticated}
	{#if isDemoMode}
		<div class="demo-banner">
			DEMO MODE - No RGS connection
		</div>
	{/if}
	<slot />
{:else}
	<div class="auth-loading">
		<div class="spinner"></div>
		<p>{isDemoMode ? 'Loading Demo Mode...' : 'Authenticating...'}</p>
	</div>
{/if}

<style>
	.auth-error {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10000;
		padding: 2rem;
	}

	.error-container {
		max-width: 600px;
		background: rgba(255, 255, 255, 0.05);
		border: 2px solid #ff4444;
		border-radius: 15px;
		padding: 3rem 2rem;
		text-align: center;
	}

	.error-container h2 {
		color: #ff4444;
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
	}

	.error-message {
		color: #fff;
		margin: 0 0 1.5rem 0;
		font-size: 1.1rem;
	}

	.error-details {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 8px;
		padding: 1.5rem;
		margin: 1.5rem 0;
		text-align: left;
	}

	.error-hint {
		color: #ffd700;
		margin: 0 0 1rem 0;
		font-weight: bold;
	}

	.error-details ul {
		margin: 0 0 1rem 0;
		padding-left: 1.5rem;
	}

	.error-details li {
		color: rgba(255, 255, 255, 0.9);
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	.error-example {
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.9rem;
		margin: 1rem 0 0 0;
		line-height: 1.6;
	}

	code {
		background: rgba(255, 215, 0, 0.1);
		color: #ffd700;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-family: 'Courier New', monospace;
		font-size: 0.9em;
	}

	.error-container button {
		padding: 0.8rem 2rem;
		background: #ffd700;
		color: #000;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
		margin-top: 1rem;
	}

	.error-container button:hover {
		background: #ffed4e;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(255, 215, 0, 0.4);
	}

	.demo-banner {
		position: fixed;
		top: 10px;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(255, 165, 0, 0.9);
		color: #000;
		padding: 0.5rem 1.5rem;
		border-radius: 8px;
		font-weight: bold;
		z-index: 10001;
		font-size: 0.9rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.auth-loading {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 10000;
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 4px solid rgba(255, 215, 0, 0.3);
		border-top-color: #ffd700;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.auth-loading p {
		color: #ffd700;
		font-size: 1.2rem;
	}

	@media (max-width: 600px) {
		.error-container {
			padding: 2rem 1.5rem;
		}

		.error-details {
			padding: 1rem;
		}

		.demo-banner {
			font-size: 0.8rem;
			padding: 0.4rem 1rem;
		}
	}
</style>

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

	const MOST_USED_BET_INDEXES = [0, 4, 9, 19, 29, 49, 99];

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
			<p class="error-message">Failed to connect to Stake Engine RGS</p>
			<div class="error-details">
				<p class="error-hint">This game requires Stake Engine RGS connection.</p>
				<p class="error-note">
					Please ensure this game is launched through Stake Engine platform with valid session parameters.
				</p>
				<p class="error-technical">Error: {authError}</p>
			</div>
			<button on:click={() => window.location.reload()}>Try Again</button>
		</div>
	</div>
{:else if authenticated}
	<slot />
{:else}
	<div class="auth-loading">
		<div class="spinner"></div>
		<p>Connecting to Stake Engine...</p>
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

	.error-note {
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.95rem;
		margin: 1rem 0;
		line-height: 1.6;
	}

	.error-technical {
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.85rem;
		margin: 1rem 0 0 0;
		font-family: 'Courier New', monospace;
		word-break: break-all;
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
	}
</style>

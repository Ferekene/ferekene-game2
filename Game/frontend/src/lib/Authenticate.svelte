<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { requestAuthenticate, API_AMOUNT_MULTIPLIER } from './rgsRequests';
	import { stateUrlDerived, isValidSession } from './stateUrl';
	import { stateBet } from './stateBet';
	import { stateConfig } from './stateConfig';
	import { stateRGS } from '../game/stateRGS';

	let authenticated = false;
	let authError: string | null = null;

	const MOST_USED_BET_INDEXES = [0, 4, 9, 19, 29, 49, 99];

	const authenticate = async () => {
		try {
			if (!isValidSession()) {
				throw new Error('Missing sessionID or rgs_url in URL parameters');
			}

			console.log('[Auth] Starting authentication...');
			console.log('[Auth] SessionID:', stateUrlDerived.sessionID());
			console.log('[Auth] RGS URL:', stateUrlDerived.rgsUrl());

			const authenticateData = await requestAuthenticate({
				rgsUrl: stateUrlDerived.rgsUrl(),
				sessionID: stateUrlDerived.sessionID(),
				language: stateUrlDerived.lang(),
			});

			if (authenticateData?.error) {
				throw new Error(authenticateData.error.message || 'Authentication failed');
			}

			console.log('[Auth] Response:', authenticateData);

			if (authenticateData?.balance) {
				stateBet.update(state => ({
					...state,
					currency: authenticateData.balance.currency,
					balanceAmount: authenticateData.balance.amount / API_AMOUNT_MULTIPLIER,
				}));

				const betState = get(stateBet);
				stateRGS.setBalance(betState.balanceAmount, betState.currency);

				console.log('[Auth] Balance set:', betState.balanceAmount, betState.currency);
			}

			if (authenticateData?.config) {
				const betAmountOptions = (authenticateData.config.betLevels || []).map(
					(level) => level / API_AMOUNT_MULTIPLIER,
				);
				const betMenuOptions = betAmountOptions.filter((_, index) =>
					MOST_USED_BET_INDEXES.includes(index),
				);

				stateConfig.update(state => ({
					...state,
					jurisdiction: authenticateData.config.jurisdiction,
					betAmountOptions,
					betMenuOptions,
				}));

				if (betAmountOptions.length > 0) {
					const defaultBet = authenticateData.config.defaultBetLevel
						? authenticateData.config.defaultBetLevel / API_AMOUNT_MULTIPLIER
						: betAmountOptions[0];

					stateBet.update(state => ({
						...state,
						betAmount: defaultBet,
						wageredBetAmount: defaultBet,
					}));

					stateRGS.setBetAmount(defaultBet);
					stateRGS.update(state => ({
						...state,
						availableBetLevels: betAmountOptions,
					}));
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
					const betAmountValue =
						authenticateData.round.amount > 0
							? authenticateData.round.amount / API_AMOUNT_MULTIPLIER
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
		await authenticate();
		authenticated = true;
	});
</script>

{#if authError}
	<div class="auth-error">
		<div class="error-container">
			<h2>🔒 Authentication Error</h2>
			<p>{authError}</p>
			<button on:click={() => window.location.reload()}>Try Again</button>
		</div>
	</div>
{:else if authenticated}
	<slot />
{:else}
	<div class="auth-loading">
		<div class="spinner"></div>
		<p>Authenticating...</p>
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
	}

	.error-container {
		max-width: 500px;
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

	.error-container p {
		color: #fff;
		margin: 0 0 2rem 0;
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
	}

	.error-container button:hover {
		background: #ffed4e;
		transform: translateY(-2px);
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
</style>

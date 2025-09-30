<script lang="ts">
	import { stateRGS } from '../game/stateRGS.svelte';
	import { gameEngine } from '../game/gameEngine';

	let { children } = $props();

	function handleRetry() {
		stateRGS.setError(null);
		window.location.reload();
	}

	function handleReload() {
		window.location.reload();
	}
</script>

{#if stateRGS.error}
	<div class="error-boundary">
		<div class="error-container">
			<div class="error-icon">⚠️</div>
			<h2>Oyun Yüklenemedi</h2>
			<p class="error-message">{stateRGS.error}</p>
			<div class="error-actions">
				<button class="btn-retry" onclick={handleRetry}>Tekrar Dene</button>
				<button class="btn-reload" onclick={handleReload}>Sayfayı Yenile</button>
			</div>
			<p class="error-hint">
				Sorun devam ederse, lütfen tarayıcı önbelleğinizi temizleyip tekrar deneyin.
			</p>
		</div>
	</div>
{:else}
	{@render children()}
{/if}

<style>
	.error-boundary {
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
		max-width: 500px;
		background: rgba(255, 255, 255, 0.05);
		border: 2px solid #ffd700;
		border-radius: 15px;
		padding: 3rem 2rem;
		text-align: center;
		box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
	}

	.error-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	h2 {
		color: #ffd700;
		margin: 0 0 1rem 0;
		font-size: 1.8rem;
	}

	.error-message {
		color: #fff;
		margin: 0 0 2rem 0;
		font-size: 1rem;
		line-height: 1.5;
	}

	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 1.5rem;
	}

	.btn-retry,
	.btn-reload {
		padding: 0.8rem 2rem;
		border: 2px solid #ffd700;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-retry {
		background: #ffd700;
		color: #1a1a2e;
	}

	.btn-retry:hover {
		background: #ffed4e;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(255, 215, 0, 0.4);
	}

	.btn-reload {
		background: rgba(255, 215, 0, 0.1);
		color: #ffd700;
	}

	.btn-reload:hover {
		background: rgba(255, 215, 0, 0.2);
		transform: translateY(-2px);
	}

	.error-hint {
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.85rem;
		margin: 0;
	}

	@media (max-width: 600px) {
		.error-container {
			padding: 2rem 1.5rem;
		}

		h2 {
			font-size: 1.5rem;
		}

		.error-actions {
			flex-direction: column;
		}

		.btn-retry,
		.btn-reload {
			width: 100%;
		}
	}
</style>

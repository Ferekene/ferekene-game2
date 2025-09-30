<script lang="ts">
	interface Props {
		progress: number;
		error?: string | null;
	}

	let { progress, error = null }: Props = $props();
</script>

<div class="loading-screen">
	<div class="loading-content">
		<div class="logo">
			<h1>Golden Fortune</h1>
		</div>

		{#if error}
			<div class="error">
				<p>Failed to load game</p>
				<p class="error-message">{error}</p>
				<button onclick={() => window.location.reload()}>Reload</button>
			</div>
		{:else}
			<div class="progress-container">
				<div class="progress-bar">
					<div class="progress-fill" style="width: {progress}%"></div>
				</div>
				<div class="progress-text">{Math.round(progress)}%</div>
			</div>

			<p class="loading-tip">Preparing your fortune...</p>
		{/if}
	</div>
</div>

<style>
	.loading-screen {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
		position: relative;
		overflow: hidden;
	}

	.loading-screen::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
		animation: rotate 20s linear infinite;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.loading-content {
		text-align: center;
		z-index: 1;
	}

	.logo h1 {
		font-size: 3rem;
		color: #ffd700;
		margin: 0 0 2rem 0;
		text-shadow: 0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3);
		animation: glow 2s ease-in-out infinite alternate;
	}

	@keyframes glow {
		from {
			text-shadow: 0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3);
		}
		to {
			text-shadow: 0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.5);
		}
	}

	.progress-container {
		width: 400px;
		max-width: 90vw;
		margin: 0 auto;
	}

	.progress-bar {
		width: 100%;
		height: 30px;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 15px;
		overflow: hidden;
		border: 2px solid #ffd700;
		box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
		transition: width 0.3s ease;
		box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
		animation: shimmer 2s linear infinite;
	}

	@keyframes shimmer {
		0% {
			background-position: -400px 0;
		}
		100% {
			background-position: 400px 0;
		}
	}

	.progress-text {
		margin-top: 1rem;
		font-size: 1.5rem;
		color: #ffd700;
		font-weight: bold;
	}

	.loading-tip {
		margin-top: 2rem;
		color: #ffffff;
		font-size: 1rem;
		opacity: 0.8;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
	}

	.error {
		color: #ff6b6b;
		padding: 2rem;
	}

	.error p {
		margin: 0.5rem 0;
	}

	.error-message {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.error button {
		margin-top: 1rem;
		padding: 0.75rem 2rem;
		background: #ffd700;
		color: #000;
		border: none;
		border-radius: 5px;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.error button:hover {
		background: #ffed4e;
		transform: scale(1.05);
	}
</style>

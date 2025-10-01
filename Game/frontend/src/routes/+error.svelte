<script lang="ts">
	import { page } from '$app/stores';

	$: error = $page.error;
	$: status = $page.status;

	function handleGoHome() {
		window.location.href = '/';
	}

	function handleReload() {
		window.location.reload();
	}
</script>

<div class="error-page">
	<div class="error-container">
		<div class="error-code">{status || 404}</div>
		<h1 class="error-title">
			{#if status === 404}
				Page Not Found
			{:else if status === 500}
				Internal Server Error
			{:else}
				Something Went Wrong
			{/if}
		</h1>
		<p class="error-message">
			{error?.message || 'An unexpected error occurred'}
		</p>
		<div class="error-actions">
			<button class="btn-primary" on:click={handleReload}>
				Reload Page
			</button>
			<button class="btn-secondary" on:click={handleGoHome}>
				Go to Home
			</button>
		</div>
	</div>
</div>

<style>
	.error-page {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		z-index: 10000;
	}

	.error-container {
		max-width: 600px;
		text-align: center;
		background: rgba(255, 255, 255, 0.05);
		border: 2px solid #ffd700;
		border-radius: 15px;
		padding: 3rem 2rem;
		box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
	}

	.error-code {
		font-size: 6rem;
		font-weight: bold;
		color: #ffd700;
		margin: 0;
		line-height: 1;
		text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
	}

	.error-title {
		font-size: 2rem;
		color: #fff;
		margin: 1rem 0;
		font-weight: bold;
	}

	.error-message {
		color: rgba(255, 255, 255, 0.8);
		font-size: 1.1rem;
		margin: 1.5rem 0 2rem 0;
		line-height: 1.6;
	}

	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn-primary,
	.btn-secondary {
		padding: 1rem 2rem;
		border: 2px solid #ffd700;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-primary {
		background: #ffd700;
		color: #1a1a2e;
	}

	.btn-primary:hover {
		background: #ffed4e;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(255, 215, 0, 0.5);
	}

	.btn-secondary {
		background: rgba(255, 215, 0, 0.1);
		color: #ffd700;
	}

	.btn-secondary:hover {
		background: rgba(255, 215, 0, 0.2);
		transform: translateY(-2px);
	}

	@media (max-width: 600px) {
		.error-code {
			font-size: 4rem;
		}

		.error-title {
			font-size: 1.5rem;
		}

		.error-message {
			font-size: 1rem;
		}

		.error-actions {
			flex-direction: column;
		}

		.btn-primary,
		.btn-secondary {
			width: 100%;
		}
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		win: number;
	}

	let { win }: Props = $props();
	let displayWin = $state(0);
	let previousWin = 0;

	$effect(() => {
		if (win !== previousWin) {
			animateWinCount(previousWin, win);
			previousWin = win;
		}
	});

	function animateWinCount(from: number, to: number) {
		const duration = 1000;
		const startTime = performance.now();

		function update() {
			const elapsed = performance.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			displayWin = from + (to - from) * easeOutQuad(progress);

			if (progress < 1) {
				requestAnimationFrame(update);
			} else {
				displayWin = to;
			}
		}

		update();
	}

	function easeOutQuad(t: number): number {
		return t * (2 - t);
	}

	function formatCurrency(amount: number): string {
		return `$${amount.toFixed(2)}`;
	}
</script>

<div class="win-panel" class:has-win={win > 0}>
	<div class="panel-label">WIN</div>
	<div class="panel-value">{formatCurrency(displayWin)}</div>
	{#if win > 0}
		<div class="win-glow"></div>
	{/if}
</div>

<style>
	.win-panel {
		padding: 1rem 2rem;
		background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(26, 26, 46, 0.8) 100%);
		border: 2px solid #ffd700;
		border-radius: 10px;
		text-align: center;
		min-width: 150px;
		position: relative;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.win-panel.has-win {
		border-color: #ffed4e;
		box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
		animation: winPulse 1s ease-in-out infinite;
	}

	@keyframes winPulse {
		0%,
		100% {
			box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
		}
		50% {
			box-shadow: 0 0 50px rgba(255, 215, 0, 0.9);
		}
	}

	.panel-label {
		font-size: 0.8rem;
		color: #ffd700;
		opacity: 0.8;
		margin-bottom: 0.3rem;
		letter-spacing: 1px;
	}

	.panel-value {
		font-size: 1.5rem;
		color: #fff;
		font-weight: bold;
		text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
	}

	.win-panel.has-win .panel-value {
		color: #ffd700;
		text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
		animation: textGlow 1s ease-in-out infinite;
	}

	@keyframes textGlow {
		0%,
		100% {
			text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
		}
		50% {
			text-shadow: 0 0 30px rgba(255, 215, 0, 1);
		}
	}

	.win-glow {
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
		animation: rotate 3s linear infinite;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>

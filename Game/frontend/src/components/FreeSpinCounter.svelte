<script lang="ts">
	interface Props {
		current: number;
		total: number;
	}

	let { current, total }: Props = $props();
</script>

<div class="freespin-counter">
	<div class="counter-content">
		<div class="counter-label">FREE SPINS</div>
		<div class="counter-value">
			<span class="current">{current}</span>
			<span class="separator">/</span>
			<span class="total">{total}</span>
		</div>
	</div>
	<div class="counter-glow"></div>
</div>

<style>
	.freespin-counter {
		position: absolute;
		top: 50%;
		right: 2rem;
		transform: translateY(-50%);
		padding: 1.5rem 2rem;
		background: linear-gradient(135deg, rgba(138, 43, 226, 0.9) 0%, rgba(75, 0, 130, 0.9) 100%);
		border: 3px solid #ffd700;
		border-radius: 15px;
		box-shadow: 0 0 40px rgba(138, 43, 226, 0.6);
		overflow: hidden;
		position: relative;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(-50%) translateX(0);
		}
		50% {
			transform: translateY(-50%) translateX(-10px);
		}
	}

	.counter-content {
		position: relative;
		z-index: 1;
		text-align: center;
	}

	.counter-label {
		font-size: 0.9rem;
		color: #ffd700;
		font-weight: bold;
		letter-spacing: 2px;
		margin-bottom: 0.5rem;
		text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
	}

	.counter-value {
		font-size: 2.5rem;
		color: #fff;
		font-weight: bold;
		text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
	}

	.current {
		color: #ffd700;
		text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	.separator {
		opacity: 0.6;
		margin: 0 0.3rem;
	}

	.total {
		opacity: 0.8;
	}

	.counter-glow {
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
		animation: rotate 4s linear infinite;
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

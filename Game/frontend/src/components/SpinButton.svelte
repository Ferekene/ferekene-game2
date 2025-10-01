<script lang="ts">
	export let disabled: boolean = false;
	export let onclick: (() => void) | undefined = undefined;

	let isPressed = false;

	function handleMouseDown() {
		isPressed = true;
	}

	function handleMouseUp() {
		isPressed = false;
	}

	function handleMouseLeave() {
		isPressed = false;
	}
</script>

<button
	class="spin-button"
	class:disabled
	class:pressed={isPressed}
	{disabled}
	on:click={onclick}
	on:mousedown={handleMouseDown}
	on:mouseup={handleMouseUp}
	on:mouseleave={handleMouseLeave}
>
	<div class="button-inner">
		<div class="button-glow"></div>
		<span class="button-text">SPIN</span>
	</div>
</button>

<style>
	.spin-button {
		width: 120px;
		height: 120px;
		background: radial-gradient(circle, #ffd700 0%, #daa520 100%);
		border: 4px solid #fff;
		border-radius: 50%;
		cursor: pointer;
		position: relative;
		transition: all 0.3s ease;
		box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3);
	}

	.spin-button:hover:not(.disabled) {
		transform: scale(1.1);
		box-shadow: 0 0 50px rgba(255, 215, 0, 0.9), inset 0 0 30px rgba(255, 255, 255, 0.5);
	}

	.spin-button.pressed:not(.disabled) {
		transform: scale(0.95);
		box-shadow: 0 0 20px rgba(255, 215, 0, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.3);
	}

	.spin-button.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		animation: none;
	}

	.button-inner {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.button-glow {
		position: absolute;
		top: 10%;
		left: 10%;
		right: 10%;
		bottom: 10%;
		background: radial-gradient(
			circle,
			rgba(255, 255, 255, 0.4) 0%,
			transparent 70%
		);
		border-radius: 50%;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.6;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	.button-text {
		position: relative;
		z-index: 1;
		font-size: 1.5rem;
		font-weight: bold;
		color: #1a1a2e;
		text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);
		letter-spacing: 2px;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import LoadingScreen from './LoadingScreen.svelte';
	import GameCanvas from './GameCanvas.svelte';
	import GameUI from './GameUI.svelte';
	import { assetLoader } from '../game/assetLoader';
	import { soundManager } from '../game/soundManager';

	let isLoading = $state(true);
	let loadProgress = $state(0);
	let loadError = $state<string | null>(null);

	onMount(async () => {
		try {
			// Preload all visual assets
			await assetLoader.preloadAll((progress) => {
				loadProgress = progress;
			});

			// Preload all sound assets
			await soundManager.preloadAll();

			// Small delay to show 100%
			await new Promise(resolve => setTimeout(resolve, 500));

			isLoading = false;

			// Start main background music
			soundManager.playMusic('bgm_main', 2000);
		} catch (error) {
			console.error('Failed to load game assets', error);
			loadError = error instanceof Error ? error.message : 'Failed to load game';
		}
	});
</script>

<div class="game-container">
	{#if isLoading}
		<LoadingScreen progress={loadProgress} error={loadError} />
	{:else}
		<GameCanvas />
		<GameUI />
	{/if}
</div>

<style>
	.game-container {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: relative;
		background: #000;
		font-family: 'Arial', sans-serif;
	}
</style>

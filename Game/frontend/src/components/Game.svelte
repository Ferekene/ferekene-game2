<script lang="ts">
	import { onMount } from 'svelte';
	import LoadingScreen from './LoadingScreen.svelte';
	import GameCanvas from './GameCanvas.svelte';
	import GameUI from './GameUI.svelte';
	import ErrorBoundary from './ErrorBoundary.svelte';
	import { assetLoader } from '../game/assetLoader';
	import { soundManager } from '../game/soundManager';
	import { gameEngine } from '../game/gameEngine';
	import { stateRGS } from '../game/stateRGS.svelte';

	let isLoading = $state(true);
	let loadProgress = $state(0);
	let loadError = $state<string | null>(null);

	onMount(async () => {
		try {
			console.log('[Game] Starting initialization...');

			// Initialize RGS Client first
			loadProgress = 10;
			await gameEngine.initialize();
			console.log('[Game] RGS initialized');

			// Preload all visual assets
			loadProgress = 20;
			await assetLoader.preloadAll((progress) => {
				loadProgress = 20 + (progress * 0.6);
			});
			console.log('[Game] Visual assets loaded');

			// Preload all sound assets
			loadProgress = 80;
			await soundManager.preloadAll();
			console.log('[Game] Sound assets loaded');

			// Small delay to show 100%
			loadProgress = 100;
			await new Promise(resolve => setTimeout(resolve, 500));

			isLoading = false;

			// Start main background music
			soundManager.playMusic('bgm_main', 2000);

			console.log('[Game] Initialization complete');
		} catch (error) {
			console.error('[Game] Failed to load game', error);
			loadError = error instanceof Error ? error.message : 'Failed to load game';
			stateRGS.setError(loadError);
		}
	});
</script>

<ErrorBoundary>
	<div class="game-container">
		{#if isLoading}
			<LoadingScreen progress={loadProgress} error={loadError} />
		{:else}
			<GameCanvas />
			<GameUI />
		{/if}
	</div>
</ErrorBoundary>

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

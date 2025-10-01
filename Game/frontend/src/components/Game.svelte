<script lang="ts">
	import { onMount } from 'svelte';
	import LoadingScreen from './LoadingScreen.svelte';
	import GameCanvas from './GameCanvas.svelte';
	import GameUI from './GameUI.svelte';
	import ErrorBoundary from './ErrorBoundary.svelte';
	import { assetLoader } from '../game/assetLoader';
	import { soundManager } from '../game/soundManager';
	import { gameEngine } from '../game/gameEngine';
	import { stateRGS } from '../game/stateRGS';

	let isLoading = true;
	let loadProgress = 0;
	let loadError: string | null = null;

	onMount(async () => {
		console.log('[Game] Starting initialization...');

		// Initialize game engine (non-blocking on errors)
		loadProgress = 10;
		try {
			await gameEngine.initialize();
			console.log('[Game] Game engine initialized');
		} catch (error) {
			console.warn('[Game] Game engine initialization warning:', error);
			// Continue anyway - Supabase errors shouldn't block game
		}

		// Preload all visual assets (non-blocking on individual failures)
		loadProgress = 20;
		try {
			await assetLoader.preloadAll((progress) => {
				loadProgress = 20 + progress * 60;
			});
			console.log('[Game] Visual assets loaded');
		} catch (error) {
			console.error('[Game] Asset loading error:', error);
			loadError = 'Some assets failed to load. Game may have visual issues.';
			// Continue anyway
		}

		// Preload all sound assets (non-blocking on failures)
		loadProgress = 80;
		try {
			await soundManager.preloadAll();
			console.log('[Game] Sound assets loaded');
		} catch (error) {
			console.warn('[Game] Sound loading warning:', error);
			// Game can run without sound
		}

		// Small delay to show 100%
		loadProgress = 100;
		await new Promise((resolve) => setTimeout(resolve, 300));

		isLoading = false;

		// Start main background music (safe to fail)
		soundManager.playMusic('bgm_main', 2000);

		console.log('[Game] Initialization complete - Game ready!');
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

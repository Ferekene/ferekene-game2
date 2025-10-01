/**
 * Asset loading and preloading system for Golden Fortune Slots
 */

import { Assets } from 'pixi.js';
import type { AssetDefinition } from './assets';
import { ALL_ASSETS } from './assets';

export class AssetLoader {
	private loadedAssets = new Set<string>();
	private loadProgress = $state(0);
	private isLoading = $state(false);
	private loadError = $state<string | null>(null);

	get progress() {
		return this.loadProgress;
	}

	get loading() {
		return this.isLoading;
	}

	get error() {
		return this.loadError;
	}

	async preloadAll(onProgress?: (progress: number) => void): Promise<void> {
		this.isLoading = true;
		this.loadProgress = 0;
		this.loadError = null;

		try {
			const imageAssets = ALL_ASSETS.filter(a => a.type === 'image');
			const totalAssets = imageAssets.length;
			let loadedCount = 0;
			let failedCount = 0;

			console.log(`[AssetLoader] Loading ${totalAssets} visual assets...`);

			// Add all assets to PixiJS Assets system
			imageAssets.forEach(asset => {
				Assets.add({ alias: asset.name, src: asset.url });
			});

			// Load with progress tracking
			const promises = imageAssets.map(async asset => {
				try {
					await Assets.load(asset.name);
					this.loadedAssets.add(asset.name);
					loadedCount++;
					this.loadProgress = (loadedCount / totalAssets) * 100;
					onProgress?.(this.loadProgress / 100);
				} catch (error) {
					console.warn(`[AssetLoader] Failed to load: ${asset.name}`, error);
					failedCount++;
					loadedCount++; // Count as processed
					this.loadProgress = (loadedCount / totalAssets) * 100;
					onProgress?.(this.loadProgress / 100);
				}
			});

			await Promise.all(promises);

			console.log(`[AssetLoader] Asset loading complete: ${loadedCount - failedCount} loaded, ${failedCount} failed`);

			if (failedCount > 0) {
				console.warn(`[AssetLoader] Some assets failed to load (${failedCount}/${totalAssets}) - game will continue with available assets`);
			}

			// Note: Sound assets are loaded separately by the sound manager
			this.loadProgress = 100;
			this.isLoading = false;
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'Failed to load assets';
			console.error('[AssetLoader] Critical error during asset loading:', errorMsg);
			this.loadError = errorMsg;
			this.isLoading = false;
			// Don't throw - allow game to continue
		}
	}

	async loadAsset(asset: AssetDefinition): Promise<void> {
		if (this.loadedAssets.has(asset.name)) {
			return;
		}

		try {
			if (asset.type === 'image') {
				Assets.add({ alias: asset.name, src: asset.url });
				await Assets.load(asset.name);
				this.loadedAssets.add(asset.name);
			}
		} catch (error) {
			console.error(`Failed to load asset: ${asset.name}`, error);
			throw error;
		}
	}

	isAssetLoaded(name: string): boolean {
		return this.loadedAssets.has(name);
	}

	getTexture(name: string) {
		try {
			return Assets.get(name);
		} catch (error) {
			console.error(`Failed to get texture: ${name}`, error);
			return null;
		}
	}

	reset() {
		this.loadedAssets.clear();
		this.loadProgress = 0;
		this.isLoading = false;
		this.loadError = null;
	}
}

export const assetLoader = new AssetLoader();

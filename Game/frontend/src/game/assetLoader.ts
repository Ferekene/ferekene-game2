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
					onProgress?.(this.loadProgress);
				} catch (error) {
					console.error(`Failed to load asset: ${asset.name}`, error);
					// Continue loading other assets even if one fails
				}
			});

			await Promise.all(promises);

			// Note: Sound assets are loaded separately by the sound manager
			this.loadProgress = 100;
			this.isLoading = false;
		} catch (error) {
			this.loadError = error instanceof Error ? error.message : 'Failed to load assets';
			this.isLoading = false;
			throw error;
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

/**
 * Sound management system using Howler.js for Golden Fortune Slots
 */

import { Howl, Howler } from 'howler';
import { SOUND_MUSIC, SOUND_SFX } from './assets';

export type SoundCategory = 'music' | 'sfx' | 'master';

interface SoundInstance {
	howl: Howl;
	category: SoundCategory;
}

export class SoundManager {
	private sounds = new Map<string, SoundInstance>();
	private currentMusic: string | null = null;
	private volumes = {
		master: 1.0,
		music: 0.7,
		sfx: 0.8,
	};
	private muted = {
		master: false,
		music: false,
		sfx: false,
	};

	constructor() {
		this.loadPreferences();
	}

	async preloadAll(): Promise<void> {
		const allSounds = [...SOUND_MUSIC, ...SOUND_SFX];
		let loadedCount = 0;
		let failedCount = 0;

		console.log(`[SoundManager] Loading ${allSounds.length} audio files...`);

		const promises = allSounds.map(sound => {
			return new Promise<void>((resolve) => {
				const category: SoundCategory = SOUND_MUSIC.includes(sound) ? 'music' : 'sfx';

				// Set timeout to prevent hanging
				const timeout = setTimeout(() => {
					console.warn(`[SoundManager] Timeout loading: ${sound.name}`);
					failedCount++;
					resolve();
				}, 3000);

				const howl = new Howl({
					src: [sound.url],
					loop: category === 'music',
					volume: this.getEffectiveVolume(category),
					preload: true,
					onload: () => {
						clearTimeout(timeout);
						loadedCount++;
						resolve();
					},
					onloaderror: (id, error) => {
						clearTimeout(timeout);
						console.warn(`[SoundManager] Failed to load: ${sound.name}`, error);
						failedCount++;
						resolve(); // Continue even if one fails
					},
				});

				this.sounds.set(sound.name, { howl, category });
			});
		});

		await Promise.all(promises);

		console.log(`[SoundManager] Audio loading complete: ${loadedCount} loaded, ${failedCount} failed`);

		if (failedCount === allSounds.length) {
			console.warn('[SoundManager] All audio files failed to load - game will run without sound');
		} else if (failedCount > 0) {
			console.warn(`[SoundManager] Some audio files failed to load (${failedCount}/${allSounds.length}) - game will continue with available sounds`);
		}
	}

	playOnce(name: string, volume: number = 1.0): void {
		const sound = this.sounds.get(name);
		if (!sound) {
			return; // Silently skip if sound not loaded
		}

		if (this.isMuted('sfx') || this.isMuted('master')) {
			return;
		}

		try {
			const effectiveVolume = this.getEffectiveVolume('sfx') * volume;
			sound.howl.volume(effectiveVolume);
			sound.howl.play();
		} catch (error) {
			console.warn(`[SoundManager] Failed to play sound: ${name}`, error);
		}
	}

	playMusic(name: string, fadeIn: number = 1000): void {
		if (this.currentMusic === name) {
			return;
		}

		// Fade out current music
		if (this.currentMusic) {
			this.stopMusic(1000);
		}

		const sound = this.sounds.get(name);
		if (!sound) {
			return; // Silently skip if music not loaded
		}

		if (this.isMuted('music') || this.isMuted('master')) {
			this.currentMusic = name;
			return;
		}

		try {
			this.currentMusic = name;
			sound.howl.volume(0);
			sound.howl.play();
			sound.howl.fade(0, this.getEffectiveVolume('music'), fadeIn);
		} catch (error) {
			console.warn(`[SoundManager] Failed to play music: ${name}`, error);
		}
	}

	stopMusic(fadeOut: number = 1000): void {
		if (!this.currentMusic) {
			return;
		}

		const sound = this.sounds.get(this.currentMusic);
		if (sound) {
			sound.howl.fade(sound.howl.volume(), 0, fadeOut);
			setTimeout(() => {
				sound.howl.stop();
			}, fadeOut);
		}

		this.currentMusic = null;
	}

	playLoop(name: string, volume: number = 1.0): void {
		const sound = this.sounds.get(name);
		if (!sound) {
			console.warn(`Sound not found: ${name}`);
			return;
		}

		if (this.isMuted('sfx') || this.isMuted('master')) {
			return;
		}

		const effectiveVolume = this.getEffectiveVolume('sfx') * volume;
		sound.howl.volume(effectiveVolume);
		sound.howl.loop(true);
		sound.howl.play();
	}

	stop(name: string): void {
		const sound = this.sounds.get(name);
		if (sound) {
			sound.howl.stop();
		}
	}

	stopAll(): void {
		this.sounds.forEach(sound => sound.howl.stop());
		this.currentMusic = null;
	}

	setVolume(category: SoundCategory, volume: number): void {
		this.volumes[category] = Math.max(0, Math.min(1, volume));
		this.updateAllVolumes();
		this.savePreferences();
	}

	getVolume(category: SoundCategory): number {
		return this.volumes[category];
	}

	setMuted(category: SoundCategory, muted: boolean): void {
		this.muted[category] = muted;
		this.updateAllVolumes();
		this.savePreferences();
	}

	isMuted(category: SoundCategory): boolean {
		return this.muted[category];
	}

	toggleMute(category: SoundCategory): void {
		this.setMuted(category, !this.muted[category]);
	}

	private getEffectiveVolume(category: 'music' | 'sfx'): number {
		if (this.muted.master || this.muted[category]) {
			return 0;
		}
		return this.volumes.master * this.volumes[category];
	}

	private updateAllVolumes(): void {
		this.sounds.forEach((sound, name) => {
			const effectiveVolume = this.getEffectiveVolume(sound.category);
			sound.howl.volume(effectiveVolume);
		});
	}

	private savePreferences(): void {
		try {
			localStorage.setItem('sound_volumes', JSON.stringify(this.volumes));
			localStorage.setItem('sound_muted', JSON.stringify(this.muted));
		} catch (error) {
			console.error('Failed to save sound preferences', error);
		}
	}

	private loadPreferences(): void {
		try {
			const volumesStr = localStorage.getItem('sound_volumes');
			const mutedStr = localStorage.getItem('sound_muted');

			if (volumesStr) {
				this.volumes = { ...this.volumes, ...JSON.parse(volumesStr) };
			}

			if (mutedStr) {
				this.muted = { ...this.muted, ...JSON.parse(mutedStr) };
			}
		} catch (error) {
			console.error('Failed to load sound preferences', error);
		}
	}
}

export const soundManager = new SoundManager();

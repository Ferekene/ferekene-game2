/**
 * Game configuration state
 * Stores jurisdiction settings and bet level options from RGS
 * Converted to Svelte 3 writable stores
 */

import { writable } from 'svelte/store';

export interface Jurisdiction {
	socialCasino: boolean;
	disabledFullscreen: boolean;
	disabledTurbo: boolean;
	disabledSuperTurbo: boolean;
	disabledAutoplay: boolean;
	disabledSlamstop: boolean;
	disabledSpacebar: boolean;
	disabledBuyFeature: boolean;
	displayNetPosition: boolean;
	displayRTP: boolean;
	displaySessionTimer: boolean;
	minimumRoundDuration: number;
}

export interface ConfigState {
	jurisdiction: Jurisdiction | null;
	betAmountOptions: number[];
	betMenuOptions: number[];
}

function createConfigState() {
	const { subscribe, set, update } = writable<ConfigState>({
		jurisdiction: null,
		betAmountOptions: [0.1, 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100],
		betMenuOptions: [0.1, 0.5, 1, 5, 10, 50, 100],
	});

	return {
		subscribe,
		set,
		update,
	};
}

export const stateConfig = createConfigState();

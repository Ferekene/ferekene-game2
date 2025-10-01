/**
 * Game configuration state
 * Stores jurisdiction settings and bet level options from RGS
 */

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

export const stateConfig = $state({
	jurisdiction: null as Jurisdiction | null,
	betAmountOptions: [0.1, 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100] as number[],
	betMenuOptions: [0.1, 0.5, 1, 5, 10, 50, 100] as number[],
});

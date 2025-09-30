/**
 * Game configuration for Golden Fortune Slots frontend
 */

export const GAME_CONFIG = {
	name: 'Golden Fortune',
	version: '1.0.0',
	reels: 5,
	rows: 3,
	paylines: 20,

	symbols: {
		high: ['WILD', 'GOLD', 'GEM', 'COIN', 'RING'],
		low: ['ACE', 'KING', 'QUEEN', 'JACK', 'TEN'],
		special: ['SCATTER'],
	},

	symbolOrder: [
		'WILD',
		'GOLD',
		'GEM',
		'COIN',
		'RING',
		'ACE',
		'KING',
		'QUEEN',
		'JACK',
		'TEN',
		'SCATTER',
	],

	animations: {
		spinDuration: 1500,
		symbolAnimDuration: 500,
		winDisplayDuration: 2000,
	},

	sounds: {
		bgm_main: 'bgm_main',
		bgm_freespin: 'bgm_freespin',
		sfx_spin: 'sfx_spin',
		sfx_stop: 'sfx_stop',
		sfx_win_small: 'sfx_win_small',
		sfx_win_medium: 'sfx_win_medium',
		sfx_win_big: 'sfx_win_big',
		sfx_win_max: 'sfx_win_max',
		sfx_button: 'sfx_button',
	},
} as const;

export type SymbolName = (typeof GAME_CONFIG.symbols.high)[number] |
	(typeof GAME_CONFIG.symbols.low)[number] |
	(typeof GAME_CONFIG.symbols.special)[number];

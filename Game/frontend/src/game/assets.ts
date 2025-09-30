/**
 * Asset definitions and management for Golden Fortune Slots
 */

export interface AssetDefinition {
	name: string;
	url: string;
	type: 'image' | 'sound' | 'sprite' | 'font';
}

export const SYMBOL_ASSETS: AssetDefinition[] = [
	// High value symbols
	{ name: 'symbol_wild', url: '/images/symbols/wild.svg', type: 'image' },
	{ name: 'symbol_wild_win', url: '/images/symbols/wild_win.svg', type: 'image' },
	{ name: 'symbol_gold', url: '/images/symbols/gold.svg', type: 'image' },
	{ name: 'symbol_gold_win', url: '/images/symbols/gold_win.svg', type: 'image' },
	{ name: 'symbol_gem', url: '/images/symbols/gem.svg', type: 'image' },
	{ name: 'symbol_gem_win', url: '/images/symbols/gem_win.svg', type: 'image' },
	{ name: 'symbol_coin', url: '/images/symbols/coin.svg', type: 'image' },
	{ name: 'symbol_coin_win', url: '/images/symbols/coin_win.svg', type: 'image' },
	{ name: 'symbol_ring', url: '/images/symbols/ring.svg', type: 'image' },
	{ name: 'symbol_ring_win', url: '/images/symbols/ring_win.svg', type: 'image' },

	// Low value symbols
	{ name: 'symbol_ace', url: '/images/symbols/ace.svg', type: 'image' },
	{ name: 'symbol_ace_win', url: '/images/symbols/ace_win.svg', type: 'image' },
	{ name: 'symbol_king', url: '/images/symbols/king.svg', type: 'image' },
	{ name: 'symbol_king_win', url: '/images/symbols/king_win.svg', type: 'image' },
	{ name: 'symbol_queen', url: '/images/symbols/queen.svg', type: 'image' },
	{ name: 'symbol_queen_win', url: '/images/symbols/queen_win.svg', type: 'image' },
	{ name: 'symbol_jack', url: '/images/symbols/jack.svg', type: 'image' },
	{ name: 'symbol_jack_win', url: '/images/symbols/jack_win.svg', type: 'image' },
	{ name: 'symbol_ten', url: '/images/symbols/ten.svg', type: 'image' },
	{ name: 'symbol_ten_win', url: '/images/symbols/ten_win.svg', type: 'image' },

	// Special symbols
	{ name: 'symbol_scatter', url: '/images/symbols/scatter.svg', type: 'image' },
	{ name: 'symbol_scatter_win', url: '/images/symbols/scatter_win.svg', type: 'image' },

	// Blurred versions for spinning
	{ name: 'symbol_wild_blur', url: '/images/symbols/wild_blur.svg', type: 'image' },
	{ name: 'symbol_gold_blur', url: '/images/symbols/gold_blur.svg', type: 'image' },
	{ name: 'symbol_gem_blur', url: '/images/symbols/gem_blur.svg', type: 'image' },
	{ name: 'symbol_coin_blur', url: '/images/symbols/coin_blur.svg', type: 'image' },
	{ name: 'symbol_ring_blur', url: '/images/symbols/ring_blur.svg', type: 'image' },
	{ name: 'symbol_ace_blur', url: '/images/symbols/ace_blur.svg', type: 'image' },
	{ name: 'symbol_king_blur', url: '/images/symbols/king_blur.svg', type: 'image' },
	{ name: 'symbol_queen_blur', url: '/images/symbols/queen_blur.svg', type: 'image' },
	{ name: 'symbol_jack_blur', url: '/images/symbols/jack_blur.svg', type: 'image' },
	{ name: 'symbol_ten_blur', url: '/images/symbols/ten_blur.svg', type: 'image' },
	{ name: 'symbol_scatter_blur', url: '/images/symbols/scatter_blur.svg', type: 'image' },
];

export const UI_ASSETS: AssetDefinition[] = [
	// Buttons
	{ name: 'btn_spin', url: '/images/ui/btn_spin.svg', type: 'image' },
	{ name: 'btn_spin_hover', url: '/images/ui/btn_spin_hover.svg', type: 'image' },
	{ name: 'btn_spin_pressed', url: '/images/ui/btn_spin_pressed.svg', type: 'image' },
	{ name: 'btn_spin_disabled', url: '/images/ui/btn_spin_disabled.svg', type: 'image' },

	// Panels
	{ name: 'panel_balance', url: '/images/ui/panel_balance.svg', type: 'image' },
	{ name: 'panel_bet', url: '/images/ui/panel_bet.svg', type: 'image' },
	{ name: 'panel_win', url: '/images/ui/panel_win.svg', type: 'image' },

	// Logo and branding
	{ name: 'logo', url: '/images/ui/logo.svg', type: 'image' },
];

export const BACKGROUND_ASSETS: AssetDefinition[] = [
	{ name: 'bg_main', url: '/images/backgrounds/main.svg', type: 'image' },
	{ name: 'bg_freespin', url: '/images/backgrounds/freespin.svg', type: 'image' },
	{ name: 'reel_frame', url: '/images/backgrounds/reel_frame.svg', type: 'image' },
	{ name: 'reel_bg', url: '/images/backgrounds/reel_bg.svg', type: 'image' },
];

export const PARTICLE_ASSETS: AssetDefinition[] = [
	{ name: 'particle_coin', url: '/images/particles/coin.svg', type: 'image' },
	{ name: 'particle_sparkle', url: '/images/particles/sparkle.svg', type: 'image' },
	{ name: 'particle_star', url: '/images/particles/star.svg', type: 'image' },
	{ name: 'particle_glow', url: '/images/particles/glow.svg', type: 'image' },
];

export const EFFECT_ASSETS: AssetDefinition[] = [];

export const SOUND_MUSIC: AssetDefinition[] = [
	{ name: 'bgm_main', url: '/sounds/music/main_theme.mp3', type: 'sound' },
	{ name: 'bgm_freespin', url: '/sounds/music/freespin_theme.mp3', type: 'sound' },
	{ name: 'bgm_bigwin', url: '/sounds/music/bigwin_celebration.mp3', type: 'sound' },
];

export const SOUND_SFX: AssetDefinition[] = [
	{ name: 'sfx_spin', url: '/sounds/sfx/spin.mp3', type: 'sound' },
	{ name: 'sfx_stop', url: '/sounds/sfx/stop.mp3', type: 'sound' },
	{ name: 'sfx_button', url: '/sounds/sfx/button_click.mp3', type: 'sound' },
	{ name: 'sfx_win_small', url: '/sounds/sfx/win_small.mp3', type: 'sound' },
	{ name: 'sfx_win_medium', url: '/sounds/sfx/win_medium.mp3', type: 'sound' },
	{ name: 'sfx_win_big', url: '/sounds/sfx/win_big.mp3', type: 'sound' },
	{ name: 'sfx_win_max', url: '/sounds/sfx/win_max.mp3', type: 'sound' },
	{ name: 'sfx_scatter', url: '/sounds/sfx/scatter_land.mp3', type: 'sound' },
	{ name: 'sfx_anticipation', url: '/sounds/sfx/anticipation.mp3', type: 'sound' },
	{ name: 'sfx_freespin_trigger', url: '/sounds/sfx/freespin_trigger.mp3', type: 'sound' },
	{ name: 'sfx_coin_drop', url: '/sounds/sfx/coin_drop.mp3', type: 'sound' },
	{ name: 'sfx_wild_substitute', url: '/sounds/sfx/wild_substitute.mp3', type: 'sound' },
];

export const ALL_ASSETS: AssetDefinition[] = [
	...SYMBOL_ASSETS,
	...UI_ASSETS,
	...BACKGROUND_ASSETS,
	...PARTICLE_ASSETS,
	...EFFECT_ASSETS,
	...SOUND_MUSIC,
	...SOUND_SFX,
];

export function getAssetUrl(name: string): string {
	const asset = ALL_ASSETS.find(a => a.name === name);
	return asset?.url || '';
}

export function getSymbolAssetName(symbolName: string, state: 'normal' | 'win' | 'blur' = 'normal'): string {
	const baseName = symbolName.toLowerCase();
	const suffix = state === 'normal' ? '' : `_${state}`;
	return `symbol_${baseName}${suffix}`;
}

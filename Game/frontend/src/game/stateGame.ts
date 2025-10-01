/**
 * Game state management for Golden Fortune Slots
 * Converted to Svelte 3 writable stores
 */

import { writable, derived } from 'svelte/store';
import type { Symbol } from './typesBookEvent';
import { GAME_CONFIG } from './config';

export interface GameState {
	board: Symbol[][];
	gameType: 'basegame' | 'freegame';
	currentWin: number;
	totalWin: number;
	freeSpinCurrent: number;
	freeSpinTotal: number;
	isSpinning: boolean;
}

function createGameState() {
	const initialBoard = Array.from({ length: GAME_CONFIG.reels }, () =>
		Array.from({ length: GAME_CONFIG.rows }, () => ({ name: 'TEN' }))
	);

	const { subscribe, set, update } = writable<GameState>({
		board: initialBoard,
		gameType: 'basegame',
		currentWin: 0,
		totalWin: 0,
		freeSpinCurrent: 0,
		freeSpinTotal: 0,
		isSpinning: false,
	});

	return {
		subscribe,
		resetBoard: () =>
			update((state) => ({
				...state,
				board: Array.from({ length: GAME_CONFIG.reels }, () =>
					Array.from({ length: GAME_CONFIG.rows }, () => ({ name: 'TEN' }))
				),
			})),
		setBoard: (board: Symbol[][]) =>
			update((state) => ({ ...state, board })),
		setGameType: (gameType: 'basegame' | 'freegame') =>
			update((state) => ({ ...state, gameType })),
		setCurrentWin: (amount: number) =>
			update((state) => ({ ...state, currentWin: amount })),
		setTotalWin: (amount: number) =>
			update((state) => ({ ...state, totalWin: amount })),
		setFreeSpins: (current: number, total: number) =>
			update((state) => ({
				...state,
				freeSpinCurrent: current,
				freeSpinTotal: total,
			})),
		setSpinning: (spinning: boolean) =>
			update((state) => ({ ...state, isSpinning: spinning })),
		reset: () =>
			set({
				board: initialBoard,
				gameType: 'basegame',
				currentWin: 0,
				totalWin: 0,
				freeSpinCurrent: 0,
				freeSpinTotal: 0,
				isSpinning: false,
			}),
	};
}

export const stateGame = createGameState();

export const stateGameDerived = {
	isInFreeSpin: derived(stateGame, ($state) => $state.gameType === 'freegame'),
	hasWin: derived(stateGame, ($state) => $state.currentWin > 0),
	canSpin: derived(stateGame, ($state) => !$state.isSpinning),
};

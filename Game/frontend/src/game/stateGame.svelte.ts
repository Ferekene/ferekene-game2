/**
 * Game state management for Golden Fortune Slots
 */

import type { Symbol } from './typesBookEvent';
import { GAME_CONFIG } from './config';

class StateGame {
	board = $state<Symbol[][]>([]);
	gameType = $state<'basegame' | 'freegame'>('basegame');
	currentWin = $state(0);
	totalWin = $state(0);
	freeSpinCurrent = $state(0);
	freeSpinTotal = $state(0);
	isSpinning = $state(false);

	resetBoard() {
		this.board = Array.from({ length: GAME_CONFIG.reels }, () =>
			Array.from({ length: GAME_CONFIG.rows }, () => ({ name: 'TEN' }))
		);
	}

	setBoard(board: Symbol[][]) {
		this.board = board;
	}

	setGameType(gameType: 'basegame' | 'freegame') {
		this.gameType = gameType;
	}

	setCurrentWin(amount: number) {
		this.currentWin = amount;
	}

	setTotalWin(amount: number) {
		this.totalWin = amount;
	}

	setFreeSpins(current: number, total: number) {
		this.freeSpinCurrent = current;
		this.freeSpinTotal = total;
	}

	setSpinning(spinning: boolean) {
		this.isSpinning = spinning;
	}

	reset() {
		this.resetBoard();
		this.currentWin = 0;
		this.totalWin = 0;
		this.freeSpinCurrent = 0;
		this.freeSpinTotal = 0;
		this.isSpinning = false;
		this.gameType = 'basegame';
	}
}

export const stateGame = new StateGame();

export const stateGameDerived = {
	isInFreeSpin: () => stateGame.gameType === 'freegame',
	hasWin: () => stateGame.currentWin > 0,
	canSpin: () => !stateGame.isSpinning,
};

/**
 * Game engine for Golden Fortune Slots
 * Orchestrates RGS communication, book event processing, and game flow
 */

import { rgsClient } from './rgsClient';
import { stateGame } from './stateGame.svelte';
import { stateRGS } from './stateRGS.svelte';
import { eventEmitter } from './eventEmitter';
import { bookEventHandlerMap } from './bookEventHandlerMap';
import { soundManager } from './soundManager';
import type { BookEvent, Book } from './typesBookEvent';

class GameEngine {
	private isProcessingBook = false;
	private currentBook: Book | null = null;

	async initialize(): Promise<void> {
		try {
			console.log('[GameEngine] Initializing...');

			rgsClient.initialize(window.location.href);
			rgsClient.setupEventListeners();

			this.setupWindowEventListeners();

			await rgsClient.authenticate();
			stateRGS.setAuthenticated(true);

			console.log('[GameEngine] Initialization complete');
		} catch (error) {
			console.error('[GameEngine] Initialization failed', error);
			stateRGS.setError(
				error instanceof Error ? error.message : 'Failed to initialize game'
			);
			throw error;
		}
	}

	async spin(betAmount: number, mode: string = 'base'): Promise<void> {
		if (this.isProcessingBook) {
			console.warn('[GameEngine] Already processing a book');
			return;
		}

		if (!stateRGS.canSpin) {
			console.warn('[GameEngine] Cannot spin - conditions not met');
			return;
		}

		try {
			console.log(`[GameEngine] Starting spin - Bet: ${betAmount}, Mode: ${mode}`);

			stateRGS.setLoading(true);
			stateRGS.setRoundActive(true);
			stateRGS.updateCanSpin();
			stateGame.setSpinning(true);

			eventEmitter.broadcast({ type: 'boardSpin' });
			soundManager.playOnce('sfx_spin');

			const response = await rgsClient.play(betAmount, mode);

			console.log('[GameEngine] Play response received', response);

			if (response.book) {
				this.currentBook = response.book;
				await this.processBook(response.book);
			}

			stateRGS.setLoading(false);
			stateGame.setSpinning(false);

			await this.endRound();
		} catch (error) {
			console.error('[GameEngine] Spin failed', error);
			stateRGS.setError(
				error instanceof Error ? error.message : 'Spin failed'
			);
			stateRGS.setLoading(false);
			stateGame.setSpinning(false);
			stateRGS.setRoundActive(false);
			stateRGS.updateCanSpin();
		}
	}

	private async processBook(book: Book): Promise<void> {
		if (this.isProcessingBook) {
			console.warn('[GameEngine] Already processing a book');
			return;
		}

		this.isProcessingBook = true;

		try {
			console.log(`[GameEngine] Processing book ${book.id} with ${book.events.length} events`);

			const context = { bookEvents: book.events };

			for (const bookEvent of book.events) {
				await this.processBookEvent(bookEvent, context);
			}

			console.log('[GameEngine] Book processing complete');
		} catch (error) {
			console.error('[GameEngine] Book processing failed', error);
			throw error;
		} finally {
			this.isProcessingBook = false;
		}
	}

	private async processBookEvent(
		bookEvent: BookEvent,
		context: { bookEvents: BookEvent[] }
	): Promise<void> {
		console.log(`[GameEngine] Processing book event: ${bookEvent.type}`, bookEvent);

		const handler = bookEventHandlerMap[bookEvent.type];

		if (handler) {
			try {
				await handler(bookEvent, context);

				this.updateGameState(bookEvent);
			} catch (error) {
				console.error(`[GameEngine] Error processing book event ${bookEvent.type}`, error);
			}
		} else {
			console.warn(`[GameEngine] No handler for book event type: ${bookEvent.type}`);
		}
	}

	private updateGameState(bookEvent: BookEvent): void {
		switch (bookEvent.type) {
			case 'reveal':
				stateGame.setBoard(bookEvent.board);
				stateGame.setGameType(bookEvent.gameType);
				break;

			case 'setWin':
				stateGame.setCurrentWin(bookEvent.amount);
				break;

			case 'setTotalWin':
				stateGame.setTotalWin(bookEvent.amount);
				break;

			case 'finalWin':
				stateGame.setCurrentWin(bookEvent.amount);
				if (bookEvent.amount > 0) {
					this.playWinSound(bookEvent.amount);
				}
				break;

			case 'startFreeSpin':
				stateGame.setFreeSpins(0, bookEvent.totalFs);
				stateGame.setGameType('freegame');
				soundManager.playMusic('bgm_freespin', 1000);
				break;

			case 'updateFreeSpin':
				stateGame.setFreeSpins(bookEvent.amount, bookEvent.total);
				break;

			case 'endFreeSpin':
				stateGame.setGameType('basegame');
				soundManager.playMusic('bgm_main', 1000);
				break;
		}
	}

	private playWinSound(winAmount: number): void {
		const betAmount = stateRGS.currentBetAmount;
		const winMultiplier = winAmount / betAmount;

		if (winMultiplier >= 100) {
			soundManager.playOnce('sfx_win_max');
		} else if (winMultiplier >= 25) {
			soundManager.playOnce('sfx_win_big');
		} else if (winMultiplier >= 5) {
			soundManager.playOnce('sfx_win_medium');
		} else {
			soundManager.playOnce('sfx_win_small');
		}
	}

	private async endRound(): Promise<void> {
		try {
			console.log('[GameEngine] Ending round');
			await rgsClient.endRound();
			stateRGS.setRoundActive(false);
			stateRGS.updateCanSpin();
		} catch (error) {
			console.error('[GameEngine] Failed to end round', error);
		}
	}

	private setupWindowEventListeners(): void {
		window.addEventListener('balanceUpdate', (event: Event) => {
			const customEvent = event as CustomEvent<{ amount: number; currency: string }>;
			console.log('[GameEngine] Balance update received', customEvent.detail);
			stateRGS.setBalance(customEvent.detail.amount, customEvent.detail.currency);
			stateRGS.updateCanSpin();
		});

		window.addEventListener('roundActive', (event: Event) => {
			const customEvent = event as CustomEvent<{ active: boolean }>;
			console.log('[GameEngine] Round active state changed', customEvent.detail);
			stateRGS.setRoundActive(customEvent.detail.active);
			stateRGS.updateCanSpin();
		});
	}

	getCurrentBook(): Book | null {
		return this.currentBook;
	}

	isProcessing(): boolean {
		return this.isProcessingBook;
	}
}

export const gameEngine = new GameEngine();

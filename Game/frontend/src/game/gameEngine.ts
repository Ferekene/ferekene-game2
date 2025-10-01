/**
 * Game engine for Golden Fortune Slots
 * Orchestrates RGS communication, book event processing, and game flow
 */

import { requestBet, requestEndRound } from '../lib/rgsRequests';
import { stateUrlDerived } from '../lib/stateUrl.svelte';
import { stateBet } from '../lib/stateBet.svelte';
import { saveGameSession, saveGameRound, logError } from '../lib/supabase';
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

			// Save initial session to Supabase
			await saveGameSession({
				session_id: stateUrlDerived.sessionID(),
				balance: stateBet.balanceAmount,
				currency: stateBet.currency,
			});

			console.log('[GameEngine] Initialization complete');
		} catch (error) {
			console.error('[GameEngine] Initialization failed', error);
			const errorMessage = error instanceof Error ? error.message : 'Failed to initialize game';
			stateRGS.setError(errorMessage);

			// Log error to Supabase
			await logError({
				session_id: stateUrlDerived.sessionID(),
				error_type: 'INITIALIZATION_ERROR',
				error_message: errorMessage,
				stack_trace: error instanceof Error ? error.stack : undefined,
			});

			throw error;
		}
	}

	async spin(betAmount: number, mode: string = 'BASE'): Promise<void> {
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

			const response = await requestBet({
				sessionID: stateUrlDerived.sessionID(),
				rgsUrl: stateUrlDerived.rgsUrl(),
				currency: stateBet.currency,
				amount: betAmount,
				mode: mode,
			});

			console.log('[GameEngine] Play response received', response);

			// Update balance
			if (response.balance) {
				stateRGS.setBalance(response.balance.amount, response.balance.currency);
				stateBet.balanceAmount = response.balance.amount;
				stateBet.currency = response.balance.currency;

				// Save updated balance
				await saveGameSession({
					session_id: stateUrlDerived.sessionID(),
					balance: response.balance.amount,
					currency: response.balance.currency,
				});
			}

			// Process round
			if (response.round && response.round.state) {
				const bookEvents = response.round.state;
				await this.processBookEvents(bookEvents);

				// Save round to Supabase
				await saveGameRound({
					session_id: stateUrlDerived.sessionID(),
					round_id: response.round.betID,
					bet_amount: betAmount,
					win_amount: response.round.payout,
					payout_multiplier: response.round.payoutMultiplier,
					symbols: stateGame.board,
					book_events: bookEvents,
					mode: mode,
				});
			}

			stateRGS.setLoading(false);
			stateGame.setSpinning(false);

			await this.endRound();
		} catch (error) {
			console.error('[GameEngine] Spin failed', error);
			const errorMessage = error instanceof Error ? error.message : 'Spin failed';
			stateRGS.setError(errorMessage);

			// Log error
			await logError({
				session_id: stateUrlDerived.sessionID(),
				error_type: 'SPIN_ERROR',
				error_message: errorMessage,
				stack_trace: error instanceof Error ? error.stack : undefined,
				context: { betAmount, mode },
			});

			stateRGS.setLoading(false);
			stateGame.setSpinning(false);
			stateRGS.setRoundActive(false);
			stateRGS.updateCanSpin();
		}
	}

	private async processBookEvents(bookEvents: BookEvent[]): Promise<void> {
		if (this.isProcessingBook) {
			console.warn('[GameEngine] Already processing book events');
			return;
		}

		this.isProcessingBook = true;

		try {
			console.log(`[GameEngine] Processing ${bookEvents.length} book events`);

			const context = { bookEvents };

			for (const bookEvent of bookEvents) {
				await this.processBookEvent(bookEvent, context);
			}

			console.log('[GameEngine] Book events processing complete');
		} catch (error) {
			console.error('[GameEngine] Book events processing failed', error);
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
			await requestEndRound({
				sessionID: stateUrlDerived.sessionID(),
				rgsUrl: stateUrlDerived.rgsUrl(),
			});
			stateRGS.setRoundActive(false);
			stateRGS.updateCanSpin();
		} catch (error) {
			console.error('[GameEngine] Failed to end round', error);
		}
	}



	isProcessing(): boolean {
		return this.isProcessingBook;
	}
}

export const gameEngine = new GameEngine();

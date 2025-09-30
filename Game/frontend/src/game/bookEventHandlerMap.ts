/**
 * Book event handlers for Golden Fortune Slots
 * Maps book events from RGS to emitter events for components
 */

import { eventEmitter } from './eventEmitter';
import type { BookEvent, BookEventOfType, BookEventContext } from './typesBookEvent';

type BookEventHandler<T extends BookEvent['type']> = (
	bookEvent: BookEventOfType<T>,
	context: BookEventContext
) => Promise<void>;

export const bookEventHandlerMap: Record<string, BookEventHandler<any>> = {
	reveal: async (bookEvent: BookEventOfType<'reveal'>) => {
		eventEmitter.broadcast({ type: 'boardShow' });
		await eventEmitter.broadcastAsync({
			type: 'boardReveal',
			board: bookEvent.board,
			paddingPositions: bookEvent.paddingPositions,
			anticipation: bookEvent.anticipation,
		});
		await eventEmitter.broadcastAsync({
			type: 'boardSettle',
			board: bookEvent.board,
		});
	},

	winInfo: async (bookEvent: BookEventOfType<'winInfo'>) => {
		if (bookEvent.wins.length > 0) {
			await eventEmitter.broadcastAsync({
				type: 'winShow',
				wins: bookEvent.wins,
			});
		}
	},

	setWin: async (bookEvent: BookEventOfType<'setWin'>) => {
		eventEmitter.broadcast({
			type: 'winAmountUpdate',
			amount: bookEvent.amount,
		});
	},

	setTotalWin: async (bookEvent: BookEventOfType<'setTotalWin'>) => {
		eventEmitter.broadcast({
			type: 'winAmountUpdate',
			amount: bookEvent.amount,
		});
	},

	finalWin: async (bookEvent: BookEventOfType<'finalWin'>) => {
		eventEmitter.broadcast({
			type: 'winAmountUpdate',
			amount: bookEvent.amount,
		});
		await new Promise((resolve) => setTimeout(resolve, 1000));
	},

	startFreeSpin: async (bookEvent: BookEventOfType<'startFreeSpin'>) => {
		await eventEmitter.broadcastAsync({
			type: 'freeSpinIntroShow',
			totalFreeSpins: bookEvent.totalFs,
		});
		eventEmitter.broadcast({ type: 'freeSpinCounterShow' });
		eventEmitter.broadcast({
			type: 'freeSpinCounterUpdate',
			current: 0,
			total: bookEvent.totalFs,
		});
	},

	updateFreeSpin: async (bookEvent: BookEventOfType<'updateFreeSpin'>) => {
		eventEmitter.broadcast({
			type: 'freeSpinCounterUpdate',
			current: bookEvent.amount,
			total: bookEvent.total,
		});
	},

	endFreeSpin: async () => {
		eventEmitter.broadcast({ type: 'freeSpinCounterHide' });
		await new Promise((resolve) => setTimeout(resolve, 500));
	},
};

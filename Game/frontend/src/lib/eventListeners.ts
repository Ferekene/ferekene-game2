import { get } from 'svelte/store';
import { stateRGS } from '../game/stateRGS';
import { stateBet } from './stateBet';
import { ParseAmount } from './rgsClient';
import type { Balance } from './rgsClient';

let balanceListenerAttached = false;
let roundListenerAttached = false;

export const setupBalanceListener = () => {
	if (balanceListenerAttached) {
		console.warn('[Event Listeners] Balance listener already attached');
		return;
	}

	const handleBalanceUpdate = (event: Event) => {
		const customEvent = event as CustomEvent<Balance>;
		const balance = customEvent.detail;

		console.log('[Balance Event] Balance updated:', balance);

		const balanceAmount = ParseAmount(balance.amount);

		stateBet.update(state => ({
			...state,
			balanceAmount,
			currency: balance.currency,
		}));

		stateRGS.setBalance(balanceAmount, balance.currency);
		stateRGS.updateCanSpin();
	};

	window.addEventListener('balanceUpdate', handleBalanceUpdate as EventListener);
	balanceListenerAttached = true;

	console.log('[Event Listeners] Balance listener attached');
};

export const setupRoundActiveListener = () => {
	if (roundListenerAttached) {
		console.warn('[Event Listeners] Round listener already attached');
		return;
	}

	const handleRoundActive = (event: Event) => {
		const customEvent = event as CustomEvent<{ active: boolean }>;
		const { active } = customEvent.detail;

		console.log('[Round Event] Round active state changed:', active);

		stateRGS.setRoundActive(active);
		stateRGS.updateCanSpin();
	};

	window.addEventListener('roundActive', handleRoundActive as EventListener);
	roundListenerAttached = true;

	console.log('[Event Listeners] Round active listener attached');
};

export const setupAllEventListeners = () => {
	setupBalanceListener();
	setupRoundActiveListener();
};

export const removeAllEventListeners = () => {
	if (balanceListenerAttached) {
		window.removeEventListener('balanceUpdate', () => {});
		balanceListenerAttached = false;
	}

	if (roundListenerAttached) {
		window.removeEventListener('roundActive', () => {});
		roundListenerAttached = false;
	}

	console.log('[Event Listeners] All listeners removed');
};

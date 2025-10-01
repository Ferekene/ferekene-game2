/**
 * Bet and balance state management
 * Handles balance, bet amounts, currency, and game rounds
 * Converted to Svelte 3 writable stores
 */

import { writable, get } from 'svelte/store';

export type Currency = string;
export type LastBet = any | null;
export type BetModeKey = string;

export interface BetState {
	currency: Currency;
	balanceAmount: number;
	betAmount: number;
	wageredBetAmount: number;
	lastBet: LastBet;
	activeBetModeKey: BetModeKey;
	winBookEventAmount: number;
	autoSpinsCounter: number;
	isSpaceHold: boolean;
	isTurbo: boolean;
}

function createBetState() {
	const { subscribe, set, update } = writable<BetState>({
		currency: 'USD',
		balanceAmount: 0,
		betAmount: 1,
		wageredBetAmount: 1,
		lastBet: null,
		activeBetModeKey: 'BASE',
		winBookEventAmount: 0,
		autoSpinsCounter: 0,
		isSpaceHold: false,
		isTurbo: false,
	});

	const correctBetAmount = (value: number): number => {
		if (value <= 0) return 0;
		const state = get({ subscribe });
		const max = state.balanceAmount;
		if (value >= max) return max;
		return value;
	};

	return {
		subscribe,
		set,
		update,
		setBetAmount: (value: number) =>
			update((state) => ({
				...state,
				betAmount: correctBetAmount(value),
			})),
		updateBetAmount: (updateFn: (value: number) => number) =>
			update((state) => ({
				...state,
				betAmount: correctBetAmount(updateFn(state.betAmount)),
			})),
		betCost: () => get({ subscribe }).betAmount,
		isBetCostAvailable: () => {
			const state = get({ subscribe });
			return state.betAmount > 0 && state.betAmount <= state.balanceAmount;
		},
		hasAutoBetCounter: () => get({ subscribe }).autoSpinsCounter !== 0,
		isContinuousBet: () => {
			const state = get({ subscribe });
			return state.autoSpinsCounter > 1 || state.isSpaceHold;
		},
	};
}

export const stateBet = createBetState();

export const stateBetDerived = {
	setBetAmount: stateBet.setBetAmount,
	updateBetAmount: stateBet.updateBetAmount,
	betCost: stateBet.betCost,
	isBetCostAvailable: stateBet.isBetCostAvailable,
	hasAutoBetCounter: stateBet.hasAutoBetCounter,
	isContinuousBet: stateBet.isContinuousBet,
};

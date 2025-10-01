/**
 * Bet and balance state management
 * Handles balance, bet amounts, currency, and game rounds
 */

export type Currency = string;
export type LastBet = any | null;
export type BetModeKey = string;

export const stateBet = $state({
	currency: 'USD' as Currency,
	balanceAmount: 0,
	betAmount: 1,
	wageredBetAmount: 1,
	lastBet: null as LastBet,
	activeBetModeKey: 'BASE' as BetModeKey,
	winBookEventAmount: 0,
	autoSpinsCounter: 0,
	isSpaceHold: false,
	isTurbo: false,
});

const correctBetAmount = (value: number): number => {
	if (value <= 0) return 0;
	const max = stateBet.balanceAmount;
	if (value >= max) return max;
	return value;
};

const setBetAmount = (value: number) => {
	stateBet.betAmount = correctBetAmount(value);
};

const updateBetAmount = (update: (value: number) => number) => {
	stateBet.betAmount = correctBetAmount(update(stateBet.betAmount));
};

const betCost = (): number => stateBet.betAmount;

const isBetCostAvailable = (): boolean =>
	betCost() > 0 && betCost() <= stateBet.balanceAmount;

const hasAutoBetCounter = (): boolean => stateBet.autoSpinsCounter !== 0;

const isContinuousBet = (): boolean =>
	stateBet.autoSpinsCounter > 1 || stateBet.isSpaceHold;

export const stateBetDerived = {
	setBetAmount,
	updateBetAmount,
	betCost,
	isBetCostAvailable,
	hasAutoBetCounter,
	isContinuousBet,
};

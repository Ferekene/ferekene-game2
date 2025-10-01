/**
 * RGS state management for Golden Fortune Slots
 * Handles balance, authentication, and round management
 * Converted to Svelte 3 writable stores
 */

import { writable, derived } from 'svelte/store';

export interface RGSState {
	balance: number;
	currency: string;
	isAuthenticated: boolean;
	isRoundActive: boolean;
	isLoading: boolean;
	error: string | null;
	currentBetAmount: number;
	availableBetLevels: number[];
	currentBetLevelIndex: number;
	canSpin: boolean;
}

function createRGSState() {
	const { subscribe, set, update } = writable<RGSState>({
		balance: 0,
		currency: 'USD',
		isAuthenticated: false,
		isRoundActive: false,
		isLoading: false,
		error: null,
		currentBetAmount: 1,
		availableBetLevels: [0.1, 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100],
		currentBetLevelIndex: 3,
		canSpin: true,
	});

	return {
		subscribe,
		setBalance: (amount: number, currency: string) =>
			update((state) => ({ ...state, balance: amount, currency })),
		setAuthenticated: (authenticated: boolean) =>
			update((state) => ({ ...state, isAuthenticated: authenticated })),
		setRoundActive: (active: boolean) =>
			update((state) => ({ ...state, isRoundActive: active })),
		setLoading: (loading: boolean) =>
			update((state) => ({ ...state, isLoading: loading })),
		setError: (error: string | null) =>
			update((state) => ({ ...state, error })),
		setBetAmount: (amount: number) =>
			update((state) => ({ ...state, currentBetAmount: amount })),
		increaseBet: () =>
			update((state) => {
				if (state.currentBetLevelIndex < state.availableBetLevels.length - 1) {
					const newIndex = state.currentBetLevelIndex + 1;
					return {
						...state,
						currentBetLevelIndex: newIndex,
						currentBetAmount: state.availableBetLevels[newIndex],
					};
				}
				return state;
			}),
		decreaseBet: () =>
			update((state) => {
				if (state.currentBetLevelIndex > 0) {
					const newIndex = state.currentBetLevelIndex - 1;
					return {
						...state,
						currentBetLevelIndex: newIndex,
						currentBetAmount: state.availableBetLevels[newIndex],
					};
				}
				return state;
			}),
		setCanSpin: (canSpin: boolean) =>
			update((state) => ({ ...state, canSpin })),
		updateCanSpin: () =>
			update((state) => ({
				...state,
				canSpin:
					state.isAuthenticated &&
					!state.isRoundActive &&
					!state.isLoading &&
					state.balance >= state.currentBetAmount,
			})),
		reset: () =>
			set({
				balance: 0,
				currency: 'USD',
				isAuthenticated: false,
				isRoundActive: false,
				isLoading: false,
				error: null,
				currentBetAmount: 1,
				availableBetLevels: [0.1, 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100],
				currentBetLevelIndex: 3,
				canSpin: true,
			}),
	};
}

export const stateRGS = createRGSState();

export const stateRGSDerived = {
	canIncreaseBet: derived(
		stateRGS,
		($state) =>
			$state.currentBetLevelIndex < $state.availableBetLevels.length - 1
	),
	canDecreaseBet: derived(
		stateRGS,
		($state) => $state.currentBetLevelIndex > 0
	),
	hasEnoughBalance: derived(
		stateRGS,
		($state) => $state.balance >= $state.currentBetAmount
	),
};

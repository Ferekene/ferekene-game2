/**
 * RGS state management for Golden Fortune Slots
 * Handles balance, authentication, and round management
 */

class StateRGS {
	balance = $state(0);
	currency = $state('USD');
	isAuthenticated = $state(false);
	isRoundActive = $state(false);
	isLoading = $state(false);
	error = $state<string | null>(null);
	currentBetAmount = $state(1);
	availableBetLevels = $state<number[]>([0.1, 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100]);
	currentBetLevelIndex = $state(3);
	canSpin = $state(true);

	setBalance(amount: number, currency: string) {
		this.balance = amount;
		this.currency = currency;
	}

	setAuthenticated(authenticated: boolean) {
		this.isAuthenticated = authenticated;
	}

	setRoundActive(active: boolean) {
		this.isRoundActive = active;
	}

	setLoading(loading: boolean) {
		this.isLoading = loading;
	}

	setError(error: string | null) {
		this.error = error;
	}

	setBetAmount(amount: number) {
		this.currentBetAmount = amount;
	}

	increaseBet() {
		if (this.currentBetLevelIndex < this.availableBetLevels.length - 1) {
			this.currentBetLevelIndex++;
			this.currentBetAmount = this.availableBetLevels[this.currentBetLevelIndex];
		}
	}

	decreaseBet() {
		if (this.currentBetLevelIndex > 0) {
			this.currentBetLevelIndex--;
			this.currentBetAmount = this.availableBetLevels[this.currentBetLevelIndex];
		}
	}

	setCanSpin(canSpin: boolean) {
		this.canSpin = canSpin;
	}

	updateCanSpin() {
		this.canSpin =
			this.isAuthenticated &&
			!this.isRoundActive &&
			!this.isLoading &&
			this.balance >= this.currentBetAmount;
	}

	reset() {
		this.balance = 0;
		this.currency = 'USD';
		this.isAuthenticated = false;
		this.isRoundActive = false;
		this.isLoading = false;
		this.error = null;
		this.currentBetAmount = 1;
		this.currentBetLevelIndex = 3;
		this.canSpin = true;
	}
}

export const stateRGS = new StateRGS();

export const stateRGSDerived = {
	canIncreaseBet: () =>
		stateRGS.currentBetLevelIndex < stateRGS.availableBetLevels.length - 1,
	canDecreaseBet: () =>
		stateRGS.currentBetLevelIndex > 0,
	hasEnoughBalance: () =>
		stateRGS.balance >= stateRGS.currentBetAmount,
};

/**
 * RGS Request Functions
 * High-level API calls to RGS endpoints
 */

import { rgsFetcher } from './rgsFetcher';

export const API_AMOUNT_MULTIPLIER = 1000000;

export interface AuthenticateResponse {
	balance?: {
		amount: number;
		currency: string;
	};
	config?: {
		gameID: string;
		minBet: number;
		maxBet: number;
		stepBet: number;
		defaultBetLevel: number;
		betLevels: number[];
		betModes?: Record<string, any>;
		jurisdiction?: any;
	};
	round?: {
		betID: number;
		amount: number;
		payout: number;
		payoutMultiplier: number;
		active: boolean;
		state: any[];
		mode: string;
		event: any;
	};
	error?: any;
}

export interface PlayResponse {
	balance: {
		amount: number;
		currency: string;
	};
	round: {
		betID: number;
		amount: number;
		payout: number;
		payoutMultiplier: number;
		active: boolean;
		state: any[];
		mode: string;
	};
	error?: any;
}

export const requestAuthenticate = async (options: {
	sessionID: string;
	rgsUrl: string;
	language: string;
}): Promise<AuthenticateResponse> => {
	const data = await rgsFetcher.post<AuthenticateResponse>({
		rgsUrl: options.rgsUrl,
		url: '/wallet/authenticate',
		variables: {
			sessionID: options.sessionID,
			language: options.language,
		},
	});

	return data;
};

export const requestBet = async (options: {
	sessionID: string;
	currency: string;
	amount: number;
	mode: string;
	rgsUrl: string;
}): Promise<PlayResponse> => {
	const data = await rgsFetcher.post<PlayResponse>({
		rgsUrl: options.rgsUrl,
		url: '/wallet/play',
		variables: {
			mode: options.mode,
			currency: options.currency,
			sessionID: options.sessionID,
			amount: Math.round(options.amount * API_AMOUNT_MULTIPLIER),
		},
	});

	return data;
};

export const requestEndRound = async (options: {
	sessionID: string;
	rgsUrl: string;
}): Promise<any> => {
	const data = await rgsFetcher.post({
		rgsUrl: options.rgsUrl,
		url: '/wallet/end-round',
		variables: {
			sessionID: options.sessionID,
		},
	});

	return data;
};

export const requestEndEvent = async (options: {
	sessionID: string;
	eventIndex: number;
	rgsUrl: string;
}): Promise<any> => {
	const data = await rgsFetcher.post({
		rgsUrl: options.rgsUrl,
		url: '/bet/event',
		variables: {
			sessionID: options.sessionID,
			event: `${options.eventIndex}`,
		},
	});

	return data;
};

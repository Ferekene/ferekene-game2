/**
 * RGS Client wrapper for Golden Fortune Slots
 * Handles all communication with Stake Engine RGS
 */

import { RGSClient, DisplayAmount, ParseAmount } from 'stake-engine';
import type { Book } from './typesBookEvent';

export const API_MULTIPLIER = 1000000;

export type RGSConfig = {
	url: string;
	currency: string;
	language: string;
	deviceType: string;
	balance: number;
};

export type PlayResponse = {
	balance: { amount: number; currency: string };
	book: Book;
	roundId: string;
	roundActive: boolean;
};

class RGSClientWrapper {
	private client: ReturnType<typeof RGSClient> | null = null;
	private config: RGSConfig | null = null;
	private authenticated = false;
	private currentRoundId: string | null = null;

	initialize(url: string): void {
		this.client = RGSClient({ url });
		this.parseUrlParams(url);
	}

	private parseUrlParams(url: string): void {
		try {
			const urlObj = new URL(url);
			this.config = {
				url,
				currency: urlObj.searchParams.get('currency') || 'USD',
				language: urlObj.searchParams.get('language') || 'en',
				deviceType: urlObj.searchParams.get('deviceType') || 'desktop',
				balance: Number(urlObj.searchParams.get('balance')) || 0,
			};
		} catch (error) {
			console.error('Failed to parse URL params', error);
			this.config = {
				url,
				currency: 'USD',
				language: 'en',
				deviceType: 'desktop',
				balance: 0,
			};
		}
	}

	async authenticate(): Promise<any> {
		if (!this.client) {
			throw new Error('RGS Client not initialized');
		}

		try {
			const response = await this.client.Authenticate();
			this.authenticated = true;
			console.log('[RGS] Authentication successful', response);
			return response;
		} catch (error) {
			console.error('[RGS] Authentication failed', error);
			throw error;
		}
	}

	async play(amount: number, mode: string = 'base'): Promise<PlayResponse> {
		if (!this.client) {
			throw new Error('RGS Client not initialized');
		}

		if (!this.authenticated) {
			throw new Error('RGS Client not authenticated');
		}

		try {
			const rgsAmount = amount * API_MULTIPLIER;
			console.log(`[RGS] Play request - Amount: ${amount}, Mode: ${mode}, RGS Amount: ${rgsAmount}`);

			const response = await this.client.Play({
				amount: rgsAmount,
				mode,
			});

			if (response.roundId) {
				this.currentRoundId = response.roundId;
			}

			console.log('[RGS] Play response', response);
			return response as PlayResponse;
		} catch (error) {
			console.error('[RGS] Play request failed', error);
			throw error;
		}
	}

	async endRound(): Promise<any> {
		if (!this.client) {
			throw new Error('RGS Client not initialized');
		}

		if (!this.currentRoundId) {
			console.warn('[RGS] No active round to end');
			return;
		}

		try {
			console.log('[RGS] Ending round', this.currentRoundId);
			const response = await this.client.EndRound();
			this.currentRoundId = null;
			console.log('[RGS] Round ended', response);
			return response;
		} catch (error) {
			console.error('[RGS] EndRound failed', error);
			throw error;
		}
	}

	async event(eventName: string): Promise<any> {
		if (!this.client) {
			throw new Error('RGS Client not initialized');
		}

		try {
			console.log(`[RGS] Event: ${eventName}`);
			const response = await this.client.Event(eventName);
			console.log('[RGS] Event response', response);
			return response;
		} catch (error) {
			console.error(`[RGS] Event ${eventName} failed`, error);
			throw error;
		}
	}

	displayAmount(amount: number, options?: any): string {
		if (!this.client) {
			return amount.toFixed(2);
		}

		const balance = {
			amount,
			currency: this.config?.currency || 'USD',
		};

		return DisplayAmount(balance, {
			removeSymbol: false,
			decimals: 2,
			...options,
		});
	}

	parseAmount(amount: number): number {
		return ParseAmount(amount);
	}

	getConfig(): RGSConfig | null {
		return this.config;
	}

	isAuthenticated(): boolean {
		return this.authenticated;
	}

	hasActiveRound(): boolean {
		return this.currentRoundId !== null;
	}

	setupEventListeners(): void {
		window.addEventListener('balanceUpdate', (event: Event) => {
			const customEvent = event as CustomEvent<{ amount: number; currency: string }>;
			console.log('[RGS] Balance updated', customEvent.detail);
		});

		window.addEventListener('roundActive', (event: Event) => {
			const customEvent = event as CustomEvent<{ active: boolean }>;
			console.log('[RGS] Round active state changed', customEvent.detail);
		});
	}
}

export const rgsClient = new RGSClientWrapper();
export { DisplayAmount, ParseAmount };

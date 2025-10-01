import { RGSClient, DisplayAmount as DisplayAmountSDK, ParseAmount as ParseAmountSDK } from 'stake-engine';
import type { Balance } from 'stake-engine';

let rgsClientInstance: ReturnType<typeof RGSClient> | null = null;

export const initializeRGSClient = () => {
	if (rgsClientInstance) {
		return rgsClientInstance;
	}

	try {
		rgsClientInstance = RGSClient({
			url: window.location.href,
			enforceBetLevels: true,
		});

		console.log('[RGS Client] Initialized successfully');
		return rgsClientInstance;
	} catch (error) {
		console.error('[RGS Client] Failed to initialize:', error);
		throw error;
	}
};

export const getRGSClient = () => {
	if (!rgsClientInstance) {
		throw new Error('[RGS Client] Client not initialized. Call initializeRGSClient() first.');
	}
	return rgsClientInstance;
};

export const isRGSClientInitialized = () => {
	return rgsClientInstance !== null;
};

export const DisplayAmount = DisplayAmountSDK;
export const ParseAmount = ParseAmountSDK;

export type { Balance };

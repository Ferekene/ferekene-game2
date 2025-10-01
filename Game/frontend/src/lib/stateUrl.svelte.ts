/**
 * URL parameter parsing and management
 * Extracts sessionID, rgs_url, lang, currency, device from URL
 */

import { page } from '$app/state';

export type Language = 'en' | 'tr' | 'zh' | 'pt' | 'es' | 'de' | 'fr' | 'ja' | 'ko';

export type UrlKey =
	| 'sessionID'
	| 'rgs_url'
	| 'lang'
	| 'currency'
	| 'device'
	| 'social'
	| 'demo'
	| 'force';

const getUrlSearchParam = (key: UrlKey): string | null => {
	if (typeof window === 'undefined') return null;
	return page.url.searchParams.get(key);
};

const lang = (): Language => {
	const langParam = getUrlSearchParam('lang');
	if (langParam === 'br') return 'pt';
	return (langParam as Language) || 'en';
};

const sessionID = (): string => getUrlSearchParam('sessionID') || '';

const rgsUrl = (): string => getUrlSearchParam('rgs_url') || '';

const currency = (): string => getUrlSearchParam('currency') || 'USD';

const device = (): string => getUrlSearchParam('device') || 'desktop';

const force = (): boolean => getUrlSearchParam('force') === 'true';

const social = (): boolean => getUrlSearchParam('social') === 'true';

const demo = (): boolean => getUrlSearchParam('demo') === 'true';

export const stateUrlDerived = {
	lang,
	sessionID,
	rgsUrl,
	currency,
	device,
	force,
	social,
	demo,
};

export const isValidSession = (): boolean => {
	return !!(sessionID() && rgsUrl());
};

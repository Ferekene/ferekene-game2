/**
 * TypeScript types for emitter events in Golden Fortune Slots
 * These are internal frontend events for component communication
 */

import type { Symbol, Position, WinInfo } from './typesBookEvent';

export type EmitterEventBoardShow = { type: 'boardShow' };
export type EmitterEventBoardHide = { type: 'boardHide' };

export type EmitterEventBoardReveal = {
	type: 'boardReveal';
	board: Symbol[][];
	paddingPositions: number[];
	anticipation: number[];
};

export type EmitterEventBoardSpin = {
	type: 'boardSpin';
};

export type EmitterEventBoardSettle = {
	type: 'boardSettle';
	board: Symbol[][];
};

export type EmitterEventWinShow = {
	type: 'winShow';
	wins: WinInfo[];
};

export type EmitterEventWinHide = {
	type: 'winHide';
};

export type EmitterEventWinAmountUpdate = {
	type: 'winAmountUpdate';
	amount: number;
};

export type EmitterEventFreeSpinCounterShow = {
	type: 'freeSpinCounterShow';
};

export type EmitterEventFreeSpinCounterHide = {
	type: 'freeSpinCounterHide';
};

export type EmitterEventFreeSpinCounterUpdate = {
	type: 'freeSpinCounterUpdate';
	current: number;
	total: number;
};

export type EmitterEventFreeSpinIntroShow = {
	type: 'freeSpinIntroShow';
	totalFreeSpins: number;
};

export type EmitterEventFreeSpinIntroHide = {
	type: 'freeSpinIntroHide';
};

export type EmitterEventUiShow = { type: 'uiShow' };
export type EmitterEventUiHide = { type: 'uiHide' };

export type EmitterEventSoundOnce = {
	type: 'soundOnce';
	name: string;
};

export type EmitterEventSoundMusic = {
	type: 'soundMusic';
	name: string;
};

export type EmitterEventSoundLoop = {
	type: 'soundLoop';
	name: string;
};

export type EmitterEventSoundStop = {
	type: 'soundStop';
	name: string;
};

export type EmitterEventGame =
	| EmitterEventBoardShow
	| EmitterEventBoardHide
	| EmitterEventBoardReveal
	| EmitterEventBoardSpin
	| EmitterEventBoardSettle
	| EmitterEventWinShow
	| EmitterEventWinHide
	| EmitterEventWinAmountUpdate
	| EmitterEventFreeSpinCounterShow
	| EmitterEventFreeSpinCounterHide
	| EmitterEventFreeSpinCounterUpdate
	| EmitterEventFreeSpinIntroShow
	| EmitterEventFreeSpinIntroHide
	| EmitterEventUiShow
	| EmitterEventUiHide
	| EmitterEventSoundOnce
	| EmitterEventSoundMusic
	| EmitterEventSoundLoop
	| EmitterEventSoundStop;

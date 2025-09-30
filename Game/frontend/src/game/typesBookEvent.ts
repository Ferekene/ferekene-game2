/**
 * TypeScript types for all book events in Golden Fortune Slots
 * These match the events emitted from the math model
 */

export type Symbol = {
	name: string;
};

export type Position = {
	reel: number;
	row: number;
};

export type WinInfo = {
	symbol: string;
	kind: number;
	win: number;
	positions: Position[];
	meta: Record<string, unknown>;
};

type BookEventReveal = {
	index: number;
	type: 'reveal';
	board: Symbol[][];
	paddingPositions: number[];
	gameType: 'basegame' | 'freegame';
	anticipation: number[];
};

type BookEventWinInfo = {
	index: number;
	type: 'winInfo';
	totalWin: number;
	wins: WinInfo[];
};

type BookEventSetWin = {
	index: number;
	type: 'setWin';
	amount: number;
	winLevel: number;
};

type BookEventSetTotalWin = {
	index: number;
	type: 'setTotalWin';
	amount: number;
};

type BookEventFinalWin = {
	index: number;
	type: 'finalWin';
	amount: number;
};

type BookEventUpdateFreeSpin = {
	index: number;
	type: 'updateFreeSpin';
	amount: number;
	total: number;
};

type BookEventStartFreeSpin = {
	index: number;
	type: 'startFreeSpin';
	totalFs: number;
};

type BookEventEndFreeSpin = {
	index: number;
	type: 'endFreeSpin';
};

export type BookEvent =
	| BookEventReveal
	| BookEventWinInfo
	| BookEventSetWin
	| BookEventSetTotalWin
	| BookEventFinalWin
	| BookEventUpdateFreeSpin
	| BookEventStartFreeSpin
	| BookEventEndFreeSpin;

export type BookEventOfType<T extends BookEvent['type']> = Extract<BookEvent, { type: T }>;

export type BookEventContext = {
	bookEvents: BookEvent[];
};

export type Book = {
	id: number;
	payoutMultiplier: number;
	events: BookEvent[];
	criteria: string;
	baseGameWins: number;
	freeGameWins: number;
};

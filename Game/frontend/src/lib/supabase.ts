/**
 * Supabase Client Configuration
 * Handles database connection and operations
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	console.warn('[Supabase] Missing environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export interface GameSession {
	id?: string;
	session_id: string;
	balance: number;
	currency: string;
	created_at?: string;
	updated_at?: string;
}

export interface GameRound {
	id?: string;
	session_id: string;
	round_id: number;
	bet_amount: number;
	win_amount: number;
	payout_multiplier: number;
	symbols: any;
	book_events: any[];
	mode: string;
	created_at?: string;
}

export interface ErrorLog {
	id?: string;
	session_id: string;
	error_type: string;
	error_message: string;
	stack_trace?: string;
	context?: any;
	created_at?: string;
}

export const saveGameSession = async (session: GameSession) => {
	try {
		const { data, error } = await supabase
			.from('game_sessions')
			.upsert(session, { onConflict: 'session_id' })
			.select()
			.maybeSingle();

		if (error) {
			console.error('[Supabase] Error saving session:', error);
			return null;
		}

		return data;
	} catch (error) {
		console.error('[Supabase] Exception saving session:', error);
		return null;
	}
};

export const saveGameRound = async (round: GameRound) => {
	try {
		const { data, error } = await supabase
			.from('game_rounds')
			.insert(round)
			.select()
			.maybeSingle();

		if (error) {
			console.error('[Supabase] Error saving round:', error);
			return null;
		}

		return data;
	} catch (error) {
		console.error('[Supabase] Exception saving round:', error);
		return null;
	}
};

export const logError = async (errorLog: ErrorLog) => {
	try {
		const { error } = await supabase.from('error_logs').insert(errorLog);

		if (error) {
			console.error('[Supabase] Error logging error:', error);
		}
	} catch (error) {
		console.error('[Supabase] Exception logging error:', error);
	}
};

export const getSessionHistory = async (sessionId: string, limit: number = 10) => {
	try {
		const { data, error } = await supabase
			.from('game_rounds')
			.select('*')
			.eq('session_id', sessionId)
			.order('created_at', { ascending: false })
			.limit(limit);

		if (error) {
			console.error('[Supabase] Error fetching history:', error);
			return [];
		}

		return data || [];
	} catch (error) {
		console.error('[Supabase] Exception fetching history:', error);
		return [];
	}
};

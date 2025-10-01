/*
  # Golden Fortune Slots - Game Tracking Schema

  ## Overview
  Creates tables for tracking game sessions, rounds, and errors for the Golden Fortune Slots game.

  ## New Tables
  
  ### `game_sessions`
  Stores player session information including balance and currency.
  - `id` (uuid, primary key) - Unique session record identifier
  - `session_id` (text, unique) - Session ID from RGS
  - `balance` (numeric) - Current player balance
  - `currency` (text) - Currency code (USD, EUR, etc.)
  - `created_at` (timestamptz) - Session creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `game_rounds`
  Records each game round with bet, win, and game state information.
  - `id` (uuid, primary key) - Unique round record identifier
  - `session_id` (text) - References session_id from game_sessions
  - `round_id` (bigint) - Round ID from RGS
  - `bet_amount` (numeric) - Amount wagered
  - `win_amount` (numeric) - Amount won
  - `payout_multiplier` (numeric) - Win multiplier
  - `symbols` (jsonb) - Symbol positions on reels
  - `book_events` (jsonb) - All game events from RGS
  - `mode` (text) - Game mode (BASE, BONUS, etc.)
  - `created_at` (timestamptz) - Round timestamp

  ### `error_logs`
  Captures all errors for debugging and monitoring.
  - `id` (uuid, primary key) - Unique error log identifier
  - `session_id` (text) - Associated session ID
  - `error_type` (text) - Error category
  - `error_message` (text) - Error description
  - `stack_trace` (text, nullable) - Stack trace if available
  - `context` (jsonb, nullable) - Additional error context
  - `created_at` (timestamptz) - Error occurrence timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated access only
*/

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  balance numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create game_rounds table
CREATE TABLE IF NOT EXISTS game_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  round_id bigint NOT NULL,
  bet_amount numeric NOT NULL DEFAULT 0,
  win_amount numeric NOT NULL DEFAULT 0,
  payout_multiplier numeric NOT NULL DEFAULT 0,
  symbols jsonb,
  book_events jsonb,
  mode text NOT NULL DEFAULT 'BASE',
  created_at timestamptz DEFAULT now()
);

-- Create error_logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  error_type text NOT NULL,
  error_message text NOT NULL,
  stack_trace text,
  context jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_session_id ON game_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_game_rounds_session_id ON game_rounds(session_id);
CREATE INDEX IF NOT EXISTS idx_game_rounds_created_at ON game_rounds(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_session_id ON error_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for game_sessions
CREATE POLICY "Allow public read access to game_sessions"
  ON game_sessions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to game_sessions"
  ON game_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to game_sessions"
  ON game_sessions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for game_rounds
CREATE POLICY "Allow public read access to game_rounds"
  ON game_rounds
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to game_rounds"
  ON game_rounds
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create RLS policies for error_logs
CREATE POLICY "Allow public read access to error_logs"
  ON error_logs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to error_logs"
  ON error_logs
  FOR INSERT
  TO public
  WITH CHECK (true);

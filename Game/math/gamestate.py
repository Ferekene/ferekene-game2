"""Game state logic for Golden Fortune Slots"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../math-sdk'))

from game_override import GameStateOverride


class GameState(GameStateOverride):
    """Handles game logic and events for Golden Fortune slot game"""

    def run_spin(self, sim):
        """
        Main game loop for a single spin

        Args:
            sim: Simulation number for seeding RNG
        """
        self.reset_seed(sim)
        self.repeat = True

        while self.repeat:
            self.reset_book()
            self.draw_board()

            # Evaluate wins on the board
            self.evaluate_lines_board()

            # Update win manager with gametype wins
            self.win_manager.update_gametype_wins(self.gametype)

            # Check for free spin trigger
            if self.check_fs_condition():
                self.run_freespin_from_base()

            # Finalize the win
            self.evaluate_finalwin()

            # Check if repeat conditions are met
            self.check_repeat()

        # Save simulation results
        self.imprint_wins()

    def run_freespin(self):
        """Execute free spin mode logic"""
        self.reset_fs_spin()

        while self.fs < self.tot_fs:
            # Update free spin counter
            self.update_freespin()

            # Draw new board with free game reels
            self.draw_board()

            # Evaluate wins
            self.evaluate_lines_board()

            # Check for retrigger
            if self.check_fs_condition():
                self.update_fs_retrigger_amt()

            # Update cumulative free game wins
            self.win_manager.update_gametype_wins(self.gametype)

        # End free spin mode
        self.end_freespin()

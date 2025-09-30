"""Game executable methods for Golden Fortune Slots"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../math-sdk'))

from src.executables.executables import Executables


class GameExecutables(Executables):
    """Game-specific executable functions"""

    def evaluate_lines_board(self):
        """Evaluate wins on the current board using lines calculation"""
        from src.calculations.lines import Lines

        lines_calc = Lines(self)
        win_data = lines_calc.evaluate_wins()

        if win_data["total_win"] > 0:
            self.win_manager.update_wins(win_data["total_win"])
            self.transmit_win_info(win_data)

        return win_data

    def transmit_win_info(self, win_data):
        """
        Transmit win information event

        Args:
            win_data: Dictionary containing win information
        """
        from src.events.events import win_info_event

        win_info_event(self, win_data)

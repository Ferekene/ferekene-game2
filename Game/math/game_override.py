"""Game override methods for Golden Fortune Slots"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../math-sdk'))

from game_executables import GameExecutables
from game_calculations import GameCalculations


class GameStateOverride(GameExecutables, GameCalculations):
    """Override base functionality with game-specific implementations"""

    def __init__(self, config):
        super().__init__(config)
        GameCalculations.__init__(self)

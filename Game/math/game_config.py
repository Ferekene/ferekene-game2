"""Game-specific configuration file for Golden Fortune Slots"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../math-sdk'))

from src.config.config import Config
from src.config.distributions import Distribution
from src.config.betmode import BetMode


class GameConfig(Config):
    """Configuration for Golden Fortune - a 5-reel, 3-row, 20-payline slot game"""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        super().__init__()
        self.game_id = "golden_fortune"
        self.provider_number = 1
        self.working_name = "Golden Fortune Slots"
        self.wincap = 5000.0
        self.win_type = "lines"
        self.rtp = 0.9600
        self.construct_paths()

        # Game Dimensions - 5 reels, 3 rows
        self.num_reels = 5
        self.num_rows = [3] * self.num_reels

        # Paytable - (kind, symbol): payout multiplier
        self.paytable = {
            # Wild symbol - highest paying
            (5, "WILD"): 100,
            (4, "WILD"): 40,
            (3, "WILD"): 15,
            # High value symbols
            (5, "GOLD"): 50,
            (4, "GOLD"): 20,
            (3, "GOLD"): 8,
            (5, "GEM"): 40,
            (4, "GEM"): 15,
            (3, "GEM"): 6,
            (5, "COIN"): 30,
            (4, "COIN"): 10,
            (3, "COIN"): 4,
            (5, "RING"): 25,
            (4, "RING"): 8,
            (3, "RING"): 3,
            # Low value symbols
            (5, "ACE"): 20,
            (4, "ACE"): 6,
            (3, "ACE"): 2,
            (5, "KING"): 15,
            (4, "KING"): 4,
            (3, "KING"): 1.5,
            (5, "QUEEN"): 12,
            (4, "QUEEN"): 3,
            (3, "QUEEN"): 1,
            (5, "JACK"): 10,
            (4, "JACK"): 2.5,
            (3, "JACK"): 0.8,
            (5, "TEN"): 8,
            (4, "TEN"): 2,
            (3, "TEN"): 0.5,
        }

        # 20 paylines configuration
        self.paylines = {
            1: [1, 1, 1, 1, 1],   # Middle row
            2: [0, 0, 0, 0, 0],   # Top row
            3: [2, 2, 2, 2, 2],   # Bottom row
            4: [0, 1, 2, 1, 0],   # V shape
            5: [2, 1, 0, 1, 2],   # Inverted V
            6: [1, 0, 0, 0, 1],   # Crown
            7: [1, 2, 2, 2, 1],   # Inverted crown
            8: [0, 0, 1, 2, 2],   # Rising
            9: [2, 2, 1, 0, 0],   # Falling
            10: [1, 2, 1, 0, 1],  # Zigzag 1
            11: [1, 0, 1, 2, 1],  # Zigzag 2
            12: [0, 1, 1, 1, 0],  # Dome
            13: [2, 1, 1, 1, 2],  # Inverted dome
            14: [0, 1, 0, 1, 0],  # W shape
            15: [2, 1, 2, 1, 2],  # M shape
            16: [1, 1, 0, 1, 1],  # Arrow up
            17: [1, 1, 2, 1, 1],  # Arrow down
            18: [0, 0, 2, 0, 0],  # V small
            19: [2, 2, 0, 2, 2],  # Inverted V small
            20: [1, 0, 2, 0, 1],  # Diamond
        }

        self.include_padding = True
        self.special_symbols = {
            "wild": ["WILD"],
            "scatter": ["SCATTER"],
        }

        # Free spin triggers - number of scatters: number of free spins
        self.freespin_triggers = {
            self.basegame_type: {3: 10, 4: 15, 5: 20},
            self.freegame_type: {3: 5, 4: 10, 5: 15},
        }

        # Anticipation triggers - 2 scatters show anticipation
        self.anticipation_triggers = {
            self.basegame_type: 2,
            self.freegame_type: 2,
        }

        # Reels will be loaded from CSV files
        reels = {
            "BASE": "base_reels.csv",
            "FREE": "free_reels.csv",
            "FREECAP": "free_reels_wincap.csv"
        }

        self.reels = {}
        for r, f in reels.items():
            reel_path = os.path.join(os.path.dirname(__file__), "reels", f)
            if os.path.exists(reel_path):
                self.reels[r] = self.read_reels_csv(reel_path)

        self.padding_reels[self.basegame_type] = self.reels.get("BASE", [])
        self.padding_reels[self.freegame_type] = self.reels.get("FREE", [])

        # Bet modes configuration
        self.bet_modes = [
            BetMode(
                name="base",
                cost=1.0,
                rtp=self.rtp,
                max_win=self.wincap,
                auto_close_disabled=False,
                is_feature=True,
                is_buybonus=False,
                distributions=[
                    Distribution(
                        criteria="wincap",
                        quota=0.001,
                        win_criteria=self.wincap,
                        conditions={
                            "reel_weights": {
                                self.basegame_type: {"BASE": 1},
                                self.freegame_type: {"FREE": 1, "FREECAP": 5},
                            },
                            "scatter_triggers": {4: 1, 5: 2},
                            "force_wincap": True,
                            "force_freegame": True,
                        },
                    ),
                    Distribution(
                        criteria="freegame",
                        quota=0.12,
                        conditions={
                            "reel_weights": {
                                self.basegame_type: {"BASE": 1},
                                self.freegame_type: {"FREE": 1},
                            },
                            "scatter_triggers": {3: 50, 4: 30, 5: 10},
                            "force_wincap": False,
                            "force_freegame": True,
                        },
                    ),
                    Distribution(
                        criteria="0",
                        quota=0.45,
                        win_criteria=0.0,
                        conditions={
                            "reel_weights": {self.basegame_type: {"BASE": 1}},
                            "force_wincap": False,
                            "force_freegame": False,
                        },
                    ),
                    Distribution(
                        criteria="basegame",
                        quota=0.429,
                        conditions={
                            "reel_weights": {self.basegame_type: {"BASE": 1}},
                            "force_wincap": False,
                            "force_freegame": False,
                        },
                    ),
                ],
            ),
            BetMode(
                name="bonus",
                cost=100.0,
                rtp=self.rtp,
                max_win=self.wincap,
                auto_close_disabled=False,
                is_feature=False,
                is_buybonus=True,
                distributions=[
                    Distribution(
                        criteria="wincap",
                        quota=0.002,
                        win_criteria=self.wincap,
                        conditions={
                            "reel_weights": {
                                self.basegame_type: {"BASE": 1},
                                self.freegame_type: {"FREE": 1, "FREECAP": 5},
                            },
                            "scatter_triggers": {4: 2, 5: 3},
                            "force_wincap": True,
                            "force_freegame": True,
                        },
                    ),
                    Distribution(
                        criteria="freegame",
                        quota=0.998,
                        conditions={
                            "reel_weights": {
                                self.basegame_type: {"BASE": 1},
                                self.freegame_type: {"FREE": 1},
                            },
                            "scatter_triggers": {3: 30, 4: 15, 5: 5},
                            "force_wincap": False,
                            "force_freegame": True,
                        },
                    ),
                ],
            ),
        ]

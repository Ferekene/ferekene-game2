"""Optimization parameters for Golden Fortune Slots"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../math-sdk'))

from src.config.optimization_paramaters import OptimizationParameters


class GameOptimization(OptimizationParameters):
    """Optimization parameters for balancing game RTP"""

    def __init__(self, config):
        super().__init__(config)

        # Set optimization criteria weights
        self.rtp_weight = 1.0
        self.hit_rate_weight = 0.5
        self.avg_win_weight = 0.3

        # Tolerance for RTP convergence
        self.rtp_tolerance = 0.001  # 0.1% tolerance

        # Maximum iterations
        self.max_iterations = 1000

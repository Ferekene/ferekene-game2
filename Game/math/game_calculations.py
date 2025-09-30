"""Game-specific calculation methods for Golden Fortune Slots"""


class GameCalculations:
    """Custom calculations for Golden Fortune game mechanics"""

    def __init__(self):
        pass

    def calculate_wild_substitution(self, symbol):
        """
        Check if a symbol can be substituted by a wild

        Args:
            symbol: Symbol name to check

        Returns:
            bool: True if symbol can be substituted, False otherwise
        """
        if symbol in ["SCATTER"]:
            return False
        return True

    def apply_multiplier(self, win_amount, multipliers):
        """
        Apply multipliers to win amount
        In free game mode, wilds can have multipliers

        Args:
            win_amount: Base win amount
            multipliers: List of multiplier values

        Returns:
            float: Win amount with multipliers applied
        """
        if not multipliers:
            return win_amount

        total_multiplier = sum(multipliers)
        return win_amount * max(1, total_multiplier)

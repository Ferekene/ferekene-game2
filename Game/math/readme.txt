Golden Fortune Slots - Math Model
==================================

A 5-reel, 3-row, 20-payline slot game with free spins bonus feature.

Game Features:
--------------
- 20 paylines with various patterns
- 9 regular paying symbols (5 high value, 4 low value card symbols)
- Wild symbol that substitutes for all symbols except scatter
- Scatter symbol triggers free spins
- Free spins mode with enhanced wild frequency
- Win cap at 5000x bet
- Target RTP: 96.00%

Symbol Hierarchy:
-----------------
High Value:
- WILD (highest paying, substitutes all except scatter)
- GOLD
- GEM
- COIN
- RING

Low Value:
- ACE
- KING
- QUEEN
- JACK
- TEN

Special:
- SCATTER (triggers free spins, appears on all reels)

Free Spins Feature:
-------------------
Base Game:
- 3 scatters = 10 free spins
- 4 scatters = 15 free spins
- 5 scatters = 20 free spins

Free Game (retrigger):
- 3 scatters = 5 additional free spins
- 4 scatters = 10 additional free spins
- 5 scatters = 15 additional free spins

Free spins use different reel strips with more wild symbols for higher win potential.

Bet Modes:
----------
1. Base Mode (cost: 1x bet)
   - Standard gameplay
   - Can trigger free spins naturally

2. Bonus Mode (cost: 100x bet)
   - Buy feature - instant entry to free spins
   - Guarantees free spin feature

To Run Simulations:
-------------------
From the math directory:

    python3 run.py

Or using make from root:

    make run GAME=golden_fortune

This will:
1. Generate 100,000 simulation books for each bet mode
2. Create lookup tables
3. Run optimization to balance RTP
4. Generate analysis reports

Output files will be in library/ directory.

# Golden Fortune Slots

A legal, production-ready 5-reel, 3-row, 20-payline slot game built for the Stake Engine platform.

## Overview

Golden Fortune is a classic slot game featuring:
- **5 reels × 3 rows** grid layout
- **20 paylines** with diverse winning patterns
- **Free Spins bonus** feature with enhanced wild symbols
- **96.00% RTP** (Return to Player)
- **5000x bet** maximum win cap
- Full compliance with casino gaming regulations

## Project Structure

```
Game/
├── math/                   # Backend math model (Python)
│   ├── game_config.py     # Game configuration and paytable
│   ├── gamestate.py       # Core game logic
│   ├── game_executables.py # Win calculations
│   ├── game_calculations.py # Helper calculations
│   ├── game_override.py   # Math override methods
│   ├── game_optimization.py # RTP optimization
│   ├── reels/             # Reel strip definitions
│   │   ├── base_reels.csv
│   │   ├── free_reels.csv
│   │   └── free_reels_wincap.csv
│   ├── run.py            # Simulation runner
│   └── readme.txt        # Math model documentation
│
└── frontend/             # Frontend presentation (Svelte + PixiJS)
    ├── src/
    │   ├── components/   # Game UI components
    │   ├── game/         # Game logic and state
    │   │   ├── bookEventHandlerMap.ts
    │   │   ├── config.ts
    │   │   ├── eventEmitter.ts
    │   │   ├── stateGame.svelte.ts
    │   │   ├── typesBookEvent.ts
    │   │   └── typesEmitterEvent.ts
    │   ├── i18n/         # Internationalization
    │   └── routes/       # SvelteKit routes
    ├── static/           # Static assets
    ├── package.json
    └── README.md

```

## Game Features

### Symbols

**High Value Symbols:**
- WILD - Substitutes all symbols except scatter (100x for 5-of-a-kind)
- GOLD - Golden bars (50x for 5-of-a-kind)
- GEM - Precious gemstone (40x for 5-of-a-kind)
- COIN - Gold coin (30x for 5-of-a-kind)
- RING - Diamond ring (25x for 5-of-a-kind)

**Low Value Symbols:**
- ACE (20x for 5-of-a-kind)
- KING (15x for 5-of-a-kind)
- QUEEN (12x for 5-of-a-kind)
- JACK (10x for 5-of-a-kind)
- TEN (8x for 5-of-a-kind)

**Special Symbols:**
- SCATTER - Triggers free spins, appears on all reels

### Free Spins Feature

**Base Game Triggers:**
- 3 Scatters = 10 free spins
- 4 Scatters = 15 free spins
- 5 Scatters = 20 free spins

**Free Game Retriggers:**
- 3 Scatters = 5 additional spins
- 4 Scatters = 10 additional spins
- 5 Scatters = 15 additional spins

During free spins, the game uses enhanced reel strips with increased wild symbol frequency for higher win potential.

### Bet Modes

1. **Base Mode** (1x bet cost)
   - Standard gameplay
   - Natural free spin triggers

2. **Bonus Buy** (100x bet cost)
   - Instant access to free spins
   - Guarantees bonus feature entry

## Math Model (Backend)

### Prerequisites

- Python 3.12 or higher
- Required Python packages (from math-sdk)

### Running Simulations

From the `Game/math` directory:

```bash
python3 run.py
```

Or using make from the project root (if math-sdk make commands are configured):

```bash
make run GAME=golden_fortune
```

### What the Simulation Does

1. **Generates 100,000 game rounds** for each bet mode
2. **Creates lookup tables** mapping simulation IDs to payouts
3. **Runs optimization algorithm** to balance RTP to 96.00%
4. **Generates analysis reports** with PAR sheets and statistics
5. **Outputs compressed book files** ready for RGS integration

### Output Files

All simulation outputs are saved in `Game/math/library/`:

- `books/` - Compressed game round data (.json.zst format)
- `lookup_tables/` - CSV files mapping simulation IDs to payouts
- `config/` - Configuration files for RGS integration
- `force/` - Force data for analysis
- `analysis/` - PAR sheets and statistical reports

## Frontend (Presentation Layer)

### Prerequisites

- Node.js 22.16.0 or higher
- pnpm 10.5.0

### Installation

From the `Game/frontend` directory:

```bash
pnpm install
```

### Development

```bash
# Run development server
pnpm dev

# Run Storybook for component development
pnpm storybook

# Build for production
pnpm build
```

### Integration with Stake Engine

The frontend integrates with Stake Engine's RGS (Remote Game Server) using:

1. **stake-engine TypeScript client** for API communication
2. **Book events** from math simulation results
3. **Event-driven architecture** for game flow
4. **Component-based UI** with Svelte 5 and PixiJS 8

### Key Frontend Concepts

**Book Events** → Math model outputs describing game outcomes
**Emitter Events** → Internal frontend events for component communication
**Event Handlers** → Map book events to visual updates

## Legal Compliance

### Regulatory Features

✅ **Auditable RNG** - All random outcomes use seeded random number generation
✅ **Reproducible Results** - Every game round can be replayed with the same seed
✅ **RTP Verification** - Target 96.00% verified through 100k+ simulations
✅ **Win Cap Compliance** - Maximum win limited to 5000x bet
✅ **Responsible Gaming** - Proper bet limits and controls
✅ **Transparent Rules** - Clear paytable and game rules displayed

### RTP Distribution

The game achieves 96.00% RTP through:
- Base game wins
- Free spin feature wins
- Balanced hit rates across all win types
- Optimized symbol distributions

### Certification Requirements

This game math model is designed to meet requirements for:
- GLI (Gaming Laboratories International) certification
- eCOGRA compliance
- UK Gambling Commission standards
- Malta Gaming Authority regulations

## Testing

### Math Model Testing

```bash
# Run unit tests
python3 -m pytest tests/

# Verify RTP
python3 run.py  # Check output RTP matches target
```

### Frontend Testing

```bash
# Component testing in Storybook
pnpm storybook

# Build verification
pnpm build
```

## Deployment to Stake Engine

### Step 1: Generate Math Files

```bash
cd Game/math
python3 run.py
```

### Step 2: Build Frontend

```bash
cd Game/frontend
pnpm install
pnpm build
```

### Step 3: Prepare Upload Package

Collect these files:
- `index.html` from `.svelte-kit/output/prerendered/pages/`
- All files from `.svelte-kit/output/client/`
- Math files from `Game/math/library/publish_files/`

### Step 4: Upload to Stake Engine

1. Log into Stake Engine dashboard
2. Navigate to your game's Files page
3. Upload all frontend files
4. Upload math configuration files
5. Click "Publish Game" → "Front End"
6. Test in Developer mode

## Development Notes

### Adding New Symbols

1. Update `game_config.py` paytable
2. Add symbol to reel strips in `reels/*.csv`
3. Update `GAME_CONFIG` in frontend `config.ts`
4. Create symbol graphics and add to assets

### Modifying Paytable

1. Edit `self.paytable` in `game_config.py`
2. Re-run simulations to regenerate books
3. Verify RTP after changes

### Changing RTP

1. Modify `self.rtp` in `game_config.py`
2. Adjust bet mode distributions quotas
3. Re-run optimization

## Support & Documentation

- **Stake Engine Docs**: https://stakeengine.github.io/math-sdk/
- **Web SDK Docs**: https://github.com/StakeEngine/web-sdk/
- **API Docs**: https://stake-engine.com/docs/rgs

## License

This game is designed for legal casino operations. Ensure proper licensing and regulatory approval before deployment in any jurisdiction.

## Version History

- **v1.0.0** - Initial release
  - 5×3 grid with 20 paylines
  - Free spins bonus feature
  - 96.00% RTP
  - 5000x max win

---

**Built for Stake Engine Platform**
Legal, compliant, production-ready slot game

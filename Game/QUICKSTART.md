# Golden Fortune Slots - Quick Start Guide

Get up and running with Golden Fortune Slots in minutes.

---

## Prerequisites

### For Math Model (Backend)
- Python 3.12 or higher
- Access to the `math-sdk` folder (located at `../../math-sdk` relative to Game/math)

### For Frontend
- Node.js 22.16.0 or higher
- pnpm 10.5.0

---

## Step 1: Test the Math Model

```bash
# Navigate to math directory
cd Game/math

# Run a small test simulation (will use defaults from run.py)
python3 run.py
```

This will:
- Generate game simulation books
- Create lookup tables
- Output results to `library/` folder

**Expected Output:**
```
====================================================
Golden Fortune Slots - Simulation Run
Game ID: golden_fortune
RTP Target: 96.00%
Win Cap: 5000x
Base Simulations: 100,000
Bonus Simulations: 100,000
====================================================

Generating simulation books...
Thread 0 finished with X.XX RTP...
Thread 1 finished with X.XX RTP...
...
✓ Books generated successfully
✓ Configuration files generated
====================================================
```

**Note:** The first run generates 100,000 simulations which may take 5-10 minutes depending on your hardware.

### Quick Test (100 simulations)

To test faster, edit `run.py`:

```python
num_sim_args = {
    "base": 100,     # Change from int(1e5)
    "bonus": 100,    # Change from int(1e5)
}
```

Then run again. This completes in seconds.

---

## Step 2: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd Game/frontend

# Install dependencies
pnpm install
```

**Expected Output:**
```
Packages: +XXX
Progress: resolving XXX, resolved XXX...
Done in Xs
```

---

## Step 3: Run Frontend in Development

```bash
# Still in Game/frontend directory
pnpm dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

Open http://localhost:5173/ in your browser.

**Note:** You'll see an authentication error screen initially - this is expected without RGS connection.

---

## Step 4: View Components in Storybook

```bash
# In Game/frontend directory
pnpm storybook
```

**Expected Output:**
```
╭─────────────────────────────────────────────────╮
│                                                 │
│   Storybook 8.x.x for svelte-vite started      │
│   XXX ms for manager and XXX ms for preview    │
│                                                 │
│    Local:            http://localhost:6006/     │
│    On your network:  http://XXX.XXX.X.X:6006/  │
│                                                 │
╰─────────────────────────────────────────────────╯
```

Open http://localhost:6006/ to view and test components in isolation.

---

## Step 5: Build for Production

```bash
# In Game/frontend directory
pnpm build
```

**Expected Output:**
```
vite v5.x.x building for production...
✓ XXX modules transformed.
rendering pages...
✓ built in XXXs
```

Output files will be in:
- `.svelte-kit/output/prerendered/pages/index.html`
- `.svelte-kit/output/client/` (all assets)

---

## Understanding the Structure

### Math Model Output (`Game/math/library/`)

After running simulations:

```
library/
├── books/
│   ├── books_base.json.zst          ← Compressed game rounds
│   └── books_bonus.json.zst
├── lookup_tables/
│   ├── lookUpTable_base.csv         ← Simulation payouts
│   └── lookUpTable_bonus.csv
├── config/
│   ├── game_config.json             ← Game configuration
│   └── betmodes.json
└── force/
    └── force_record_base.json       ← Analysis data
```

### Frontend Structure (`Game/frontend/src/`)

```
src/
├── game/                            ← Core game logic
│   ├── bookEventHandlerMap.ts      ← RGS event handlers
│   ├── eventEmitter.ts             ← Event system
│   ├── stateGame.svelte.ts         ← Game state
│   ├── config.ts                   ← Constants
│   └── types*.ts                   ← TypeScript types
├── components/                      ← UI components (to create)
├── routes/                          ← SvelteKit routes (to create)
└── i18n/                           ← Translations (to create)
```

---

## Common Tasks

### Modify Paytable

1. Edit `Game/math/game_config.py`
2. Update `self.paytable` dictionary
3. Re-run simulations: `python3 run.py`

### Change RTP

1. Edit `Game/math/game_config.py`
2. Change `self.rtp = 0.96` to desired value
3. Adjust distribution quotas if needed
4. Re-run simulations and optimization

### Add New Symbol

1. Add to paytable in `game_config.py`
2. Add to reel strips in `reels/*.csv`
3. Update `GAME_CONFIG` in frontend `config.ts`
4. Create graphics and add to assets

### Test Individual Component

1. Create component in `src/components/`
2. Create story in `.storybook/stories/`
3. Run `pnpm storybook`
4. Test in browser

---

## Troubleshooting

### Math Model Issues

**Error: Module not found 'src.config.config'**
- Ensure you're running from `Game/math/` directory
- Check that `math-sdk` exists at `../../math-sdk`

**Error: No module named 'numpy'**
- Install math-sdk dependencies
- Follow math-sdk installation instructions

### Frontend Issues

**Error: Cannot find package 'stake-engine'**
- Run `pnpm install` in frontend directory
- Check package.json exists

**Blank page in browser**
- Check browser console for errors
- Verify dev server is running
- Try clearing browser cache

**Build fails**
- Ensure Node.js version 22.16.0+
- Delete `node_modules` and `.svelte-kit`
- Run `pnpm install` again
- Check for TypeScript errors

---

## Next Steps

Now that your environment is set up:

1. **Review Documentation**
   - Read `Game/README.md` for full overview
   - Read `Game/frontend/README.md` for frontend details
   - Check `IMPLEMENTATION_SUMMARY.md` for status

2. **Create Assets**
   - Design 11 symbol graphics
   - Create reel frame and background
   - Design UI elements
   - Prepare sounds

3. **Implement Components**
   - Start with `Board.svelte`
   - Create `Symbol.svelte`
   - Build `Reel.svelte`
   - Add UI components

4. **Integrate RGS**
   - Follow RGS integration guide
   - Test with Stake Engine dashboard
   - Verify balance updates
   - Test win calculations

5. **Test & Deploy**
   - Test in Storybook
   - Cross-browser testing
   - Mobile testing
   - Build for production
   - Upload to Stake Engine

---

## Useful Commands Reference

### Math Model
```bash
cd Game/math
python3 run.py                 # Run full simulation
python3 -m pytest tests/       # Run tests (if tests exist)
```

### Frontend
```bash
cd Game/frontend
pnpm install                   # Install dependencies
pnpm dev                       # Development server
pnpm storybook                # Component testing
pnpm build                    # Production build
pnpm preview                  # Preview production build
```

---

## Getting Help

- **Documentation**: See README files in each directory
- **Stake Engine Docs**: https://stakeengine.github.io/math-sdk/
- **Web SDK Examples**: Check `../../web-sdk/apps/` for reference implementations
- **API Reference**: https://stake-engine.com/docs/rgs

---

**You're all set!** 🎰

The foundation is complete. Start by creating your visual assets and implementing the UI components.

Good luck with your slot game development!

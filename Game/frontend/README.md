# Golden Fortune Slots - Frontend

Frontend presentation layer for Golden Fortune Slots, built with Svelte 5 and PixiJS 8.

## Quick Start

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Storybook for component development
pnpm storybook

# Build for production
pnpm build
```

## Architecture

### Event Flow

```
RGS API → Book Events → Event Handlers → Emitter Events → UI Components
```

1. **RGS API** returns game outcomes as book events
2. **Event Handlers** process book events and emit UI events
3. **UI Components** subscribe to emitter events and update visuals

### Key Files

- `src/game/bookEventHandlerMap.ts` - Maps RGS book events to UI events
- `src/game/eventEmitter.ts` - Event system for component communication
- `src/game/stateGame.svelte.ts` - Reactive game state
- `src/game/config.ts` - Game configuration constants
- `src/game/typesBookEvent.ts` - TypeScript types for RGS events
- `src/game/typesEmitterEvent.ts` - TypeScript types for UI events

## Book Events (from Math Model)

These events come from the RGS and describe game outcomes:

- `reveal` - Shows symbols on reels
- `winInfo` - Describes winning combinations
- `setWin` - Sets current win amount
- `setTotalWin` - Updates total win counter
- `finalWin` - Final win for the round
- `startFreeSpin` - Begins free spin mode
- `updateFreeSpin` - Updates free spin counter
- `endFreeSpin` - Ends free spin mode

## Emitter Events (Internal Frontend)

These events control UI components:

### Board Events
- `boardShow` - Show game board
- `boardHide` - Hide game board
- `boardReveal` - Display symbols with animation
- `boardSpin` - Start reel spin animation
- `boardSettle` - Stop reels on final symbols

### Win Events
- `winShow` - Highlight winning symbols
- `winHide` - Clear win highlights
- `winAmountUpdate` - Update win display

### Free Spin Events
- `freeSpinCounterShow` - Show free spin counter
- `freeSpinCounterHide` - Hide free spin counter
- `freeSpinCounterUpdate` - Update counter values
- `freeSpinIntroShow` - Show free spin intro screen
- `freeSpinIntroHide` - Hide free spin intro

### Sound Events
- `soundOnce` - Play sound effect once
- `soundMusic` - Play background music
- `soundLoop` - Loop sound effect
- `soundStop` - Stop specific sound

### UI Events
- `uiShow` - Show UI controls
- `uiHide` - Hide UI controls (e.g., during big win)

## Component Structure

Components should be organized as:

```
src/components/
├── Board.svelte          # Main game board container
├── Reel.svelte          # Individual reel component
├── Symbol.svelte        # Symbol display with animations
├── WinLines.svelte      # Win line highlighting
├── FreeSpinCounter.svelte # Free spin display
├── FreeSpinIntro.svelte  # Free spin intro screen
├── WinDisplay.svelte    # Win amount display
└── Game.svelte          # Main game container
```

Each component should:
1. Subscribe to relevant emitter events
2. Update local state based on events
3. Emit events when needed
4. Follow single responsibility principle

## State Management

Game state is managed through:

### `stateGame`
Reactive state object with:
- `board` - Current symbol grid
- `gameType` - 'basegame' or 'freegame'
- `currentWin` - Current spin win amount
- `totalWin` - Cumulative win amount
- `freeSpinCurrent` - Current free spin count
- `freeSpinTotal` - Total free spins awarded
- `isSpinning` - Spin in progress flag

### `stateGameDerived`
Computed properties:
- `isInFreeSpin()` - Check if in free spin mode
- `hasWin()` - Check if current spin has win
- `canSpin()` - Check if spin is allowed

## RGS Integration

### Authentication

```typescript
import { RGSClient } from 'stake-engine';

const rgsClient = RGSClient({
  url: window.location.href,
});

const auth = await rgsClient.Authenticate();
```

### Playing a Round

```typescript
const playResponse = await rgsClient.Play({
  amount: betAmount,
  mode: 'base', // or 'bonus'
});

// Process book events
playResponse.book.events.forEach(async (bookEvent) => {
  const handler = bookEventHandlerMap[bookEvent.type];
  if (handler) {
    await handler(bookEvent, { bookEvents: playResponse.book.events });
  }
});
```

### Ending a Round

```typescript
await rgsClient.EndRound();
```

### Balance Updates

```typescript
window.addEventListener('balanceUpdate', (event) => {
  const { amount, currency } = event.detail;
  // Update UI with new balance
});
```

## Styling Guidelines

- Use consistent spacing (8px grid system)
- Follow responsive design principles
- Support mobile, tablet, and desktop layouts
- Ensure sufficient color contrast for accessibility
- Avoid purple/violet hues unless specifically requested
- Use professional, premium styling

## Animation Guidelines

- Reel spin duration: ~1.5 seconds
- Symbol animations: ~0.5 seconds
- Win display: ~2 seconds minimum
- Use easing functions for smooth transitions
- Sequence animations appropriately
- Allow animations to complete before next event

## Sound Integration

Sounds should be integrated using Howler.js:

```typescript
import { Howl } from 'howler';

const sound = new Howl({
  src: ['sounds/sfx_win.mp3'],
  volume: 0.7,
});

sound.play();
```

Register sounds in `src/game/config.ts` and handle via sound events.

## Testing in Storybook

Create stories for:
1. Individual components with different states
2. Event sequences (e.g., reveal → win → settle)
3. Complete book playback
4. Edge cases and error states

Example story:

```typescript
import type { Meta, StoryObj } from '@storybook/svelte';
import Board from './Board.svelte';

const meta: Meta<Board> = {
  component: Board,
  title: 'Game/Board',
};

export default meta;

export const Default: StoryObj = {};
export const WithWin: StoryObj = {
  // Configure with winning board
};
```

## Build Process

The build process:
1. Compiles TypeScript to JavaScript
2. Bundles Svelte components
3. Optimizes assets
4. Generates static HTML
5. Creates production-ready bundle

Output location: `.svelte-kit/output/`

## Deployment Checklist

- [ ] All components tested in Storybook
- [ ] Game plays correctly in development
- [ ] RGS integration working
- [ ] Sounds loading and playing
- [ ] Responsive on all screen sizes
- [ ] Build completes without errors
- [ ] No console errors
- [ ] Balance updates correctly
- [ ] Win amounts calculate correctly
- [ ] Free spins trigger and display properly

## Troubleshooting

### Build Errors

Check:
- Node version (22.16.0)
- pnpm version (10.5.0)
- All dependencies installed
- No TypeScript errors

### RGS Connection Issues

Verify:
- Correct query parameters in URL
- Authentication successful
- Network requests completing
- CORS headers configured

### Event Not Firing

Debug:
- Check event type spelling
- Verify handler registered
- Console log in event handler
- Check event emitter subscriptions

## Performance Tips

- Lazy load assets
- Use sprite sheets for symbols
- Implement object pooling for particles
- Debounce rapid events
- Optimize animation frames
- Use web workers for heavy calculations

## Browser Support

Tested and supported:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Mobile browsers:
- iOS Safari 14+
- Chrome Android 90+

---

For issues or questions, refer to the main README.md or Stake Engine documentation.

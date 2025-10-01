<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Application, Container, Sprite, Graphics, Text } from 'pixi.js';
	import { assetLoader } from '../game/assetLoader';
	import { stateGame } from '../game/stateGame.svelte';
	import { eventEmitter } from '../game/eventEmitter';
	import { GAME_CONFIG } from '../game/config';
	import { getSymbolAssetName } from '../game/assets';
	import type { Symbol } from '../game/typesBookEvent';

	let canvasContainer: HTMLDivElement;
	let app: Application;
	let background: Container;
	let reelContainer: Container;
	let symbolSprites: Sprite[][] = [];
	let winLineGraphics: Graphics;

	const SYMBOL_WIDTH = 150;
	const SYMBOL_HEIGHT = 150;
	const REEL_SPACING = 10;

	onMount(async () => {
		try {
			if (!canvasContainer) {
				console.error('[GameCanvas] Canvas container not found');
				return;
			}

			// Initialize PixiJS
			console.log('[GameCanvas] Initializing PixiJS...');
			app = new Application();
			await app.init({
				width: window.innerWidth,
				height: window.innerHeight,
				backgroundColor: 0x1a1a2e,
				resolution: window.devicePixelRatio || 1,
				autoDensity: true,
			});

			if (app.canvas) {
				canvasContainer.appendChild(app.canvas as HTMLCanvasElement);
				console.log('[GameCanvas] Canvas mounted successfully');
			} else {
				console.error('[GameCanvas] Canvas element not created');
				return;
			}


			// Create layers
			background = new Container();
			app.stage.addChild(background);

			reelContainer = new Container();
			app.stage.addChild(reelContainer);

			winLineGraphics = new Graphics();
			app.stage.addChild(winLineGraphics);

			// Set up game board
			setupGameBoard();
			createBackground();

			// Listen to game events
			setupEventListeners();

			// Handle window resize
			window.addEventListener('resize', handleResize);
			handleResize();

			console.log('[GameCanvas] Initialization complete');
		} catch (error) {
			console.error('[GameCanvas] Failed to initialize:', error);
		}
	});

	onDestroy(() => {
		window.removeEventListener('resize', handleResize);
		if (app) {
			try {
				app.destroy(true, { children: true, texture: true });
				console.log('[GameCanvas] Destroyed successfully');
			} catch (error) {
				console.error('[GameCanvas] Error during destroy:', error);
			}
		}
	});

	function setupGameBoard() {
		const startX = (app.screen.width - (SYMBOL_WIDTH + REEL_SPACING) * GAME_CONFIG.reels) / 2;
		const startY = (app.screen.height - SYMBOL_HEIGHT * GAME_CONFIG.rows) / 2;

		for (let reel = 0; reel < GAME_CONFIG.reels; reel++) {
			symbolSprites[reel] = [];

			for (let row = 0; row < GAME_CONFIG.rows; row++) {
				const x = startX + reel * (SYMBOL_WIDTH + REEL_SPACING);
				const y = startY + row * SYMBOL_HEIGHT;

				// Create placeholder sprite
				const sprite = createSymbolSprite({ name: 'TEN' }, x, y);
				symbolSprites[reel][row] = sprite;
				reelContainer.addChild(sprite);
			}
		}
	}

	function createSymbolSprite(symbol: Symbol, x: number, y: number): Sprite {
		const assetName = getSymbolAssetName(symbol.name, 'normal');
		const texture = assetLoader.getTexture(assetName);

		const sprite = texture ? Sprite.from(texture) : new Sprite();

		sprite.width = SYMBOL_WIDTH;
		sprite.height = SYMBOL_HEIGHT;
		sprite.x = x;
		sprite.y = y;
		sprite.anchor.set(0);

		// Add subtle idle animation
		const baseY = y;
		let time = Math.random() * Math.PI * 2;

		app.ticker.add(() => {
			time += 0.02;
			sprite.y = baseY + Math.sin(time) * 2;
		});

		return sprite;
	}

	function createBackground() {
		// Create gradient background
		const bgGraphics = new Graphics();
		bgGraphics.rect(0, 0, app.screen.width, app.screen.height);
		bgGraphics.fill({ color: 0x1a1a2e });

		// Add golden glow effect
		const glowGraphics = new Graphics();
		const centerX = app.screen.width / 2;
		const centerY = app.screen.height / 2;
		glowGraphics.circle(centerX, centerY, 400);
		glowGraphics.fill({ color: 0xffd700, alpha: 0.05 });

		background.addChild(bgGraphics);
		background.addChild(glowGraphics);

		// Add animated stars
		for (let i = 0; i < 50; i++) {
			const star = new Graphics();
			const x = Math.random() * app.screen.width;
			const y = Math.random() * app.screen.height;
			const size = Math.random() * 2 + 1;

			star.circle(0, 0, size);
			star.fill({ color: 0xffffff, alpha: Math.random() * 0.5 + 0.3 });
			star.x = x;
			star.y = y;

			background.addChild(star);

			// Twinkle animation
			let alpha = star.alpha;
			let direction = Math.random() > 0.5 ? 1 : -1;

			app.ticker.add(() => {
				alpha += direction * 0.01;
				if (alpha > 0.8) {
					alpha = 0.8;
					direction = -1;
				} else if (alpha < 0.2) {
					alpha = 0.2;
					direction = 1;
				}
				star.alpha = alpha;
			});
		}
	}

	function setupEventListeners() {
		eventEmitter.subscribe('boardSettle', (event) => {
			updateBoard(event.board);
		});

		eventEmitter.subscribe('boardReveal', (event) => {
			updateBoard(event.board);
		});

		eventEmitter.subscribe('winShow', (event) => {
			drawWinLines(event.wins);
		});

		eventEmitter.subscribe('winHide', () => {
			winLineGraphics.clear();
		});

		eventEmitter.subscribe('boardSpin', () => {
			animateSpinStart();
		});
	}

	function updateBoard(board: Symbol[][]) {
		for (let reel = 0; reel < GAME_CONFIG.reels; reel++) {
			for (let row = 0; row < GAME_CONFIG.rows; row++) {
				if (board[reel] && board[reel][row]) {
					const symbol = board[reel][row];
					const sprite = symbolSprites[reel][row];

					const assetName = getSymbolAssetName(symbol.name, 'normal');
					const texture = assetLoader.getTexture(assetName);

					if (texture) {
						sprite.texture = texture;
					}
				}
			}
		}
	}

	function animateSpinStart() {
		// Add blur effect during spin
		symbolSprites.forEach((reelSprites) => {
			reelSprites.forEach((sprite) => {
				sprite.alpha = 0.7;
			});
		});

		// Restore after spin
		setTimeout(() => {
			symbolSprites.forEach((reelSprites) => {
				reelSprites.forEach((sprite) => {
					sprite.alpha = 1;
				});
			});
		}, 1500);
	}

	function drawWinLines(wins: any[]) {
		winLineGraphics.clear();

		wins.forEach((win, index) => {
			const color = 0xffd700;
			const delay = index * 100;

			setTimeout(() => {
				if (win.positions && win.positions.length > 0) {
					const positions = win.positions.map((pos: any) => {
						const sprite = symbolSprites[pos.reel]?.[pos.row];
						if (sprite) {
							return {
								x: sprite.x + SYMBOL_WIDTH / 2,
								y: sprite.y + SYMBOL_HEIGHT / 2,
							};
						}
						return null;
					}).filter(Boolean);

					if (positions.length > 1) {
						winLineGraphics.moveTo(positions[0].x, positions[0].y);
						winLineGraphics.lineStyle({ width: 4, color, alpha: 0.8 });

						for (let i = 1; i < positions.length; i++) {
							winLineGraphics.lineTo(positions[i].x, positions[i].y);
						}

						winLineGraphics.stroke();
					}
				}
			}, delay);
		});
	}

	function handleResize() {
		if (app) {
			app.renderer.resize(window.innerWidth, window.innerHeight);
			// Reposition elements on resize
			setupGameBoard();
			createBackground();
		}
	}
</script>

<div bind:this={canvasContainer} class="canvas-container"></div>

<style>
	.canvas-container {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>

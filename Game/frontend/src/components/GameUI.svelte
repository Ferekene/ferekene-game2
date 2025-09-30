<script lang="ts">
	import { stateGame, stateGameDerived } from '../game/stateGame.svelte';
	import { soundManager } from '../game/soundManager';
	import SpinButton from './SpinButton.svelte';
	import BalancePanel from './BalancePanel.svelte';
	import WinPanel from './WinPanel.svelte';
	import FreeSpinCounter from './FreeSpinCounter.svelte';
	import SettingsButton from './SettingsButton.svelte';

	let showSettings = $state(false);
	let showPaytable = $state(false);
</script>

<div class="game-ui">
	<!-- Top Bar -->
	<div class="top-bar">
		<div class="logo">
			<h2>Golden Fortune</h2>
		</div>

		<div class="top-controls">
			<SettingsButton onclick={() => (showSettings = !showSettings)} />
			<button class="btn-paytable" onclick={() => (showPaytable = !showPaytable)}>
				<span>💎</span>
			</button>
		</div>
	</div>

	<!-- Free Spin Counter -->
	{#if stateGameDerived.isInFreeSpin()}
		<FreeSpinCounter
			current={stateGame.freeSpinCurrent}
			total={stateGame.freeSpinTotal}
		/>
	{/if}

	<!-- Bottom Controls -->
	<div class="bottom-bar">
		<div class="control-panel">
			<BalancePanel balance={5000} />

			<div class="bet-controls">
				<button class="btn-bet-control">-</button>
				<div class="bet-display">
					<div class="bet-label">BET</div>
					<div class="bet-amount">$1.00</div>
				</div>
				<button class="btn-bet-control">+</button>
			</div>

			<SpinButton
				disabled={stateGame.isSpinning}
				onclick={() => {
					soundManager.playOnce('sfx_button');
					// Trigger spin via RGS
				}}
			/>

			<WinPanel win={stateGame.currentWin} />

			<div class="secondary-controls">
				<button class="btn-secondary" title="Auto Spin">
					<span>🔄</span>
				</button>
				<button class="btn-secondary" title="Turbo Mode">
					<span>⚡</span>
				</button>
			</div>
		</div>
	</div>

	<!-- Settings Modal -->
	{#if showSettings}
		<div class="modal-overlay" onclick={() => (showSettings = false)}>
			<div class="modal" onclick={(e) => e.stopPropagation()}>
				<div class="modal-header">
					<h3>Settings</h3>
					<button class="btn-close" onclick={() => (showSettings = false)}>×</button>
				</div>

				<div class="modal-content">
					<div class="setting-group">
						<label>Master Volume</label>
						<input
							type="range"
							min="0"
							max="100"
							value={soundManager.getVolume('master') * 100}
							oninput={(e) =>
								soundManager.setVolume('master', Number(e.currentTarget.value) / 100)}
						/>
					</div>

					<div class="setting-group">
						<label>Music Volume</label>
						<input
							type="range"
							min="0"
							max="100"
							value={soundManager.getVolume('music') * 100}
							oninput={(e) =>
								soundManager.setVolume('music', Number(e.currentTarget.value) / 100)}
						/>
					</div>

					<div class="setting-group">
						<label>SFX Volume</label>
						<input
							type="range"
							min="0"
							max="100"
							value={soundManager.getVolume('sfx') * 100}
							oninput={(e) =>
								soundManager.setVolume('sfx', Number(e.currentTarget.value) / 100)}
						/>
					</div>

					<div class="setting-group">
						<label>
							<input
								type="checkbox"
								checked={soundManager.isMuted('master')}
								onchange={(e) => soundManager.setMuted('master', e.currentTarget.checked)}
							/>
							Mute All Sounds
						</label>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Paytable Modal -->
	{#if showPaytable}
		<div class="modal-overlay" onclick={() => (showPaytable = false)}>
			<div class="modal paytable-modal" onclick={(e) => e.stopPropagation()}>
				<div class="modal-header">
					<h3>Paytable</h3>
					<button class="btn-close" onclick={() => (showPaytable = false)}>×</button>
				</div>

				<div class="modal-content paytable-content">
					<h4>High Value Symbols</h4>
					<div class="symbol-row">
						<span>WILD</span>
						<span>100x / 40x / 15x</span>
					</div>
					<div class="symbol-row">
						<span>GOLD</span>
						<span>50x / 20x / 8x</span>
					</div>
					<div class="symbol-row">
						<span>GEM</span>
						<span>40x / 15x / 6x</span>
					</div>
					<div class="symbol-row">
						<span>COIN</span>
						<span>30x / 10x / 4x</span>
					</div>
					<div class="symbol-row">
						<span>RING</span>
						<span>25x / 8x / 3x</span>
					</div>

					<h4>Low Value Symbols</h4>
					<div class="symbol-row">
						<span>ACE</span>
						<span>20x / 6x / 2x</span>
					</div>
					<div class="symbol-row">
						<span>KING</span>
						<span>15x / 4x / 1.5x</span>
					</div>
					<div class="symbol-row">
						<span>QUEEN</span>
						<span>12x / 3x / 1x</span>
					</div>
					<div class="symbol-row">
						<span>JACK</span>
						<span>10x / 2.5x / 0.8x</span>
					</div>
					<div class="symbol-row">
						<span>TEN</span>
						<span>8x / 2x / 0.5x</span>
					</div>

					<h4>Special Symbols</h4>
					<div class="symbol-row">
						<span>SCATTER</span>
						<span>Triggers Free Spins</span>
					</div>

					<div class="info-box">
						<p>3+ Scatters = 10 Free Spins</p>
						<p>4+ Scatters = 15 Free Spins</p>
						<p>5+ Scatters = 20 Free Spins</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.game-ui {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 10;
	}

	.game-ui > * {
		pointer-events: auto;
	}

	.top-bar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
	}

	.logo h2 {
		margin: 0;
		color: #ffd700;
		font-size: 1.8rem;
		text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
	}

	.top-controls {
		display: flex;
		gap: 1rem;
	}

	.btn-paytable {
		padding: 0.5rem 1rem;
		background: rgba(255, 215, 0, 0.2);
		border: 2px solid #ffd700;
		border-radius: 8px;
		color: #ffd700;
		font-size: 1.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-paytable:hover {
		background: rgba(255, 215, 0, 0.4);
		transform: scale(1.05);
	}

	.bottom-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 1rem 2rem;
		background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
	}

	.control-panel {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1400px;
		margin: 0 auto;
		gap: 2rem;
	}

	.bet-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.btn-bet-control {
		width: 50px;
		height: 50px;
		background: rgba(255, 215, 0, 0.2);
		border: 2px solid #ffd700;
		border-radius: 50%;
		color: #ffd700;
		font-size: 1.5rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-bet-control:hover {
		background: rgba(255, 215, 0, 0.4);
		transform: scale(1.1);
	}

	.bet-display {
		text-align: center;
		padding: 0.5rem 2rem;
		background: rgba(0, 0, 0, 0.6);
		border: 2px solid #ffd700;
		border-radius: 8px;
	}

	.bet-label {
		font-size: 0.8rem;
		color: #ffd700;
		opacity: 0.8;
	}

	.bet-amount {
		font-size: 1.2rem;
		color: #fff;
		font-weight: bold;
	}

	.secondary-controls {
		display: flex;
		gap: 1rem;
	}

	.btn-secondary {
		width: 50px;
		height: 50px;
		background: rgba(255, 255, 255, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 8px;
		color: #fff;
		font-size: 1.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: scale(1.05);
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		border: 3px solid #ffd700;
		border-radius: 15px;
		max-width: 600px;
		width: 90%;
		max-height: 80vh;
		overflow-y: auto;
		box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 2rem;
		border-bottom: 2px solid #ffd700;
	}

	.modal-header h3 {
		margin: 0;
		color: #ffd700;
		font-size: 1.5rem;
	}

	.btn-close {
		background: none;
		border: none;
		color: #ffd700;
		font-size: 2rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-close:hover {
		transform: scale(1.2);
		color: #ffed4e;
	}

	.modal-content {
		padding: 2rem;
	}

	.setting-group {
		margin-bottom: 1.5rem;
	}

	.setting-group label {
		display: block;
		color: #fff;
		margin-bottom: 0.5rem;
	}

	.setting-group input[type='range'] {
		width: 100%;
		height: 8px;
		background: rgba(255, 215, 0, 0.2);
		border-radius: 4px;
		outline: none;
	}

	.setting-group input[type='range']::-webkit-slider-thumb {
		width: 20px;
		height: 20px;
		background: #ffd700;
		border-radius: 50%;
		cursor: pointer;
	}

	.paytable-content h4 {
		color: #ffd700;
		margin: 1.5rem 0 1rem 0;
	}

	.symbol-row {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem;
		color: #fff;
		border-bottom: 1px solid rgba(255, 215, 0, 0.2);
	}

	.info-box {
		margin-top: 1.5rem;
		padding: 1rem;
		background: rgba(255, 215, 0, 0.1);
		border: 1px solid #ffd700;
		border-radius: 8px;
	}

	.info-box p {
		margin: 0.5rem 0;
		color: #fff;
	}
</style>

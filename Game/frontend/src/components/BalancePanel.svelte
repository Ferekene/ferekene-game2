<script lang="ts">
	interface Props {
		balance: number;
	}

	let { balance }: Props = $props();

	function formatCurrency(amount: number): string {
		return `$${amount.toFixed(2)}`;
	}
</script>

<div class="balance-panel">
	<div class="panel-label">BALANCE</div>
	<div class="panel-value">{formatCurrency(balance)}</div>
</div>

<style>
	.balance-panel {
		padding: 1rem 2rem;
		background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(26, 26, 46, 0.8) 100%);
		border: 2px solid #ffd700;
		border-radius: 10px;
		text-align: center;
		min-width: 150px;
		box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
	}

	.panel-label {
		font-size: 0.8rem;
		color: #ffd700;
		opacity: 0.8;
		margin-bottom: 0.3rem;
		letter-spacing: 1px;
	}

	.panel-value {
		font-size: 1.5rem;
		color: #fff;
		font-weight: bold;
		text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
	}
</style>

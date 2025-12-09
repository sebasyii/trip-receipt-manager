<script lang="ts">
	import ReceiptCard from './ReceiptCard.svelte';
	import { groupReceiptsByDate, formatDate } from '$lib/utils/date';
	import type { Receipt } from '$lib/types';

	interface Props {
		receipts: Receipt[];
	}

	let { receipts }: Props = $props();

	let grouped = $derived(groupReceiptsByDate(receipts));
	let sortedDates = $derived(
		Array.from(grouped.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
	);

	let totalAmount = $derived(
		receipts.reduce((sum, r) => sum + (r.amount ?? 0), 0)
	);
</script>

{#if receipts.length === 0}
	<div class="text-center py-12 space-y-2">
		<p class="text-lg text-muted-foreground">No receipts yet</p>
		<p class="text-sm text-muted-foreground">Add your first receipt to get started tracking expenses!</p>
	</div>
{:else}
	<div class="space-y-8">
		<!-- Summary -->
		<div class="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
			<div>
				<p class="text-sm text-muted-foreground">Total Receipts</p>
				<p class="text-2xl font-bold">{receipts.length}</p>
			</div>
			<div class="text-right">
				<p class="text-sm text-muted-foreground">Total Amount</p>
				<p class="text-2xl font-bold">
					${totalAmount.toFixed(2)}
				</p>
			</div>
		</div>

		<!-- Grouped receipts -->
		{#each sortedDates as date (date)}
			<section class="space-y-4">
				<h3 class="text-lg font-semibold sticky top-16 bg-background/95 backdrop-blur py-2 z-10">
					{formatDate(date)}
				</h3>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each grouped.get(date) || [] as receipt (receipt.id)}
						<ReceiptCard {receipt} />
					{/each}
				</div>
			</section>
		{/each}
	</div>
{/if}

<script lang="ts">
	import ReceiptCard from "./ReceiptCard.svelte";
	import { groupReceiptsByDate, formatDate } from "$lib/utils/date";
	import type { Receipt } from "$lib/types";

	let { receipts }: { receipts: Receipt[] } = $props();

	let grouped = $derived(groupReceiptsByDate(receipts));
	let sortedDates = $derived(Array.from(grouped.keys()).sort((a, b) => 
		new Date(b).getTime() - new Date(a).getTime()
	));
</script>

{#if receipts.length === 0}
	<div class="text-center py-12">
		<p class="text-muted-foreground">No receipts yet. Add your first receipt!</p>
	</div>
{:else}
	<div class="space-y-8">
		{#each sortedDates as date}
			<div class="space-y-4">
				<h3 class="text-lg font-semibold">{formatDate(date)}</h3>
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each grouped.get(date) || [] as receipt (receipt.id)}
						<ReceiptCard {receipt} />
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}


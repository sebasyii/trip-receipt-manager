<script lang="ts">
	import { Card, CardContent } from "$lib/components/ui/card";
	import { formatDateShort, formatCurrency } from "$lib/utils/date";
	import type { Receipt } from "$lib/types";
	import { supabase } from "$lib/utils/supabase";

	let { receipt }: { receipt: Receipt } = $props();

	let imageUrl = $state<string | null>(null);

	async function loadImage() {
		if (receipt.file_path && receipt.mime_type?.startsWith('image/')) {
			const { data } = supabase.storage
				.from('receipts')
				.getPublicUrl(receipt.file_path);
			
			if (data?.publicUrl) {
				imageUrl = data.publicUrl;
			}
		}
	}

	$effect(() => {
		loadImage();
	});
</script>

<Card>
	<CardContent class="p-4">
		<div class="space-y-3">
			{#if imageUrl}
				<img
					src={imageUrl}
					alt={receipt.description}
					class="w-full h-48 object-cover rounded-md"
				/>
			{:else if receipt.mime_type === 'application/pdf'}
				<div class="w-full h-48 bg-muted rounded-md flex items-center justify-center">
					<svg
						class="w-12 h-12 text-muted-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
						/>
					</svg>
				</div>
			{/if}
			
			<div class="space-y-1">
				<p class="text-sm font-medium">{receipt.description}</p>
				<div class="flex items-center justify-between text-xs text-muted-foreground">
					<span>{formatDateShort(receipt.date)}</span>
					{#if receipt.amount}
						<span class="font-medium">{formatCurrency(receipt.amount, receipt.currency)}</span>
					{/if}
				</div>
			</div>
		</div>
	</CardContent>
</Card>


<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { formatDateShort, formatCurrency } from '$lib/utils/date';
	import type { Receipt } from '$lib/types';
	import { supabase } from '$lib/utils/supabase';
	import FileText from '@lucide/svelte/icons/file-text';
	import ImageIcon from '@lucide/svelte/icons/image';

	interface Props {
		receipt: Receipt;
	}

	let { receipt }: Props = $props();

	let imageUrl = $state<string | null>(null);
	let imageError = $state(false);

	$effect(() => {
		loadImage();
	});

	async function loadImage() {
		if (receipt.file_path && receipt.mime_type?.startsWith('image/')) {
			const { data } = supabase.storage.from('receipts').getPublicUrl(receipt.file_path);

			if (data?.publicUrl) {
				imageUrl = data.publicUrl;
			}
		}
	}

	function handleImageError() {
		imageError = true;
	}
</script>

<Card class="overflow-hidden hover:shadow-md transition-shadow">
	<CardContent class="p-0">
		<div class="aspect-[4/3] relative bg-muted">
			{#if imageUrl && !imageError}
				<img
					src={imageUrl}
					alt={receipt.description}
					class="w-full h-full object-cover"
					onerror={handleImageError}
				/>
			{:else if receipt.mime_type === 'application/pdf'}
				<div class="w-full h-full flex flex-col items-center justify-center gap-2">
					<FileText class="w-12 h-12 text-muted-foreground" />
					<span class="text-xs text-muted-foreground">PDF Document</span>
				</div>
			{:else}
				<div class="w-full h-full flex flex-col items-center justify-center gap-2">
					<ImageIcon class="w-12 h-12 text-muted-foreground" />
					<span class="text-xs text-muted-foreground">No preview</span>
				</div>
			{/if}
		</div>

		<div class="p-4 space-y-2">
			<p class="text-sm font-medium line-clamp-2">{receipt.description}</p>
			<div class="flex items-center justify-between text-xs text-muted-foreground">
				<span>{formatDateShort(receipt.date)}</span>
				{#if receipt.amount !== null}
					<span class="font-semibold text-foreground">
						{formatCurrency(receipt.amount, receipt.currency)}
					</span>
				{/if}
			</div>
		</div>
	</CardContent>
</Card>

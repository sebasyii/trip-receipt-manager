<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ReceiptList from '$lib/components/ReceiptList.svelte';
	import { formatDateShort } from '$lib/utils/date';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	let { data } = $props();

	let trip = $derived(data.trip);
	let showDeleteConfirm = $state(false);
	let deleting = $state(false);
</script>

<div class="container mx-auto py-8 px-4">
	<div class="space-y-6">
		<div class="flex justify-between items-start">
			<div>
				<h1 class="text-3xl font-bold mb-2">{trip.name}</h1>
				<p class="text-muted-foreground">
					{formatDateShort(trip.start_date)}
					{#if trip.end_date}
						- {formatDateShort(trip.end_date)}
					{/if}
				</p>
				{#if trip.description}
					<p class="mt-2">{trip.description}</p>
				{/if}
			</div>
			<div class="flex gap-2 flex-wrap">
				<Button onclick={() => goto(`/trips/${trip.id}/receipts/new`)}>Add Receipt</Button>
				<Button variant="outline" onclick={() => goto(`/trips/${trip.id}/edit`)}>Edit Trip</Button>
				<Button variant="destructive" onclick={() => (showDeleteConfirm = true)}>
					Delete Trip
				</Button>
				<Button variant="outline" onclick={() => goto('/')}>Back to Trips</Button>
			</div>
		</div>

		{#if showDeleteConfirm}
			<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
				<div class="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
					<h2 class="text-xl font-bold mb-4">Delete Trip?</h2>
					<p class="text-muted-foreground mb-6">
						Are you sure you want to delete "{trip.name}"? This will also delete all
						{trip.receipts?.length || 0} receipt(s) associated with this trip. This action cannot be
						undone.
					</p>
					<div class="flex gap-2 justify-end">
						<Button variant="outline" onclick={() => (showDeleteConfirm = false)} disabled={deleting}>
							Cancel
						</Button>
						<form
							method="POST"
							action="?/delete"
							use:enhance={() => {
								deleting = true;
								return async ({ update }) => {
									await update();
									deleting = false;
								};
							}}
							class="inline"
						>
							<Button type="submit" variant="destructive" disabled={deleting}>
								{deleting ? 'Deleting...' : 'Delete Trip'}
							</Button>
						</form>
					</div>
				</div>
			</div>
		{/if}

		<div>
			<h2 class="text-2xl font-semibold mb-4">Receipts</h2>
			<ReceiptList receipts={trip.receipts || []} />
		</div>
	</div>
</div>

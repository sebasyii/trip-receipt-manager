<script lang="ts">
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import ReceiptList from "$lib/components/ReceiptList.svelte";
	import { currentTrip, loadTripWithReceipts, loading } from "$lib/stores/trips";
	import { formatDateShort } from "$lib/utils/date";
	import { goto } from "$app/navigation";

	let tripId = $derived($page.params.id);

	onMount(() => {
		if (tripId) {
			loadTripWithReceipts(tripId);
		}
	});

	let trip = $derived($currentTrip);
</script>

<div class="container mx-auto py-8 px-4">
	{#if $loading}
		<div class="flex justify-center items-center py-12">
			<p class="text-muted-foreground">Loading trip...</p>
		</div>
	{:else if trip}
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
				<div class="flex gap-2">
					<Button onclick={() => goto(`/trips/${tripId}/receipts/new`)}>
						Add Receipt
					</Button>
					<Button variant="outline" onclick={() => goto("/")}>
						Back to Trips
					</Button>
				</div>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-4">Receipts</h2>
				<ReceiptList receipts={trip.receipts || []} />
			</div>
		</div>
	{:else}
		<div class="text-center py-12">
			<p class="text-muted-foreground">Trip not found</p>
			<Button class="mt-4" onclick={() => goto("/")}>Back to Trips</Button>
		</div>
	{/if}
</div>


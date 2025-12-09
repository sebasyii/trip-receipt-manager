<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { trips, loading } from "$lib/stores/trips";
	import { formatDateShort } from "$lib/utils/date";
	import { goto } from "$app/navigation";

	let tripList = $derived($trips);
</script>

{#if $loading}
	<div class="flex justify-center items-center py-12">
		<p class="text-muted-foreground">Loading trips...</p>
	</div>
{:else if tripList.length === 0}
	<div class="text-center py-12 space-y-4">
		<p class="text-muted-foreground">No trips yet. Create your first trip to get started!</p>
		<Button onclick={() => goto("/trips/new")}>Create Trip</Button>
	</div>
{:else}
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each tripList as trip (trip.id)}
			<Card class="cursor-pointer hover:shadow-md transition-shadow" onclick={() => goto(`/trips/${trip.id}`)}>
				<CardHeader>
					<CardTitle>{trip.name}</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-2">
						<p class="text-sm text-muted-foreground">
							{formatDateShort(trip.start_date)}
							{#if trip.end_date}
								- {formatDateShort(trip.end_date)}
							{/if}
						</p>
						{#if trip.description}
							<p class="text-sm line-clamp-2">{trip.description}</p>
						{/if}
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>
{/if}


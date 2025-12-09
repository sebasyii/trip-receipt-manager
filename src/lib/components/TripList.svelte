<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { formatDateShort } from '$lib/utils/date';
	import { goto } from '$app/navigation';
	import { deleteTrip } from '$lib/stores/trips';
	import type { Trip } from '$lib/types';
	import { invalidateAll } from '$app/navigation';

	let { trips }: { trips: Trip[] } = $props();

	let deletingId = $state<string | null>(null);
	let confirmDeleteId = $state<string | null>(null);

	async function handleDelete(tripId: string) {
		deletingId = tripId;
		try {
			await deleteTrip(tripId);
			await invalidateAll();
			confirmDeleteId = null;
		} catch (error) {
			console.error('Failed to delete trip:', error);
			alert('Failed to delete trip. Please try again.');
		} finally {
			deletingId = null;
		}
	}
</script>

{#if trips.length === 0}
	<div class="text-center py-12 space-y-4">
		<p class="text-muted-foreground">No trips yet. Create your first trip to get started!</p>
		<Button onclick={() => goto('/trips/new')}>Create Trip</Button>
	</div>
{:else}
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each trips as trip (trip.id)}
			<Card class="hover:shadow-md transition-shadow relative group">
				<button
					onclick={() => goto(`/trips/${trip.id}`)}
					class="cursor-pointer w-full text-left bg-transparent border-0 p-0"
				>
					<CardHeader>
						<CardTitle class="pr-8">{trip.name}</CardTitle>
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
				</button>
				<div class="absolute top-3 right-3">
					<Button
						variant="ghost"
						size="sm"
						class="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
						onclick={(e) => {
							e.stopPropagation();
							confirmDeleteId = trip.id;
						}}
						disabled={deletingId === trip.id}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M3 6h18" />
							<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
							<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
						</svg>
					</Button>
				</div>
			</Card>
		{/each}
	</div>

	{#if confirmDeleteId}
		{@const trip = trips.find((t) => t.id === confirmDeleteId)}
		<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div class="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
				<h2 class="text-xl font-bold mb-4">Delete Trip?</h2>
				<p class="text-muted-foreground mb-6">
					Are you sure you want to delete "{trip?.name}"? This will also delete all receipts
					associated with this trip. This action cannot be undone.
				</p>
				<div class="flex gap-2 justify-end">
					<Button
						variant="outline"
						onclick={() => (confirmDeleteId = null)}
						disabled={deletingId !== null}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onclick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
						disabled={deletingId !== null}
					>
						{deletingId ? 'Deleting...' : 'Delete Trip'}
					</Button>
				</div>
			</div>
		</div>
	{/if}
{/if}

<script lang="ts">
	import TripList from '$lib/components/TripList.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { goto } from '$app/navigation';

	let { data } = $props();
</script>

<div class="container mx-auto py-8 px-4">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-3xl font-bold">My Trips</h1>
		<Button onclick={() => goto('/trips/new')}>New Trip</Button>
	</div>

	{#await data.streamed.tripsData}
		<div class="flex justify-center items-center py-12">
			<Spinner size="lg" />
		</div>
	{:then result}
		{#if result.error}
			<div class="p-4 text-sm text-destructive bg-destructive/10 rounded-md mb-4">
				{result.error}
			</div>
		{/if}
		<TripList trips={result.trips} />
	{:catch error}
		<div class="p-4 text-sm text-destructive bg-destructive/10 rounded-md mb-4">
			Failed to load trips: {error.message}
		</div>
	{/await}
</div>

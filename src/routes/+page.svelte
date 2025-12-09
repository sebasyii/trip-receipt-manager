<script lang="ts">
	import TripList from '$lib/components/TripList.svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	let { data } = $props();
</script>

<div class="container mx-auto py-8 px-4">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-3xl font-bold">My Trips</h1>
		<Button onclick={() => goto('/trips/new')}>New Trip</Button>
	</div>

	{#if data.error}
		<div class="p-4 text-sm text-destructive bg-destructive/10 rounded-md mb-4">
			{data.error}
		</div>
	{/if}

	<TripList trips={data.trips} />
</div>

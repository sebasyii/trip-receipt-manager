<script lang="ts">
	import TripList from "$lib/components/TripList.svelte";
	import { Button } from "$lib/components/ui/button";
	import { loadTrips } from "$lib/stores/trips";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	onMount(() => {
		loadTrips();
	});
</script>

<div class="container mx-auto py-8 px-4">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-3xl font-bold">My Trips</h1>
		<Button onclick={() => goto("/trips/new")}>New Trip</Button>
	</div>
	
	<TripList />
</div>

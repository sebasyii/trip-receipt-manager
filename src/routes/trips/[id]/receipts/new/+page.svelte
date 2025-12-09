<script lang="ts">
	import ReceiptForm from '$lib/components/ReceiptForm.svelte';

	let { data } = $props();
</script>

<div class="container mx-auto py-8 px-4 max-w-2xl">
	<ReceiptForm tripId={data.tripId} tripName={data.tripName} />
</div>

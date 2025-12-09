<script lang="ts">
	import { page } from "$app/stores";
	import ReceiptForm from "$lib/components/ReceiptForm.svelte";

	let tripId = $derived($page.params.id);
</script>

<div class="container mx-auto py-8 px-4 max-w-2xl">
	{#if tripId}
		<ReceiptForm {tripId} />
	{/if}
</div>


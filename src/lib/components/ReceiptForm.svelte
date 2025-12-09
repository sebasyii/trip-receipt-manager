<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import FileUpload from "./FileUpload.svelte";
	import { createReceipt } from "$lib/stores/trips";
	import { supabase } from "$lib/utils/supabase";
	import { goto } from "$app/navigation";

	let {
		tripId
	}: {
		tripId: string;
	} = $props();

	let date = $state(new Date().toISOString().split('T')[0]);
	let description = $state("");
	let amount = $state("");
	let currency = $state("USD");
	let file = $state<File | null>(null);
	let submitting = $state(false);
	let error = $state<string | null>(null);

	async function handleSubmit() {
		if (!description || !date) {
			error = "Description and date are required";
			return;
		}

		if (!file) {
			error = "Please upload a receipt file";
			return;
		}

		submitting = true;
		error = null;

		try {
			// Upload file to Supabase storage
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const fileExt = file.name.split('.').pop();
			const fileName = `${user.id}/${tripId}/${Date.now()}.${fileExt}`;
			
			const { error: uploadError } = await supabase.storage
				.from('receipts')
				.upload(fileName, file);

			if (uploadError) throw uploadError;

			// Create receipt record
			await createReceipt({
				trip_id: tripId,
				date,
				description,
				amount: amount ? parseFloat(amount) : null,
				currency,
				file_path: fileName,
				file_name: file.name,
				mime_type: file.type
			});

			goto(`/trips/${tripId}`);
		} catch (e) {
			error = e instanceof Error ? e.message : "Failed to create receipt";
		} finally {
			submitting = false;
		}
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>Add Receipt</CardTitle>
	</CardHeader>
	<CardContent>
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
			{#if error}
				<div class="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
					{error}
				</div>
			{/if}

			<div class="space-y-2">
				<Label for="date">Date *</Label>
				<Input
					id="date"
					type="date"
					bind:value={date}
					required
				/>
			</div>

			<div class="space-y-2">
				<Label for="description">Description *</Label>
				<Textarea
					id="description"
					bind:value={description}
					placeholder="What is this receipt for?"
					rows={3}
					required
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="amount">Amount</Label>
					<Input
						id="amount"
						type="number"
						step="0.01"
						bind:value={amount}
						placeholder="0.00"
					/>
				</div>
				<div class="space-y-2">
					<Label for="currency">Currency</Label>
					<Input
						id="currency"
						bind:value={currency}
						placeholder="USD"
					/>
				</div>
			</div>

			<div class="space-y-2">
				<Label>Receipt File *</Label>
				<FileUpload bind:file />
			</div>

			<div class="flex gap-2">
				<Button type="submit" disabled={submitting}>
					{submitting ? "Adding..." : "Add Receipt"}
				</Button>
				<Button type="button" variant="outline" onclick={() => goto(`/trips/${tripId}`)}>
					Cancel
				</Button>
			</div>
		</form>
	</CardContent>
</Card>


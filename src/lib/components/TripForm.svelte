<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { createTrip } from "$lib/stores/trips";
	import { goto } from "$app/navigation";

	let name = $state("");
	let startDate = $state("");
	let endDate = $state("");
	let description = $state("");
	let submitting = $state(false);
	let error = $state<string | null>(null);

	async function handleSubmit() {
		if (!name || !startDate) {
			error = "Name and start date are required";
			return;
		}

		submitting = true;
		error = null;

		try {
			const trip = await createTrip({
				name,
				start_date: startDate,
				end_date: endDate || null,
				description: description || null
			});
			
			goto(`/trips/${trip.id}`);
		} catch (e) {
			error = e instanceof Error ? e.message : "Failed to create trip";
		} finally {
			submitting = false;
		}
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>Create New Trip</CardTitle>
	</CardHeader>
	<CardContent>
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
			{#if error}
				<div class="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
					{error}
				</div>
			{/if}

			<div class="space-y-2">
				<Label for="name">Trip Name *</Label>
				<Input
					id="name"
					bind:value={name}
					placeholder="e.g., Summer Vacation 2024"
					required
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="start-date">Start Date *</Label>
					<Input
						id="start-date"
						type="date"
						bind:value={startDate}
						required
					/>
				</div>
				<div class="space-y-2">
					<Label for="end-date">End Date</Label>
					<Input
						id="end-date"
						type="date"
						bind:value={endDate}
					/>
				</div>
			</div>

			<div class="space-y-2">
				<Label for="description">Description</Label>
				<Textarea
					id="description"
					bind:value={description}
					placeholder="Optional trip description..."
					rows={3}
				/>
			</div>

			<div class="flex gap-2">
				<Button type="submit" disabled={submitting}>
					{submitting ? "Creating..." : "Create Trip"}
				</Button>
				<Button type="button" variant="outline" onclick={() => goto("/")}>
					Cancel
				</Button>
			</div>
		</form>
	</CardContent>
</Card>


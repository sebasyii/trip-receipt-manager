<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data, form } = $props();

	let submitting = $state(false);

	// Format date for input (YYYY-MM-DD)
	const formatDateForInput = (dateStr: string) => {
		if (!dateStr) return '';
		return dateStr.split('T')[0];
	};
</script>

<div class="container mx-auto py-8 px-4 max-w-2xl">
	<Card>
		<CardHeader>
			<CardTitle>Edit Trip</CardTitle>
		</CardHeader>
		<CardContent>
			<form
				method="POST"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						submitting = false;
						await update();
					};
				}}
				class="space-y-4"
			>
				{#if form?.error}
					<div class="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
						{form.error}
					</div>
				{/if}

				<div class="space-y-2">
					<Label for="name">Trip Name *</Label>
					<Input
						id="name"
						name="name"
						value={form?.name ?? data.trip.name}
						placeholder="e.g., Summer Vacation 2024"
						required
					/>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="space-y-2">
						<Label for="startDate">Start Date *</Label>
						<Input
							id="startDate"
							name="startDate"
							type="date"
							value={form?.startDate ?? formatDateForInput(data.trip.start_date)}
							required
						/>
					</div>
					<div class="space-y-2">
						<Label for="endDate">End Date</Label>
						<Input
							id="endDate"
							name="endDate"
							type="date"
							value={form?.endDate ?? formatDateForInput(data.trip.end_date ?? '')}
						/>
					</div>
				</div>

				<div class="space-y-2">
					<Label for="description">Description</Label>
					<Textarea
						id="description"
						name="description"
						value={form?.description ?? data.trip.description ?? ''}
						placeholder="Optional trip description..."
						rows={3}
					/>
				</div>

				<div class="flex gap-2 pt-2">
					<Button type="submit" disabled={submitting}>
						{submitting ? 'Saving...' : 'Save Changes'}
					</Button>
					<Button
						type="button"
						variant="outline"
						onclick={() => goto(`/trips/${data.trip.id}`)}
					>
						Cancel
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>

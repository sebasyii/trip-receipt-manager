<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import FileUpload from './FileUpload.svelte';
	import { getContext } from 'svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { goto, invalidateAll } from '$app/navigation';
	import type { ParsedReceiptData } from '$lib/types/receipt-parse';

	// Get supabase client from context (set in +layout.svelte)
	const supabase = getContext<SupabaseClient>('supabase');

	interface Props {
		tripId: string;
		tripName?: string;
	}

	let { tripId, tripName }: Props = $props();

	// Step management
	type Step = 'upload' | 'review' | 'saving';
	let step = $state<Step>('upload');

	// Form data
	let date = $state(new Date().toISOString().split('T')[0]);
	let description = $state('');
	let amount = $state('');
	let currency = $state('USD');
	let file = $state<File | null>(null);
	let imagePreview = $state<string | null>(null);

	// State
	let analyzing = $state(false);
	let submitting = $state(false);
	let error = $state<string | null>(null);

	async function analyzeReceipt() {
		if (!file) {
			error = 'Please upload a receipt first';
			return;
		}

		analyzing = true;
		error = null;

		try {
			// Convert file to base64
			const base64Image = await readFileAsDataURL(file);

			// Call API to parse receipt
			const response = await fetch('/api/parse-receipt', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ image: base64Image })
			});

			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || 'Failed to parse receipt');
			}

			const data: ParsedReceiptData = result.data;

			// Populate form with AI-extracted data
			date = data.date;
			description = data.description;
			amount = data.amount?.toString() || '';
			currency = data.currency;

			// Move to review step
			step = 'review';
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to analyze receipt';
		} finally {
			analyzing = false;
		}
	}

	async function handleSubmit() {
		if (!description || !date) {
			error = 'Description and date are required';
			return;
		}

		if (!file) {
			error = 'Please upload a receipt file';
			return;
		}

		submitting = true;
		error = null;
		step = 'saving';

		try {
			// Upload file to Supabase storage
			const {
				data: { user }
			} = await supabase.auth.getUser();
			if (!user) throw new Error('Not authenticated');

			const fileExt = file.name.split('.').pop();
			const fileName = `${user.id}/${tripId}/${Date.now()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from('receipts')
				.upload(fileName, file);

			if (uploadError) throw uploadError;

			// Create receipt record
			const { error: insertError } = await supabase.from('receipts').insert({
				trip_id: tripId,
				user_id: user.id,
				date,
				description,
				amount: amount ? parseFloat(amount) : null,
				currency,
				file_path: fileName,
				file_name: file.name,
				mime_type: file.type
			});

			if (insertError) throw insertError;

			// Invalidate and navigate back
			await invalidateAll();
			await goto(`/trips/${tripId}`);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to create receipt';
			step = 'review';
		} finally {
			submitting = false;
		}
	}

	function resetForm() {
		step = 'upload';
		file = null;
		imagePreview = null;
		date = new Date().toISOString().split('T')[0];
		description = '';
		amount = '';
		currency = 'USD';
		error = null;
	}

	function readFileAsDataURL(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	// Watch for file changes to create preview
	$effect(() => {
		if (file && file.type.startsWith('image/')) {
			readFileAsDataURL(file).then((url) => {
				imagePreview = url;
			});
		} else {
			imagePreview = null;
		}
	});
</script>

<Card>
	<CardHeader>
		<CardTitle>
			{#if step === 'upload'}
				Add Receipt
			{:else if step === 'review'}
				Review & Confirm
			{:else}
				Saving Receipt...
			{/if}
		</CardTitle>
		{#if tripName}
			<p class="text-sm text-muted-foreground">Adding to: {tripName}</p>
		{/if}
	</CardHeader>
	<CardContent>
		{#if error}
			<div class="p-3 text-sm text-destructive bg-destructive/10 rounded-md mb-4">
				{error}
			</div>
		{/if}

		{#if step === 'upload'}
			<div class="space-y-4">
				<div class="space-y-2">
					<Label>Receipt Image *</Label>
					<FileUpload bind:file />
					<p class="text-xs text-muted-foreground">
						Upload a receipt image. Our AI will automatically extract the date, amount, and
						merchant information.
					</p>
				</div>

				<div class="flex flex-col gap-2">
					<Button onclick={analyzeReceipt} disabled={!file || analyzing} class="w-full">
						{analyzing ? 'Analyzing Receipt...' : 'Analyze with AI'}
					</Button>

				<Button type="button" variant="outline" onclick={async () => await goto(`/trips/${tripId}`)} class="w-full">
					Cancel
				</Button>
				</div>
			</div>
		{:else if step === 'review'}
			<div class="space-y-4">
				{#if imagePreview}
					<div class="space-y-2">
						<Label>Receipt Preview</Label>
						<img
							src={imagePreview}
							alt="Receipt"
							class="w-full max-h-64 object-contain rounded-lg border bg-muted/50"
						/>
					</div>
				{/if}

				<div class="space-y-2">
					<Label for="date">Date *</Label>
					<Input id="date" type="date" bind:value={date} required />
				</div>

				<div class="space-y-2">
					<Label for="description">Description *</Label>
					<Textarea
						id="description"
						bind:value={description}
						placeholder="Merchant name or description"
						rows={3}
						required
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<Label for="amount">Amount</Label>
						<Input id="amount" type="number" step="0.01" bind:value={amount} placeholder="0.00" />
					</div>
					<div class="space-y-2">
						<Label for="currency">Currency</Label>
						<Input id="currency" bind:value={currency} placeholder="USD" />
					</div>
				</div>

				<div class="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
					Review the extracted information above. You can edit any field before saving.
				</div>

				<div class="flex gap-2">
					<Button onclick={handleSubmit} disabled={submitting} class="flex-1">
						{submitting ? 'Saving...' : 'Save Receipt'}
					</Button>
					<Button type="button" variant="outline" onclick={analyzeReceipt} disabled={analyzing}>
						Re-analyze
					</Button>
				</div>

				<Button type="button" variant="ghost" onclick={resetForm} class="w-full">
					Start Over
				</Button>
			</div>
		{:else if step === 'saving'}
			<div class="flex flex-col items-center justify-center py-8 space-y-4">
				<div
					class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
				></div>
				<p class="text-muted-foreground">Saving your receipt...</p>
			</div>
		{/if}
	</CardContent>
</Card>

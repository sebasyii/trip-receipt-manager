<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";

	let {
		file = $bindable<File | null>(null),
		class: className = ""
	}: {
		file?: any;
		class?: string;
	} = $props();

	let isDragging = $state(false);
	let preview = $state<string | null>(null);
	let fileInputRef: HTMLInputElement | null = $state(null);

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		
		const droppedFile = e.dataTransfer?.files[0];
		if (droppedFile && isImageFile(droppedFile)) {
			handleFileSelect(droppedFile);
		}
	}

	function handleFileInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const selectedFile = target.files?.[0];
		if (selectedFile && isImageFile(selectedFile)) {
			handleFileSelect(selectedFile);
		}
	}

	function handleFileSelect(selectedFile: File) {
		file = selectedFile;
		
		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			preview = e.target?.result as string;
		};
		reader.readAsDataURL(selectedFile);
	}

	function isImageFile(file: File): boolean {
		return file.type.startsWith('image/') || file.type === 'application/pdf';
	}

	function removeFile() {
		file = null;
		preview = null;
		if (fileInputRef) {
			fileInputRef.value = '';
		}
	}
</script>

<div class={cn("space-y-4", className)}>
	{#if !file}
		<div
			class={cn(
				"border-2 border-dashed rounded-lg p-8 text-center transition-colors",
				isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
			)}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
		>
			<div class="flex flex-col items-center gap-4">
				<svg
					class="w-12 h-12 text-muted-foreground"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					/>
				</svg>
				<div>
					<p class="text-sm font-medium">Drop your receipt here</p>
					<p class="text-xs text-muted-foreground mt-1">or click to browse</p>
				</div>
				<Button
					type="button"
					variant="outline"
					onclick={() => fileInputRef?.click()}
				>
					Select File
				</Button>
				<input
					bind:this={fileInputRef}
					type="file"
					accept="image/*,application/pdf"
					class="hidden"
					oninput={handleFileInput}
				/>
			</div>
		</div>
	{:else}
		<div class="space-y-2">
			<div class="flex items-center justify-between p-4 border rounded-lg">
				<div class="flex items-center gap-4">
					{#if preview && file.type.startsWith('image/')}
						<img src={preview} alt="Preview" class="w-16 h-16 object-cover rounded" />
					{:else}
						<div class="w-16 h-16 bg-muted rounded flex items-center justify-center">
							<svg
								class="w-8 h-8 text-muted-foreground"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
								/>
							</svg>
						</div>
					{/if}
					<div>
						<p class="text-sm font-medium">{file.name}</p>
						<p class="text-xs text-muted-foreground">
							{(file.size / 1024).toFixed(2)} KB
						</p>
					</div>
				</div>
				<Button type="button" variant="ghost" size="sm" onclick={removeFile}>
					Remove
				</Button>
			</div>
		</div>
	{/if}
</div>


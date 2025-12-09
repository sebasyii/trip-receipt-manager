<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import Upload from '@lucide/svelte/icons/upload';
	import FileText from '@lucide/svelte/icons/file-text';
	import X from '@lucide/svelte/icons/x';

	interface Props {
		file?: File | null;
		class?: string;
		accept?: string;
	}

	let {
		file = $bindable<File | null>(null),
		class: className = '',
		accept = 'image/*,application/pdf'
	}: Props = $props();

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
		if (droppedFile && isValidFile(droppedFile)) {
			handleFileSelect(droppedFile);
		}
	}

	function handleFileInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const selectedFile = target.files?.[0];
		if (selectedFile && isValidFile(selectedFile)) {
			handleFileSelect(selectedFile);
		}
	}

	function handleFileSelect(selectedFile: File) {
		file = selectedFile;

		// Create preview for images
		if (selectedFile.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				preview = e.target?.result as string;
			};
			reader.readAsDataURL(selectedFile);
		} else {
			preview = null;
		}
	}

	function isValidFile(file: File): boolean {
		return file.type.startsWith('image/') || file.type === 'application/pdf';
	}

	function removeFile() {
		file = null;
		preview = null;
		if (fileInputRef) {
			fileInputRef.value = '';
		}
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			fileInputRef?.click();
		}
	}
</script>

<div class={cn('space-y-4', className)}>
	{#if !file}
		<div
			role="button"
			tabindex="0"
			class={cn(
				'border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer',
				'hover:border-primary/50 hover:bg-primary/5',
				'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
				isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
			)}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			onclick={() => fileInputRef?.click()}
			onkeydown={handleKeyDown}
		>
			<div class="flex flex-col items-center gap-4">
				<div
					class={cn(
						'rounded-full p-4 transition-colors',
						isDragging ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
					)}
				>
					<Upload class="w-8 h-8" />
				</div>
				<div>
					<p class="text-sm font-medium">Drop your receipt here</p>
					<p class="text-xs text-muted-foreground mt-1">or click to browse</p>
				</div>
				<p class="text-xs text-muted-foreground">Supports images and PDFs</p>
				<input
					bind:this={fileInputRef}
					type="file"
					{accept}
					class="hidden"
					oninput={handleFileInput}
				/>
			</div>
		</div>
	{:else}
		<div class="border rounded-lg overflow-hidden">
			<div class="flex items-center gap-4 p-4">
				{#if preview}
					<img src={preview} alt="Preview" class="w-16 h-16 object-cover rounded" />
				{:else}
					<div class="w-16 h-16 bg-muted rounded flex items-center justify-center">
						<FileText class="w-8 h-8 text-muted-foreground" />
					</div>
				{/if}
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium truncate">{file.name}</p>
					<p class="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
				</div>
				<Button type="button" variant="ghost" size="icon-sm" onclick={removeFile}>
					<X class="w-4 h-4" />
					<span class="sr-only">Remove file</span>
				</Button>
			</div>
		</div>
	{/if}
</div>

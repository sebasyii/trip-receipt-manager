<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
</script>

<div class="min-h-screen flex items-center justify-center px-4">
	<div class="text-center space-y-6 max-w-md">
		<div class="space-y-2">
			<h1 class="text-6xl font-bold text-muted-foreground">{$page.status}</h1>
			<h2 class="text-2xl font-semibold">
				{#if $page.status === 404}
					Page Not Found
				{:else if $page.status === 500}
					Server Error
				{:else}
					Something Went Wrong
				{/if}
			</h2>
		</div>

		<p class="text-muted-foreground">
			{#if $page.error?.message}
				{$page.error.message}
			{:else if $page.status === 404}
				The page you're looking for doesn't exist or has been moved.
			{:else}
				An unexpected error occurred. Please try again later.
			{/if}
		</p>

		<div class="flex flex-col sm:flex-row gap-2 justify-center">
			<Button onclick={() => goto('/')}>Go Home</Button>
			<Button variant="outline" onclick={() => window.history.back()}>Go Back</Button>
		</div>
	</div>
</div>


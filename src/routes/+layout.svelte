<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Button } from '$lib/components/ui/button';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating } from '$app/state';
	import { page } from '$app/state';
	import { setContext } from 'svelte';
	import { createSupabaseBrowserClient } from '$lib/utils/supabase.browser';
	import type { SupabaseClient } from '@supabase/supabase-js';

	let { children, data } = $props();

	// Create browser client and make it available via context
	const supabase: SupabaseClient = createSupabaseBrowserClient();
	setContext('supabase', supabase);

	let loggingOut = $state(false);

	async function handleSignOut() {
		loggingOut = true;
		try {
			await supabase.auth.signOut();
			await invalidateAll();
			await goto('/login');
		} finally {
			loggingOut = false;
		}
	}

	// Check if on public page
	let isPublicPage = $derived(['/login', '/signup'].includes(page.url.pathname));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Trip Receipt Manager</title>
</svelte:head>

<!-- Global Loading Indicator -->
{#if navigating}
	<div class="fixed top-0 left-0 right-0 z-[100]">
		<div class="h-1 bg-primary animate-pulse" style="animation: loading 1s ease-in-out infinite;">
		</div>
	</div>
{/if}

<style>
	@keyframes loading {
		0% { width: 0%; margin-left: 0%; }
		50% { width: 50%; margin-left: 25%; }
		100% { width: 100%; margin-left: 0%; }
	}
</style>

{#if data.user && !isPublicPage}
	<div class="min-h-screen flex flex-col">
		<header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			<div class="container mx-auto px-4 py-4 flex justify-between items-center">
				<button
					onclick={async () => await goto('/')}
					class="text-xl font-bold hover:opacity-80 transition-opacity"
				>
					Trip Receipt Manager
				</button>
				<div class="flex items-center gap-4">
					<span class="text-sm text-muted-foreground hidden sm:inline">{data.user.email}</span>
					<Button variant="outline" size="sm" onclick={handleSignOut} disabled={loggingOut}>
						{loggingOut ? 'Logging out...' : 'Logout'}
					</Button>
				</div>
			</div>
		</header>
		<main class="flex-1">
			{@render children()}
		</main>
		<footer class="border-t py-4">
			<div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
				&copy; {new Date().getFullYear()} Trip Receipt Manager
			</div>
		</footer>
	</div>
{:else}
	{@render children()}
{/if}

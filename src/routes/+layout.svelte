<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Button } from '$lib/components/ui/button';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { supabase } from '$lib/utils/supabase';

	let { children, data } = $props();

	let loggingOut = $state(false);

	async function handleSignOut() {
		loggingOut = true;
		try {
			await supabase.auth.signOut();
			await invalidateAll();
			goto('/login');
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

{#if data.user && !isPublicPage}
	<div class="min-h-screen flex flex-col">
		<header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			<div class="container mx-auto px-4 py-4 flex justify-between items-center">
				<button
					onclick={() => goto('/')}
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

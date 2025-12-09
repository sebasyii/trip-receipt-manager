<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { initAuth, user, signOut, authLoading } from '$lib/stores/auth';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	
	let { children } = $props();

	onMount(() => {
		initAuth();
	});

	// Redirect to login if not authenticated (except for public pages)
	$effect(() => {
		if (!$authLoading && !$user) {
			const publicPages = ['/login', '/signup'];
			if (!publicPages.includes($page.url.pathname)) {
				goto('/login');
			}
		}
	});

	async function handleSignOut() {
		await signOut();
		goto('/login');
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if $authLoading}
	<div class="flex items-center justify-center min-h-screen">
		<p class="text-muted-foreground">Loading...</p>
	</div>
{:else}
	{#if $user}
		<div class="min-h-screen flex flex-col">
			<header class="border-b">
				<div class="container mx-auto px-4 py-4 flex justify-between items-center">
					<button onclick={() => goto('/')} class="text-xl font-bold hover:opacity-80">
						Trip Receipt Manager
					</button>
					<div class="flex items-center gap-4">
						<span class="text-sm text-muted-foreground">{$user.email}</span>
						<Button variant="outline" size="sm" onclick={handleSignOut}>
							Logout
						</Button>
					</div>
				</div>
			</header>
			<main class="flex-1">
				{@render children()}
			</main>
		</div>
	{:else}
		{@render children()}
	{/if}
{/if}

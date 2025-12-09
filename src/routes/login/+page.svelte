<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { form } = $props();

	let loading = $state(false);
</script>

<div class="min-h-screen flex items-center justify-center px-4">
	<Card class="w-full max-w-md">
		<CardHeader class="text-center">
			<CardTitle class="text-2xl">Welcome Back</CardTitle>
			<p class="text-sm text-muted-foreground mt-2">Sign in to manage your trip receipts</p>
		</CardHeader>
		<CardContent>
			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
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
					<Label for="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						value={form?.email ?? ''}
						placeholder="you@example.com"
						required
						autocomplete="email"
					/>
				</div>

				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						placeholder="••••••••"
						required
						autocomplete="current-password"
					/>
				</div>

				<div class="flex flex-col gap-2 pt-2">
					<Button type="submit" disabled={loading} class="w-full">
						{loading ? 'Signing in...' : 'Sign In'}
					</Button>
					<Button type="button" variant="outline" onclick={() => goto('/signup')} class="w-full">
						Don't have an account? Sign up
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>

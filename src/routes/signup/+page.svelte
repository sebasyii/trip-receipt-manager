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
			<CardTitle class="text-2xl">Create Account</CardTitle>
			<p class="text-sm text-muted-foreground mt-2">Start managing your trip receipts today</p>
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

				{#if form?.success}
					<div class="p-3 text-sm text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-md">
						{form.message}
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
						autocomplete="new-password"
					/>
					<p class="text-xs text-muted-foreground">Must be at least 6 characters</p>
				</div>

				<div class="space-y-2">
					<Label for="confirmPassword">Confirm Password</Label>
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						placeholder="••••••••"
						required
						autocomplete="new-password"
					/>
				</div>

				<div class="flex flex-col gap-2 pt-2">
					<Button type="submit" disabled={loading} class="w-full">
						{loading ? 'Creating account...' : 'Sign Up'}
					</Button>
					<Button type="button" variant="outline" onclick={() => goto('/login')} class="w-full">
						Already have an account? Sign in
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>

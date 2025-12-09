<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { supabase } from "$lib/utils/supabase";
	import { goto } from "$app/navigation";

	let email = $state("");
	let password = $state("");
	let loading = $state(false);
	let error = $state<string | null>(null);

	async function handleLogin() {
		if (!email || !password) {
			error = "Email and password are required";
			return;
		}

		loading = true;
		error = null;

		try {
			const { error: signInError } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (signInError) throw signInError;

			goto("/");
		} catch (e) {
			error = e instanceof Error ? e.message : "Failed to login";
		} finally {
			loading = false;
		}
	}
</script>

<div class="container mx-auto py-8 px-4 max-w-md">
	<Card>
		<CardHeader>
			<CardTitle>Login</CardTitle>
		</CardHeader>
		<CardContent>
			<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }} class="space-y-4">
				{#if error}
					<div class="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
						{error}
					</div>
				{/if}

				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						bind:value={email}
						placeholder="you@example.com"
						required
					/>
				</div>

				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						bind:value={password}
						placeholder="••••••••"
						required
					/>
				</div>

				<div class="flex flex-col gap-2">
					<Button type="submit" disabled={loading} class="w-full">
						{loading ? "Logging in..." : "Login"}
					</Button>
					<Button type="button" variant="outline" onclick={() => goto("/signup")} class="w-full">
						Don't have an account? Sign up
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>


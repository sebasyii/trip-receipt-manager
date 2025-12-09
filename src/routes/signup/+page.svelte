<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { supabase } from "$lib/utils/supabase";
	import { goto } from "$app/navigation";

	let email = $state("");
	let password = $state("");
	let confirmPassword = $state("");
	let loading = $state(false);
	let error = $state<string | null>(null);
	let message = $state<string | null>(null);

	async function handleSignup() {
		if (!email || !password || !confirmPassword) {
			error = "All fields are required";
			return;
		}

		if (password !== confirmPassword) {
			error = "Passwords do not match";
			return;
		}

		if (password.length < 6) {
			error = "Password must be at least 6 characters";
			return;
		}

		loading = true;
		error = null;
		message = null;

		try {
			const { error: signUpError } = await supabase.auth.signUp({
				email,
				password
			});

			if (signUpError) throw signUpError;

			message = "Account created! Please check your email to confirm your account, then login.";
			
			// Clear form
			email = "";
			password = "";
			confirmPassword = "";
		} catch (e) {
			error = e instanceof Error ? e.message : "Failed to sign up";
		} finally {
			loading = false;
		}
	}
</script>

<div class="container mx-auto py-8 px-4 max-w-md">
	<Card>
		<CardHeader>
			<CardTitle>Sign Up</CardTitle>
		</CardHeader>
		<CardContent>
			<form onsubmit={(e) => { e.preventDefault(); handleSignup(); }} class="space-y-4">
				{#if error}
					<div class="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
						{error}
					</div>
				{/if}

				{#if message}
					<div class="p-3 text-sm text-green-700 bg-green-100 rounded-md">
						{message}
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

				<div class="space-y-2">
					<Label for="confirm-password">Confirm Password</Label>
					<Input
						id="confirm-password"
						type="password"
						bind:value={confirmPassword}
						placeholder="••••••••"
						required
					/>
				</div>

				<div class="flex flex-col gap-2">
					<Button type="submit" disabled={loading} class="w-full">
						{loading ? "Creating account..." : "Sign Up"}
					</Button>
					<Button type="button" variant="outline" onclick={() => goto("/login")} class="w-full">
						Already have an account? Login
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>


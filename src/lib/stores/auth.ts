import { writable } from 'svelte/store';
import { supabase } from '$lib/utils/supabase';
import type { User } from '@supabase/supabase-js';

export const user = writable<User | null>(null);
export const authLoading = writable<boolean>(true);

export async function initAuth() {
	authLoading.set(true);
	
	// Get initial session
	const { data: { session } } = await supabase.auth.getSession();
	user.set(session?.user ?? null);
	authLoading.set(false);

	// Listen for auth changes
	supabase.auth.onAuthStateChange((_event, session) => {
		user.set(session?.user ?? null);
	});
}

export async function signOut() {
	await supabase.auth.signOut();
	user.set(null);
}


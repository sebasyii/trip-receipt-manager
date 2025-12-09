/**
 * Auth utilities - simplified for server-side auth pattern.
 * 
 * Note: With SvelteKit's load functions, auth state is now primarily
 * handled server-side through +layout.server.ts. This module provides
 * client-side utilities for sign out and session management.
 */

import { supabase } from '$lib/utils/supabase';
import { invalidateAll } from '$app/navigation';

/**
 * Signs out the current user and invalidates all data.
 */
export async function signOut(): Promise<void> {
	await supabase.auth.signOut();
	await invalidateAll();
}

/**
 * Gets the current user from the Supabase session.
 * Prefer using the user from layout data when possible.
 */
export async function getCurrentUser() {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	return user;
}

/**
 * Subscribes to auth state changes.
 * Useful for real-time auth state updates.
 */
export function onAuthStateChange(
	callback: (user: import('@supabase/supabase-js').User | null) => void
) {
	const {
		data: { subscription }
	} = supabase.auth.onAuthStateChange((_event, session) => {
		callback(session?.user ?? null);
	});

	return () => subscription.unsubscribe();
}

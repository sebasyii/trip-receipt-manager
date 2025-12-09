import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } from '$env/static/public';

/**
 * Creates a Supabase client for browser/client-side operations.
 * This client properly syncs with the server-side auth session via cookies.
 */
export function createSupabaseBrowserClient() {
	return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY);
}

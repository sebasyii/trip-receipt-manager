import { createServerClient as createSupabaseSSRClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } from '$env/static/public';
import type { Cookies } from '@sveltejs/kit';

/**
 * Creates a Supabase client for server-side operations with proper cookie handling.
 * This ensures that auth sessions are properly persisted across requests.
 */
export function createServerClient(cookies: Cookies) {
	return createSupabaseSSRClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY, {
		cookies: {
			getAll: () => {
				return cookies.getAll();
			},
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});
}

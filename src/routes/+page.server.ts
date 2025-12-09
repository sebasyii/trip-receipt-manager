import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Trip } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	// Verify the user is authenticated
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	// Stream trips - return promise without awaiting
	const tripsPromise = supabase
		.from('trips')
		.select('*')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false })
		.then(({ data, error }) => {
			if (error) {
				console.error('Error loading trips:', error);
				return { trips: [] as Trip[], error: error.message };
			}
			return { trips: (data ?? []) as Trip[], error: null };
		});

	return {
		streamed: {
			tripsData: tripsPromise
		}
	};
};

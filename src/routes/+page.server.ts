import type { PageServerLoad } from './$types';
import { createServerClient } from '$lib/utils/supabase.server';
import { redirect } from '@sveltejs/kit';
import type { Trip } from '$lib/types';

export const load: PageServerLoad = async ({ cookies }) => {
	const supabase = createServerClient(cookies);

	// Verify the user is authenticated
	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (!user) {
		throw redirect(303, '/login');
	}

	// Fetch trips for the authenticated user
	const { data: trips, error } = await supabase
		.from('trips')
		.select('*')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error loading trips:', error);
		return {
			trips: [] as Trip[],
			error: error.message
		};
	}

	return {
		trips: (trips ?? []) as Trip[]
	};
};

export const ssr = false;
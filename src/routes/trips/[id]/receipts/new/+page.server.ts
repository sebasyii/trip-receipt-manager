import type { PageServerLoad, Actions } from './$types';
import { createServerClient } from '$lib/utils/supabase.server';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const supabase = createServerClient(cookies);
	const tripId = params.id;

	// Verify the user is authenticated
	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (!user) {
		throw redirect(303, '/login');
	}

	// Verify trip exists and belongs to user
	const { data: trip, error } = await supabase
		.from('trips')
		.select('id, name')
		.eq('id', tripId)
		.eq('user_id', user.id)
		.single();

	if (error || !trip) {
		throw redirect(303, '/');
	}

	return {
		tripId,
		tripName: trip.name
	};
};


import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const tripId = params.id;

	// Verify the user is authenticated
	const { user } = await locals.safeGetSession();

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


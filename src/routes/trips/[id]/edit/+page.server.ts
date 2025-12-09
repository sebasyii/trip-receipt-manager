import type { Actions, PageServerLoad } from './$types';
import { createServerClient } from '$lib/utils/supabase.server';
import { fail, redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const supabase = createServerClient(cookies);
	const tripId = params.id;

	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (!user) {
		throw redirect(303, '/login');
	}

	// Fetch the trip to edit
	const { data: trip, error: tripError } = await supabase
		.from('trips')
		.select('*')
		.eq('id', tripId)
		.eq('user_id', user.id)
		.single();

	if (tripError || !trip) {
		throw error(404, 'Trip not found');
	}

	return {
		trip
	};
};

export const actions: Actions = {
	default: async ({ params, request, cookies }) => {
		const supabase = createServerClient(cookies);
		const tripId = params.id;
		const formData = await request.formData();

		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) {
			throw redirect(303, '/login');
		}

		const name = formData.get('name') as string;
		const startDate = formData.get('startDate') as string;
		const endDate = (formData.get('endDate') as string) || null;
		const description = (formData.get('description') as string) || null;

		if (!name || !startDate) {
			return fail(400, {
				error: 'Name and start date are required',
				name,
				startDate,
				endDate,
				description
			});
		}

		const { error: updateError } = await supabase
			.from('trips')
			.update({
				name,
				start_date: startDate,
				end_date: endDate,
				description
			})
			.eq('id', tripId)
			.eq('user_id', user.id);

		if (updateError) {
			return fail(500, {
				error: updateError.message,
				name,
				startDate,
				endDate,
				description
			});
		}

		throw redirect(303, `/trips/${tripId}`);
	}
};

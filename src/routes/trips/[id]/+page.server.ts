import type { Actions, PageServerLoad } from './$types';
import { createServerClient } from '$lib/utils/supabase.server';
import { error, redirect, fail } from '@sveltejs/kit';
import type { Trip, Receipt, TripWithReceipts } from '$lib/types';

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

	// Fetch the trip
	const { data: tripData, error: tripError } = await supabase
		.from('trips')
		.select('*')
		.eq('id', tripId)
		.eq('user_id', user.id)
		.single();

	if (tripError || !tripData) {
		throw error(404, 'Trip not found');
	}

	// Fetch receipts for this trip
	const { data: receiptsData, error: receiptsError } = await supabase
		.from('receipts')
		.select('*')
		.eq('trip_id', tripId)
		.order('date', { ascending: false });

	if (receiptsError) {
		console.error('Error loading receipts:', receiptsError);
	}

	const trip: TripWithReceipts = {
		...(tripData as Trip),
		receipts: (receiptsData ?? []) as Receipt[]
	};

	return {
		trip
	};
};

export const actions: Actions = {
	delete: async ({ params, cookies }) => {
		const supabase = createServerClient(cookies);
		const tripId = params.id;

		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) {
			throw redirect(303, '/login');
		}

		// First delete all receipts associated with this trip
		const { error: receiptsError } = await supabase
			.from('receipts')
			.delete()
			.eq('trip_id', tripId);

		if (receiptsError) {
			return fail(500, {
				error: 'Failed to delete receipts: ' + receiptsError.message
			});
		}

		// Then delete the trip
		const { error: tripError } = await supabase
			.from('trips')
			.delete()
			.eq('id', tripId)
			.eq('user_id', user.id);

		if (tripError) {
			return fail(500, {
				error: 'Failed to delete trip: ' + tripError.message
			});
		}

		throw redirect(303, '/');
	}
};


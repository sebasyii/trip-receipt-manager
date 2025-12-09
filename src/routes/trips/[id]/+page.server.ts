import type { Actions, PageServerLoad } from './$types';
import { error, redirect, fail } from '@sveltejs/kit';
import type { Trip, Receipt, TripWithReceipts } from '$lib/types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const tripId = params.id;

	// Verify the user is authenticated
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	// Fetch the trip (await this - needed immediately for page header)
	const { data: tripData, error: tripError } = await supabase
		.from('trips')
		.select('*')
		.eq('id', tripId)
		.eq('user_id', user.id)
		.single();

	if (tripError || !tripData) {
		throw error(404, 'Trip not found');
	}

	// Stream receipts - return promise without awaiting
	const receiptsPromise = supabase
		.from('receipts')
		.select('*')
		.eq('trip_id', tripId)
		.order('date', { ascending: false })
		.then(({ data, error: receiptsError }) => {
			if (receiptsError) {
				console.error('Error loading receipts:', receiptsError);
				return [];
			}
			return (data ?? []) as Receipt[];
		});

	return {
		trip: tripData as Trip,
		streamed: {
			receipts: receiptsPromise
		}
	};
};

export const actions: Actions = {
	delete: async ({ params, locals }) => {
		const supabase = locals.supabase;
		const tripId = params.id;

		const { user } = await locals.safeGetSession();

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


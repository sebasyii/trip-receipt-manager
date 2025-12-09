import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const supabase = locals.supabase;
		const formData = await request.formData();

		const { user } = await locals.safeGetSession();

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

		const { data: trip, error } = await supabase
			.from('trips')
			.insert({
				name,
				start_date: startDate,
				end_date: endDate,
				description,
				user_id: user.id
			})
			.select()
			.single();

		if (error) {
			return fail(500, {
				error: error.message,
				name,
				startDate,
				endDate,
				description
			});
		}

		throw redirect(303, `/trips/${trip.id}`);
	}
};


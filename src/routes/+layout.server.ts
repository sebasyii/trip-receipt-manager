import type { LayoutServerLoad } from './$types';
import { createServerClient } from '$lib/utils/supabase.server';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const supabase = createServerClient(cookies);

	const {
		data: { user }
	} = await supabase.auth.getUser();

	return {
		user
	};
};


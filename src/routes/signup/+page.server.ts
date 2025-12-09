import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	// If already logged in, redirect to home
	if (user) {
		throw redirect(303, '/');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const supabase = locals.supabase;
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!email || !password || !confirmPassword) {
			return fail(400, {
				error: 'All fields are required',
				email
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				error: 'Passwords do not match',
				email
			});
		}

		if (password.length < 6) {
			return fail(400, {
				error: 'Password must be at least 6 characters',
				email
			});
		}

		const { error } = await supabase.auth.signUp({
			email,
			password
		});

		if (error) {
			return fail(400, {
				error: error.message,
				email
			});
		}

		return {
			success: true,
			message: 'Account created! Please check your email to confirm your account, then login.'
		};
	}
};


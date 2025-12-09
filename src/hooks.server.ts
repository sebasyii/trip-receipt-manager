import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Add any global server-side handling here
	// For now, we just pass through to the resolver
	return resolve(event);
};


import { writable } from 'svelte/store';
import { supabase } from '$lib/utils/supabase';
import type { Trip, Receipt, TripWithReceipts } from '$lib/types';

export const trips = writable<Trip[]>([]);
export const currentTrip = writable<TripWithReceipts | null>(null);
export const loading = writable<boolean>(false);
export const error = writable<string | null>(null);

export async function loadTrips() {
	loading.set(true);
	error.set(null);
	
	try {
		const { data, error: err } = await supabase
			.from('trips')
			.select('*')
			.order('created_at', { ascending: false });
		
		if (err) throw err;
		
		trips.set(data || []);
	} catch (e) {
		error.set(e instanceof Error ? e.message : 'Failed to load trips');
		console.error('Error loading trips:', e);
	} finally {
		loading.set(false);
	}
}

export async function createTrip(trip: Omit<Trip, 'id' | 'created_at' | 'user_id'>) {
	loading.set(true);
	error.set(null);
	
	try {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error('Not authenticated');
		
		const { data, error: err } = await supabase
			.from('trips')
			.insert({
				...trip,
				user_id: user.id
			})
			.select()
			.single();
		
		if (err) throw err;
		
		trips.update(t => [data, ...t]);
		return data;
	} catch (e) {
		error.set(e instanceof Error ? e.message : 'Failed to create trip');
		console.error('Error creating trip:', e);
		throw e;
	} finally {
		loading.set(false);
	}
}

export async function loadTripWithReceipts(tripId: string) {
	loading.set(true);
	error.set(null);
	
	try {
		const { data: tripData, error: tripErr } = await supabase
			.from('trips')
			.select('*')
			.eq('id', tripId)
			.single();
		
		if (tripErr) throw tripErr;
		
		const { data: receiptsData, error: receiptsErr } = await supabase
			.from('receipts')
			.select('*')
			.eq('trip_id', tripId)
			.order('date', { ascending: false });
		
		if (receiptsErr) throw receiptsErr;
		
		if (tripData) {
			currentTrip.set({
				...tripData,
				receipts: (receiptsData || []) as Receipt[]
			});
		}
	} catch (e) {
		error.set(e instanceof Error ? e.message : 'Failed to load trip');
		console.error('Error loading trip:', e);
	} finally {
		loading.set(false);
	}
}

export async function createReceipt(receipt: Omit<Receipt, 'id' | 'created_at' | 'user_id'>) {
	loading.set(true);
	error.set(null);
	
	try {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error('Not authenticated');
		
		const { data, error: err } = await supabase
			.from('receipts')
			.insert({
				...receipt,
				user_id: user.id,
				currency: receipt.currency || 'USD'
			})
			.select()
			.single();
		
		if (err) throw err;
		
		// Update current trip if it's loaded
		currentTrip.update(trip => {
			if (trip && trip.id === receipt.trip_id) {
				return {
					...trip,
					receipts: [data, ...(trip.receipts || [])]
				};
			}
			return trip;
		});
		
		return data;
	} catch (e) {
		error.set(e instanceof Error ? e.message : 'Failed to create receipt');
		console.error('Error creating receipt:', e);
		throw e;
	} finally {
		loading.set(false);
	}
}


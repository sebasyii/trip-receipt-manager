/**
 * Trip store - simplified for server-side data loading pattern.
 * 
 * Note: With SvelteKit's load functions, most data is now loaded server-side
 * and passed through PageData. This store is kept for client-side operations
 * that need to update data after mutations.
 */

import { supabase } from '$lib/utils/supabase';
import type { Trip, Receipt } from '$lib/types';

/**
 * Creates a new trip in the database.
 * Consider using form actions instead for better UX.
 */
export async function createTrip(
	trip: Omit<Trip, 'id' | 'created_at' | 'user_id'>
): Promise<Trip> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	
	if (!user) throw new Error('Not authenticated');

	const { data, error } = await supabase
		.from('trips')
		.insert({
			...trip,
			user_id: user.id
		})
		.select()
		.single();

	if (error) throw error;
	return data as Trip;
}

/**
 * Creates a new receipt in the database.
 */
export async function createReceipt(
	receipt: Omit<Receipt, 'id' | 'created_at' | 'user_id'>
): Promise<Receipt> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	
	if (!user) throw new Error('Not authenticated');

	const { data, error } = await supabase
		.from('receipts')
		.insert({
			...receipt,
			user_id: user.id,
			currency: receipt.currency || 'USD'
		})
		.select()
		.single();

	if (error) throw error;
	return data as Receipt;
}

/**
 * Updates an existing trip in the database.
 */
export async function updateTrip(
	tripId: string,
	updates: Partial<Omit<Trip, 'id' | 'created_at' | 'user_id'>>
): Promise<Trip> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	
	if (!user) throw new Error('Not authenticated');

	const { data, error } = await supabase
		.from('trips')
		.update(updates)
		.eq('id', tripId)
		.eq('user_id', user.id)
		.select()
		.single();

	if (error) throw error;
	return data as Trip;
}

/**
 * Deletes a trip and all associated receipts.
 */
export async function deleteTrip(tripId: string): Promise<void> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	
	if (!user) throw new Error('Not authenticated');

	// First delete all receipts
	const { error: receiptsError } = await supabase
		.from('receipts')
		.delete()
		.eq('trip_id', tripId);

	if (receiptsError) throw receiptsError;

	// Then delete the trip
	const { error: tripError } = await supabase
		.from('trips')
		.delete()
		.eq('id', tripId)
		.eq('user_id', user.id);

	if (tripError) throw tripError;
}

/**
 * Deletes a receipt.
 */
export async function deleteReceipt(receiptId: string): Promise<void> {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	
	if (!user) throw new Error('Not authenticated');

	const { error } = await supabase
		.from('receipts')
		.delete()
		.eq('id', receiptId)
		.eq('user_id', user.id);

	if (error) throw error;
}

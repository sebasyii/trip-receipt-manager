// This file will be generated from Supabase, but for now we'll define basic types
export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			trips: {
				Row: {
					id: string;
					name: string;
					start_date: string;
					end_date: string | null;
					description: string | null;
					created_at: string;
					user_id: string;
				};
				Insert: {
					id?: string;
					name: string;
					start_date: string;
					end_date?: string | null;
					description?: string | null;
					created_at?: string;
					user_id: string;
				};
				Update: {
					id?: string;
					name?: string;
					start_date?: string;
					end_date?: string | null;
					description?: string | null;
					created_at?: string;
					user_id?: string;
				};
			};
			receipts: {
				Row: {
					id: string;
					trip_id: string;
					date: string;
					description: string;
					amount: number | null;
					currency: string;
					file_path: string;
					file_name: string;
					mime_type: string;
					created_at: string;
					user_id: string;
				};
				Insert: {
					id?: string;
					trip_id: string;
					date: string;
					description: string;
					amount?: number | null;
					currency?: string;
					file_name: string;
					mime_type: string;
					file_path: string;
					created_at?: string;
					user_id: string;
				};
				Update: {
					id?: string;
					trip_id?: string;
					date?: string;
					description?: string;
					amount?: number | null;
					currency?: string;
					file_path?: string;
					file_name?: string;
					mime_type?: string;
					created_at?: string;
					user_id?: string;
				};
			};
		};
	};
}


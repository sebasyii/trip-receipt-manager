export interface Trip {
	id: string;
	name: string;
	start_date: string;
	end_date: string | null;
	description: string | null;
	created_at: string;
	user_id: string;
}

export interface Receipt {
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
}

export interface TripWithReceipts extends Trip {
	receipts?: Receipt[];
}

export interface ReceiptGroupedByDate {
	date: string;
	receipts: Receipt[];
}



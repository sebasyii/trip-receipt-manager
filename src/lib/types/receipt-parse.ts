export interface ParsedReceiptData {
	date: string;
	amount: number | null;
	currency: string;
	description: string;
	confidence?: {
		date?: number;
		amount?: number;
		currency?: number;
		description?: number;
	};
}

export interface ParseReceiptResponse {
	success: boolean;
	data?: ParsedReceiptData;
	error?: string;
}


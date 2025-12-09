export function formatDate(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

export function formatDateShort(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}

export function formatCurrency(amount: number | null, currency: string = 'USD'): string {
	if (amount === null) return 'N/A';
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency
	}).format(amount);
}

export function groupReceiptsByDate<T extends { date: string }>(receipts: T[]): Map<string, T[]> {
	const grouped = new Map<string, T[]>();
	
	for (const receipt of receipts) {
		const dateKey = receipt.date;
		if (!grouped.has(dateKey)) {
			grouped.set(dateKey, []);
		}
		grouped.get(dateKey)!.push(receipt);
	}
	
	return grouped;
}


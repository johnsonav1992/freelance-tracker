export const formatCurrency = (amount: number): string =>
	new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		amount,
	);

export const formatDate = (timestamp: number): string =>
	new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(new Date(timestamp));

export const formatDuration = (ms: number): string => {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);

	if (hours === 0) return `${minutes}m`;

	return `${hours}h ${minutes}m`;
};

export const formatHours = (ms: number): string => {
	const hours = ms / 1000 / 3600;
	return `${hours.toFixed(1)}h`;
};

export const generateInvoiceNumber = (): string => {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const random = Math.floor(Math.random() * 1000)
		.toString()
		.padStart(3, '0');

	return `INV-${year}${month}-${random}`;
};

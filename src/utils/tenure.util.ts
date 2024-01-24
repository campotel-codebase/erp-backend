export const calculateTenure = (startDate: Date) => {
	const currentDate = new Date();
	const years = currentDate.getFullYear() - startDate.getFullYear();
	const months = (currentDate.getMonth() - startDate.getMonth() + 12) % 12;
	const days = currentDate.getDate() - startDate.getDate();
	return {years, months, days};
};

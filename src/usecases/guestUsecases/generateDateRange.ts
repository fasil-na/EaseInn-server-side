export function generateDateRange(checkInDate: string, checkOutDate: string): string[] {
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const dateList = [];

    while (startDate < endDate) {
        dateList.push(startDate.toISOString().split('T')[0]);
        startDate.setDate(startDate.getDate() + 1);
    }

    return dateList;
}

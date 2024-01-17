
import { HostInterface } from "../../entities/hostModel";

export function filteredHotelsByDate(hotels: HostInterface[], dates: string[], guestCount: number) {
    return hotels.filter(hotel => {
        const isAvailable = hotel.roomTypes.some(roomType => {
            const totalGuestsForThisType = roomType.guestCapacity * roomType.roomCount;

            if (totalGuestsForThisType >= guestCount) {
                const bookedGuestsOnDates = roomType.dailySlots
                    .filter(slot => dates.includes(new Date(slot.date).toISOString().split('T')[0]))
                    .reduce((acc, slot) => acc + slot.booked, 0);

                const remainingRooms = roomType.roomCount - bookedGuestsOnDates;

                return remainingRooms >= Math.ceil(guestCount / roomType.guestCapacity);
            }

            return false;
        });

        return isAvailable;
    });
}

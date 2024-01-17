import { HostInterface } from "../../entities/hostModel";

// export function updatingfilteredHotelByDate(hotel: HostInterface | null, dates: string[], guestCount: number) {
//   if (!hotel) {
//     return []; // or handle the case where hotel is null
//   }

//   return hotel.roomTypes.filter((roomType) => {
//     const totalGuestsForThisType = roomType.guestCapacity * roomType.roomCount;

//     if (totalGuestsForThisType >= guestCount) {
//       return dates.every((date) => {
//         const targetDate = new Date(date);
//         const slot = roomType.dailySlots.find(
//           (s) =>
//             s.date.toISOString().split('T')[0] === targetDate.toISOString().split('T')[0]
//         );
//         const roomsNeeded = Math.ceil(guestCount / roomType.guestCapacity);

//         if (!slot) {
//           // Check if total rooms (including booked) are greater than or equal to required rooms
//           return (roomType.roomCount + roomType.dailySlots.reduce((acc, s) => acc + s.booked, 0)) >= roomsNeeded;
//         }

//         // Check if total available and booked rooms on the specified date are greater than or equal to required rooms
//         return (slot.booked + roomType.dailySlots.reduce((acc, s) => acc + s.booked, 0)) >= roomsNeeded;
//       });
//     }

//     return false;
//   });
// }






export function updatingfilteredHotelByDate(hotel: HostInterface | null, dates: string[], guestCount: number) {
  if (!hotel) {
    console.log("Hotel is null. Cannot check availability.");
    return []; 
  }

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

  return isAvailable ? [hotel] : [];
}

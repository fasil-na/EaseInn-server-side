import {
  updateHostDetails,
  findHostByEmail,
} from "../../repositories/hostRepository";

type RoomDetail = {
  type: string;
  count: number;
  fare: number;
  amenities: string[];
  imageLinks: string[];
};




export const uploadHostDetails = async (
  email: string,
  hotelName: string,
  hotelRating: number,
  gst: string,
  pan: string,
  amenities: string[],
  hotelImageLinks: string[],
  roomTypes: RoomDetail[],
  place: string,
  city: string,
  state: string,
  country: string,
  pin: number,
  policyFileLinks: string[],
  propertyDocLinks: string[],
  ownerDocLinks: string[]
) => { 
  const existingHost = await findHostByEmail(email);
  if (existingHost) {
    const updatedDetails = {
      hotelName,
      hotelRating,
      gst,
      pan,
      amenities,
      hotelImageLinks,
      roomTypes,
      place,
      city,
      state,
      country,
      pin,
      policyFileLinks,
      propertyDocLinks,
      ownerDocLinks
  };
  

    return await updateHostDetails(email, updatedDetails);
  }
};

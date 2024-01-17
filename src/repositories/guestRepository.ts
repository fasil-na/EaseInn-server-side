
import GuestSchema, { GuestInterface, Booking } from "../entities/guestModel";

interface Address {
    line1: string;
    place: string; 
    city: string;
    state: string;
    country: string;
    PIN: string;
 }
 

export const findGuestByEmail = async (email: string): Promise<GuestInterface | null> => {
    try {
        const guestData = await GuestSchema.findOne({ email });
        return guestData;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const saveGuest = async (
    username: string,
    email: string,
    phone: string,
    password: string,
): Promise<GuestInterface> => {
    try {
        const guest = new GuestSchema({ username, email, phone, password });
        return await guest.save();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const findGuestByEmailandUpdatePassword = async (email: string,password:string): Promise<GuestInterface | null> => {
    try {
        const guestData = await GuestSchema.findOneAndUpdate({ email },{$set:{password}});
        return guestData;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const findGuestDetails = async (
    id: string
  ): Promise<GuestInterface | null> => {
    try {
      const guestData = await GuestSchema.findById(id);
      return guestData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const uploadImagetoDb = async (id: string, profilePic: string): Promise<GuestInterface | null> => {
    try {
        const guestData = await GuestSchema.findByIdAndUpdate(id, { $set: { profilePic: profilePic } }, { new: true });
        return guestData;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateUsernameInDB = async (id: string, username: string): Promise<GuestInterface | null> => {
    try {
        const guestData = await GuestSchema.findByIdAndUpdate(id, { $set: { username: username } }, { new: true });
        return guestData;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateAddressInDB = async (id: string, address: Address): Promise<GuestInterface | null> => {
    try {
        const guestData = await GuestSchema.findByIdAndUpdate(id, { $set: { address: address } }, { new: true });
        return guestData;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addOrRemoveFromFavouritesInDB = async (id: string, hotelId: string): Promise<GuestInterface | null> => {
    try {
      const guestData = await GuestSchema.findById(id);
      if (!guestData) {
        throw new Error("Guest not found");
      }
      const favoritesArray = guestData.favoriteHotels || [];
      const index = favoritesArray.indexOf(hotelId);
  
      if (index === -1) {
        favoritesArray.push(hotelId);
      } else {
        favoritesArray.splice(index, 1);
      }
      const updatedGuestData = await GuestSchema.findByIdAndUpdate(
        id,
        { $set: { favoriteHotels: favoritesArray } },
        { new: true }
      );
  
      return updatedGuestData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  

  










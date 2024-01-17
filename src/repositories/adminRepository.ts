import GuestSchema, { GuestInterface } from "../entities/guestModel";
import HostSchema, { HostInterface } from "../entities/hostModel";

export const findGuests = async (): Promise<GuestInterface[]> => {
  try {
    const guestData = await GuestSchema.find();
    return guestData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findGuestAndUpdateStatus = async (
  id: string,
  status: string
): Promise<GuestInterface | null> => {
  try {
    const guestData = await GuestSchema.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return guestData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findHosts = async (): Promise<HostInterface[]> => {
  try {
    const hostData = await HostSchema.find();
    return hostData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findHostAndUpdateStatus = async (
  id: string,
  status: string
): Promise<HostInterface | null> => {
  try {
    const hostData = await HostSchema.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return hostData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findRequests = async (): Promise<HostInterface[]> => {
  try {
    const requestData = await HostSchema.find({ level: 1, status: "Active" });
    return requestData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findRequestDetail = async (
  id: string
): Promise<HostInterface | null> => {
  try {
    const requestData = await HostSchema.findOne({
      _id: id,
      level: 1,
      status: "Active",
    });
    return requestData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const requestApproveLevelUpdate = async (id: string) => {
  try {    
    const requestData = await HostSchema.findByIdAndUpdate(
       id ,
      { $set: { level: 3 } }
    );
    return requestData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const requestRejectLevelUpdate = async (id: string) => {
  try {    
    const requestData = await HostSchema.findByIdAndUpdate(
       id ,
      { $set: { level: 2 } }
    );
    return requestData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const findHostByID = async (id: string) => {
  try {  
    const hostData = await HostSchema.findById( id );
    return hostData;
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


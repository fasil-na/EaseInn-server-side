import HostSchema, { HostInterface } from "../entities/hostModel";

export const findHostByEmail = async (
  email: string
): Promise<HostInterface | null> => {
  try {
    const hostData = await HostSchema.findOne({ email });
    return hostData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const saveHost = async (
  username: string,
  email: string,
  phone: string,
  password: string
): Promise<HostInterface> => {
  try {
    const host = new HostSchema({ username, email, phone, password });
    return await host.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findHostByEmailandUpdatePassword = async (
  email: string,
  password: string
): Promise<HostInterface | null> => {
  try {
    const hostData = await HostSchema.findOneAndUpdate(
      { email },
      { $set: { password } }
    );
    return hostData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findHostDetails = async (
  id: string
): Promise<HostInterface | null> => {
  try {
    const hostData = await HostSchema.findById(id);
    return hostData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateHostDetails = async (
  email: string,
  updatedDetails: any
): Promise<HostInterface | null> => {
  try {
    return await HostSchema.findOneAndUpdate(
      { email },
      { $set: updatedDetails },
      { new: true }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const hostLevelUpdate = async (email: string) => {
  try {
    return await HostSchema.updateOne({ email }, { $set: { level: 1 } });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findHotels = async (): Promise<HostInterface[]> => {
  try {
    const requestData = await HostSchema.find({ level: 3, status: "Active" });
    return requestData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findHostsBasedOnLocation = async (
  location: string,
  skip: number,
  limit: number
): Promise<HostInterface[] | null> => {
  try {
    const filteredHosts = await HostSchema.aggregate([
        {
          $match: {
            $or: [
              { state: location },
              { city: location }
            ]
          }
        },
        {
          $skip: skip
        },
        {
          $limit: limit
        }
      ]);
    return filteredHosts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const requestReapplyLevelUpdate = async (id: string) => {
  try {    
    const requestData = await HostSchema.findByIdAndUpdate(
       id ,
      { $set: { level: 4 } }
    );
    return requestData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editHostDetailsInDB = async (
  id: string,
  updatedDetails: any
): Promise<HostInterface | null> => {
  try {
    return await HostSchema.findByIdAndUpdate(
      id,
      { $set: updatedDetails },
      { new: true }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function fetchBookedHotelsFunction(hotelIds: string[]): Promise<any> {
  try {
    const bookedHotels = await HostSchema.find({ _id: { $in: hotelIds } });   
    
    return bookedHotels;
  } catch (error) {
    console.error("Error fetching booked hotels:", error);
    throw error;
  }
}





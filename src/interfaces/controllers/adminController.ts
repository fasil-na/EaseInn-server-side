import { adminLogin } from "../../usecases/adminUsecases/adminLogin"
import { Request,Response } from "express"
import { sendApproveMail } from "../../usecases/hostUsecases/approveMail"
import { sendRejectMail } from "../../usecases/hostUsecases/rejectMail"
import { findGuests, findGuestAndUpdateStatus, findHosts, findHostAndUpdateStatus, findRequests, findRequestDetail, requestApproveLevelUpdate, requestRejectLevelUpdate, findHostByID,findGuestDetails } from "../../repositories/adminRepository"
import { Booking,GuestInterface } from "../../entities/guestModel"
import hostModel from "../../entities/hostModel"

export const loginAdmin = async(req:Request,res:Response)=>{
    try {     
        const {email,password} = req.body
        const adminData = await adminLogin(email,password)
        res.json(adminData)
    } catch (error) {
        throw new Error("Something error happened")
    }
}

export const fetchGuests = async(req:Request,res:Response)=>{
    try {    
        const guestData = await findGuests(); 
        res.json(guestData)
    } catch (error) {
        throw new Error("Something error happened")
    }
}

export const updateStatus = async(req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      
      const guestData = await findGuestAndUpdateStatus(id, status);
      res.json(guestData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Something error happened" });
    }
  }

  export const updateHostStatus = async(req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      
      const hostData = await findHostAndUpdateStatus(id, status);
      res.json(hostData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Something error happened" });
    }
  }

  export const fetchHosts = async(req:Request,res:Response)=>{
    try {          
        const hostData = await findHosts(); 
        res.json(hostData)
    } catch (error) {
        throw new Error("Something error happened")
    }
}

export const fetchRequests = async(req:Request,res:Response)=>{
  try {        
      const requestData = await findRequests(); 
      res.json(requestData)
  } catch (error) {
      throw new Error("Something error happened")
  }
}

export const requestDetails = async(req: Request, res: Response) => {
  try {   
      const id = req.params.id; 
      const requestData = await findRequestDetail(id); 
      if (requestData) {        
          res.json(requestData)
      } else {
          res.status(404).json({ message: "Request not found." });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something error happened" });
  }
}

export const approveRequest = async(req: Request, res: Response) => {
  try {   
      const id = req.params.id;  
      const hostData = await findHostByID(id)
      if (hostData?.email) {
        await sendApproveMail(hostData.email);
    }    
      const response = await requestApproveLevelUpdate(id); 
      if (response) {        
          res.json(response)
      } else {
          res.status(404).json({ message: "Request not found." });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something error happened" });
  }
}

export const rejectRequest = async(req: Request, res: Response) => {
  try {   
      const id = req.params.id;  
      const hostData = await findHostByID(id)
      if (hostData?.email) {
        await sendRejectMail(hostData.email);
    }  
      const response = await requestRejectLevelUpdate(id); 
      if (response) {        
          res.json(response)
      } else {
          res.status(404).json({ message: "Request not found." });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something error happened" });
  }
}


export const getLineChartData = async (req: Request, res: Response) => {
  try {
    const guestData = await findGuests();

    const dates: string[] = [];
    const counts: number[] = [];

    const bookingCountsByDate = new Map<string, number>();
    const allBookings: Booking[] = guestData.flatMap((guest: GuestInterface) => guest.bookings || []);

    allBookings.forEach((booking) => {
      if (booking && booking.bookingDate) {
        const bookingDate = new Date(booking.bookingDate);
        const formattedDate = formatDate(bookingDate);

        bookingCountsByDate.set(formattedDate, (bookingCountsByDate.get(formattedDate) ?? 0) + 1);
      }
    });

    bookingCountsByDate.forEach((count, date) => {
      dates.push(date);
      counts.push(count);
    });

    const output = {
      dates,
      counts,
    };

    res.json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something error happened' });
  }
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getBarChartData = async (req: Request, res: Response) => {
  try {
    const guestData = await findGuests();

    const dates: string[] = [];
    const amounts: number[] = [];

    const bookingAmountsByDate = new Map<string, number>();
    const allBookings: Booking[] = guestData.flatMap((guest: GuestInterface) => guest.bookings || []);

    allBookings.forEach((booking) => {
      if (booking && booking.bookingDate && booking.totalAmount) {
        const bookingDate = new Date(booking.bookingDate);
        const formattedDate = formatDate(bookingDate);

        bookingAmountsByDate.set(
          formattedDate,
          (bookingAmountsByDate.get(formattedDate) ?? 0) + booking.totalAmount
        );
      }
    });

    bookingAmountsByDate.forEach((amount, date) => {
      dates.push(date);
      amounts.push(amount);
    });

    const output = {
      dates,
      amounts,
    };
  
    res.json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something error happened' });
  }
};

export const getPieChartData = async (req: Request, res: Response) => {
  try {
    const guestData = await findGuests();
    const hostData = await findHosts();

    const hotelTotalAmounts = new Map<string, number>();

    const allBookings: Booking[] = guestData.flatMap((guest: GuestInterface) => guest.bookings || []);

    allBookings.forEach((booking) => {
      if (booking && booking.hotelId && booking.totalAmount) {
        const hotelId = booking.hotelId;
        const hotelDetails = hostData.find((host) => host.id === hotelId);
        const hotelName = hotelDetails ? String(hotelDetails.hotelName) : hotelId;

        hotelTotalAmounts.set(
          hotelName,
          (hotelTotalAmounts.get(hotelName) ?? 0) + booking.totalAmount
        );
      }
    });

    const output = {
      hotels: Array.from(hotelTotalAmounts.keys()),
      amounts: Array.from(hotelTotalAmounts.values()),
    };

    res.json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something error happened' });
  }
};


export const fetchGuestData = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const guestData = await findGuestDetails(id);

    if (!guestData) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    const hostData = await findHosts();
    console.log(hostData);

    const bookings = guestData.bookings;

    // Ensure bookings is defined before mapping
    const populatedBookings = await Promise.all((bookings ?? []).map(async (booking) => {
      const hotelData = await hostModel.findById(booking.hotelId); // Assuming your hotel model is named "Hotel"
      return {
        ...booking,
        hotelName: hotelData ? hotelData.hotelName : 'Unknown Hotel',
      };
    }));

    console.log(populatedBookings);

    res.json({
      guestData: {
        bookings: populatedBookings,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





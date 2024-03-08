import { Request, Response } from "express";
import {
  findGuestByEmail,
  findGuestByEmailandUpdatePassword,
  findGuestDetails,
  uploadImagetoDb,
  updateUsernameInDB,
  updateAddressInDB,
  addOrRemoveFromFavouritesInDB,
} from "../../repositories/guestRepository";
import {
  findHotels,
  findHostDetails,
  findHostsBasedOnLocation,
  fetchBookedHotelsFunction,
} from "../../repositories/hostRepository";
import { SessionData } from "express-session";
import {
  generateOTP,
  sendOtpMail,
} from "../../usecases/guestUsecases/signupOTP";
import { generateDateRange } from "../../usecases/guestUsecases/generateDateRange";
import { sendOtpMailForForgotPass } from "../../usecases/guestUsecases/sendOtpMailForForgotPass";
import { createGuest } from "../../usecases/guestUsecases/createGuest";
import {
  loginGuest,
  LoginResponse,
} from "../../usecases/guestUsecases/loginGuest";
import { securePassword } from "../../services/bcrypt";
import { filteredHotelsByDate } from "../../usecases/guestUsecases/filteredHotelsByDate";
import { updatingfilteredHotelByDate } from "../../usecases/guestUsecases/updatingfilteredHotelByDate";
import { uploadSingleToCloudinary } from "../../usecases/guestUsecases/uploadSingleToCloudinary";
import HostSchema ,{HostInterface}from "../../entities/hostModel";
import Jwt, { Secret } from "jsonwebtoken";
import { findHostByID } from "../../repositories/adminRepository";
import { createRazorpayOrder } from "../../usecases/guestUsecases/createRazorpayOrder";
import GuestSchema, { Booking } from "../../entities/guestModel";

interface CustomSessionData extends SessionData {
  otp?: string;
  guestname?: string;
  email?: string;
  phone?: string;
  password?: string;
  forgotPasswordOTP?: string;
  forgotPasswordEmail?: string;
  otpCreatedAt?: Number;
}

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { username, email, phone, password } = req.body;

    const existingGuest = await findGuestByEmail(email);
    if (!existingGuest) {
      const generatedOtp = generateOTP();
      const otpCreatedAt = Date.now();
      (req.session as CustomSessionData).otp = generatedOtp;
      (req.session as CustomSessionData).guestname = username;
      (req.session as CustomSessionData).email = email;
      (req.session as CustomSessionData).phone = phone;
      (req.session as CustomSessionData).password = password;
      (req.session as CustomSessionData).otpCreatedAt = otpCreatedAt;

      setTimeout(() => {
        delete (req.session as CustomSessionData).otp;
      }, 60000);

      const result = await sendOtpMail(email, generatedOtp);
      res.json(result);
    } else {
      res
        .status(400)
        .json({ error: "A guest with this email already exists." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something error happened" });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const sessionEmail = (req.session as CustomSessionData).email;

    if (!sessionEmail) {
      return res.status(400).json({
        success: false,
        message: "Email not found in the session",
      });
    }

    const generatedOtp = generateOTP();
    const otpCreatedAt = Date.now();
    (req.session as CustomSessionData).otp = generatedOtp;
    (req.session as CustomSessionData).otpCreatedAt = otpCreatedAt;

    setTimeout(() => {
      delete (req.session as CustomSessionData).otp;
    }, 60000);

    const result = await sendOtpMail(sessionEmail, generatedOtp);
    res.json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something error happened" });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    const sessionOtp = (req.session as CustomSessionData).otp;
    const sessionGuestName = (req.session as CustomSessionData).guestname;
    const sessionEmail = (req.session as CustomSessionData).email;
    const sessionPhone = (req.session as CustomSessionData).phone;
    const sessionPassword = (req.session as CustomSessionData).password;
    const otpCreatedAt = (req.session as CustomSessionData).otpCreatedAt;

    if (
      !sessionGuestName ||
      !sessionEmail ||
      !sessionPhone ||
      !sessionPassword ||
      !sessionOtp ||
      !otpCreatedAt
    ) {
      res.status(400).json({
        success: false,
        message: "Required data is missing in session",
      });
      return;
    }

    const currentTimestamp = Date.now();
    const timeElapsed = (currentTimestamp - (otpCreatedAt as number)) / 1000;

    if (timeElapsed > 60) {
      res.status(400).json({
        success: false,
        message: "OTP has expired",
        expired: true,
      });
      return;
    }

    if (sessionOtp === otp) {
      await createGuest(
        sessionGuestName,
        sessionEmail,
        sessionPhone,
        sessionPassword
      );
      res.json({ success: true, message: "User created successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something error happened" });
  }
};

export const guestLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const response: LoginResponse | { error: string } = await loginGuest(
      email,
      password
    );
    if ("error" in response) {
      return res.status(401).json({ message: response.error });
    } else {
      const { userData, token } = response;
      res.json({ userData, token });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPass = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required." });
    }

    const existingGuest = await findGuestByEmail(email);
    if (existingGuest) {
      const generatedOtp = generateOTP();
      const otpCreatedAt = Date.now();
      (req.session as CustomSessionData).forgotPasswordEmail = email;
      (req.session as CustomSessionData).forgotPasswordOTP = generatedOtp;
      (req.session as CustomSessionData).otpCreatedAt = otpCreatedAt;

      setTimeout(() => {
        delete (req.session as CustomSessionData).forgotPasswordOTP;
      }, 60000);

      const result = await sendOtpMailForForgotPass(email, generatedOtp);
      res.json(result);
    } else {
      res
        .status(400)
        .json({ error: "A guest with this email doesn't exists." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something error happened" });
  }
};

export const forgot_pass_resnd_OTP = async (req: Request, res: Response) => {
  try {
    const sessionforgotPasswordEmail = (req.session as CustomSessionData)
      .forgotPasswordEmail;

    if (!sessionforgotPasswordEmail) {
      return res.status(400).json({
        success: false,
        message: "Email not found in the session",
      });
    }

    const generatedOtp = generateOTP();
    const otpCreatedAt = Date.now();
    (req.session as CustomSessionData).forgotPasswordOTP = generatedOtp;
    (req.session as CustomSessionData).otpCreatedAt = otpCreatedAt;

    setTimeout(() => {
      delete (req.session as CustomSessionData).forgotPasswordOTP;
    }, 60000);

    const result = await sendOtpMailForForgotPass(
      sessionforgotPasswordEmail,
      generatedOtp
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something error happened" });
  }
};

export const forgotPassVerifyOTP = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    const sessionOtp = (req.session as CustomSessionData).forgotPasswordOTP;
    const otpCreatedAt = (req.session as CustomSessionData).otpCreatedAt;

    if (!sessionOtp || !otpCreatedAt) {
      res.status(400).json({
        success: false,
        message: "Required data is missing in session",
      });
      return;
    }

    const currentTimestamp = Date.now();
    const timeElapsed = (currentTimestamp - (otpCreatedAt as number)) / 1000;

    if (timeElapsed > 60) {
      res.status(400).json({
        success: false,
        message: "OTP has expired",
        expired: true,
      });
      return;
    }

    if (sessionOtp === otp) {
      res.json({ success: true, message: "OTP verified" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something error happened" });
  }
};

export const resetPass = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const securedPassword = await securePassword(password);
    const sessionforgotPasswordEmail = (req.session as CustomSessionData)
      .forgotPasswordEmail;

    if (!sessionforgotPasswordEmail) {
      return res.status(400).json({ message: "Session data is missing." });
    }

    const passwordUpdated = await findGuestByEmailandUpdatePassword(
      sessionforgotPasswordEmail,
      securedPassword
    );
    if (passwordUpdated) {
      res.json({ success: true, message: "Password updated" });
    } else {
      res.status(400).json({ success: false, message: "Cant Update password" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something error happened" });
  }
};

export const fetchHotels = async (req: Request, res: Response) => {
  try {
    const requestData = await findHotels();
    res.json(requestData);
  } catch (error) {
    throw new Error("Something error happened");
  }
};

export const fetchHotelDetail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const hotelData = await findHostDetails(id);
    res.json(hotelData);
  } catch (error) {
    throw new Error("Something error happened");
  }
};

export const fetchSearchResults = async (req: Request, res: Response) => {
  try {
    const {
      location,
      checkInDate,
      checkOutDate,
      guestCount,
      page = 1,
      limit = 10,
    } = req.body;
    const skip = (page - 1) * limit;
    const HotelsInLocation =
      (await findHostsBasedOnLocation(location, skip, limit)) || [];

    const datesBetween = generateDateRange(checkInDate, checkOutDate);

    const filteredHotels = filteredHotelsByDate(
      HotelsInLocation,
      datesBetween,
      guestCount
    );

    

    const totalCount = await HostSchema.countDocuments({
      $or: [{ state: location }, { city: location }],
    });

    res.json({
      data: filteredHotels,
      total: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something error happened" });
  }
};

interface AuthenticatedRequest extends Request {
  user?: any;
}

const jwtSecretKey = process.env.JWT_SECRET_KEY;

export const fetchGuestDetails = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authorization token is missing");
    }
    const decoded = Jwt.verify(token, jwtSecretKey as Secret);
    req.user = decoded;

    const guestData = await findGuestDetails(req.user._id);
    res.json(guestData);
  } catch (error) {
    throw new Error("Something error happened");
  }
};

export const uploadProfilePic = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { image } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authorization token is missing");
    }
    const decoded = Jwt.verify(token, jwtSecretKey as Secret);
    req.user = decoded;

    const profilePicLink = await uploadSingleToCloudinary(image);
    await uploadImagetoDb(req.user._id, profilePicLink);

    res.status(200).json({
      message: "Successfully uploaded.",
      imageUrl: profilePicLink,
    });
  } catch (error) {
    console.error("Error in uploadProfilePic:", error);
    res.status(500).json({ message: "Failed to upload image." });
  }
};

export const updateUsername = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { username } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authorization token is missing");
    }
    const decoded = Jwt.verify(token, jwtSecretKey as Secret);
    req.user = decoded;

    if (!username) {
      return res.status(400).json({ message: "Username is required." });
    }

    await updateUsernameInDB(req.user._id, username);

    res.status(200).json({
      message: "Successfully updated username.",
      username: username,
    });
  } catch (error) {
    console.error("Error in updateUsername:", error);
    res.status(500).json({ message: "Failed to update username." });
  }
};
type Address = {
  line1: string;
  place: string;
  city: string;
  state: string;
  country: string;
  PIN: string;
};

export const addAddress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    type Address = {
      line1: string;
      place: string;
      city: string;
      state: string;
      country: string;
      PIN: string;
    };

    const { line1, place, city, state, country, PIN } = req.body;

    const address: Address = {
      line1: line1,
      place: place,
      city: city,
      state: state,
      country: country,
      PIN: PIN,
    };

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Authorization token is missing");
    }

    const decoded = Jwt.verify(token, jwtSecretKey as Secret);
    req.user = decoded;

    if (!address) {
      return res.status(400).json({ message: "Address is required." });
    }

    await updateAddressInDB(req.user._id, address);

    res.status(200).json({
      message: "Successfully updated address.",
      address: address,
    });
  } catch (error) {
    console.error("Error in addAddress:", error);

    res.status(500).json({ message: "Failed to update address." });
  }
};

export const addOrRemoveFromFavourites = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const hotelId = req.body.hotelId;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authorization token is missing");
    }
    const decoded = Jwt.verify(token, jwtSecretKey as Secret);
    req.user = decoded;
    await addOrRemoveFromFavouritesInDB(req.user._id, hotelId);
    res.status(200).json({
      message: "Successfully updated favourites.",
    });
  } catch (error) {
    console.error("Error in updating favourites", error);
    res.status(500).json({ message: "Failed to update favourites" });
  }
};

export const proceedToPay = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const {
      checkInDate,
      checkOutDate,
      guestCount,
      roomType,
      totalAmountWithGST,
    } = req.body;

    const hostData = await findHostByID(id);

    const datesBetween = generateDateRange(checkInDate, checkOutDate);

    if (hostData) {
      const filteredHotels = updatingfilteredHotelByDate(
        hostData,
        datesBetween,
        guestCount
      );

      if (filteredHotels.length > 0) {
        const order = await createRazorpayOrder(totalAmountWithGST, res);

        res.status(200).json({
          success: true,
          message: "Data successfully retrieved from server",
          data: {
            hotels: filteredHotels,
            razorpayOrder: order,
          },
        });
      } else {
        res.status(200).json({
          success: false,
          message: "No hotels found for the specified criteria",
        });
      }
    }
  } catch (error) {
    console.error("Error in updating favourites", error);
    res.status(500).json({ message: "Failed to update favourites" });
  }
};

export const paymentCompleted = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const {
      checkInDate,
      checkOutDate,
      guestCount,
      roomType,
      totalAmountWithGST,
    } = req.body;

    const updatedHost = await HostSchema.findOneAndUpdate(
      { _id: id },
      { $inc: { hostWallet: totalAmountWithGST } },
      { new: true }
    );

    const bookingDetails: Booking = {
      hotelId: id,
      checkIn: new Date(checkInDate),
      checkOut: new Date(checkOutDate),
      roomType: roomType,
      guestCount: guestCount,
      bookingDate: new Date(),
      bookingStatus: "confirmed",
      totalAmount: totalAmountWithGST,
    };

    const updatedUser = await GuestSchema.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { bookings: bookingDetails } },
      { new: true }
    );

    if (!updatedUser || !updatedHost) {
      return res.status(404).json({
        success: false,
        message: "User or host not found",
      });
    }

    const datesBetween = generateDateRange(checkInDate, checkOutDate);

    const booked = Math.ceil(guestCount / 3);

    for (const date of datesBetween) {
      updatedHost.roomTypes.forEach((room) => {
        if (room.type === roomType) {
          const existingSlotIndex = room.dailySlots.findIndex(
            (slot) =>
              slot.date.toISOString().split("T")[0] ===
              new Date(date).toISOString().split("T")[0]
          );

          if (existingSlotIndex !== -1) {
            room.dailySlots[existingSlotIndex].booked += booked;
          } else {
            room.dailySlots.push({
              date: new Date(date),
              booked: booked,
            });
          }
        }
      });
    }

    await updatedHost.save();

    res.status(200).json({
      success: true,
      message: "Booking details updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Error in updating booking details", error);
    res.status(500).json({ message: "Failed to update booking details" });
  }
};














export const fetchBookedHotels = async (req: Request, res: Response) => {
  try {
    const { hotelIds } = req.body;
    if (!Array.isArray(hotelIds) || hotelIds.length === 0) {
      return res.status(400).json({ error: "Invalid or empty hotelIds array" });
    }
    const bookedHotels = await fetchBookedHotelsFunction(hotelIds);
    res.json({ bookedHotels });
  } catch (error) {
    console.error("Error fetching booked hotels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;

    const updatedBooking = await GuestSchema.findOneAndUpdate(
      { "bookings._id": bookingId },
      { $set: { "bookings.$.bookingStatus": "completed" } },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      message: "Booking status updated successfully",
      updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;

    const booking = await GuestSchema.findOne({ "bookings._id": bookingId });

    if (!booking || !booking.bookings || !Array.isArray(booking.bookings)) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const bookingDetails = booking.bookings.find(b => b && b._id && b._id.toString() === bookingId);
    if (!bookingDetails) {
      return res.status(404).json({ message: "Booking details not found" });
    }

    const { totalAmount, hotelId, checkIn, checkOut, roomType, guestCount } = bookingDetails;

    const updatedBooking = await GuestSchema.findOneAndUpdate(
      { "bookings._id": bookingId },
      { $set: { "bookings.$.bookingStatus": "cancelled" } },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await HostSchema.findOneAndUpdate(
      { _id: hotelId },
      { $inc: { hostWallet: -totalAmount } },
      { new: true }
    );

    await GuestSchema.findOneAndUpdate(
      { "bookings._id": bookingId },
      { $inc: { Wallet: totalAmount } },
      { new: true }
    );

    const datesBetween = generateDateRange(checkIn.toISOString(), checkOut.toISOString());
    const booked = Math.ceil(guestCount / 3);

    const updatedHost = await HostSchema.findById(hotelId);

    if (updatedHost) {
      for (const date of datesBetween) {
        updatedHost.roomTypes.forEach((room) => {
          if (room.type === roomType) {
            const existingSlotIndex = room.dailySlots.findIndex(
              (slot) =>
                slot.date.toISOString().split("T")[0] ===
                new Date(date).toISOString().split("T")[0]
            );

            if (existingSlotIndex !== -1) {
              room.dailySlots[existingSlotIndex].booked -= booked;
            }
          }
        });
      }

      await updatedHost.save();
    }

    res.json({
      message: "Booking status updated successfully",
      updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const submitRatingAndReview = async (req: Request, res: Response) => {
  try {
    const { bookingIdForReview } = req.body.payload;

    const guest = await GuestSchema.findOne({
      'bookings._id': bookingIdForReview,
    });

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found for the given booking ID' });
    }

    if (!guest.bookings || !Array.isArray(guest.bookings)) {
      return res.status(404).json({ error: 'Guest bookings not found or invalid' });
    }

    const booking = guest.bookings.find(
      (booking) => booking && booking._id && booking._id.toString() === bookingIdForReview
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found for the given booking ID' });
    }

    const hotelId = booking.hotelId;
    const guestId = guest._id;

    const { selectedStars, review } = req.body.payload;

    await HostSchema.findByIdAndUpdate(
      hotelId,
      {
        $push: {
          reviews: { guestId, bookingId: bookingIdForReview,rating: selectedStars, comment: review },
        },
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Rating and review submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

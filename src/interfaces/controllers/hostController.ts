import { Request, Response } from "express";
import {
  findHostByEmail,
  findHostByEmailandUpdatePassword,
  findHostDetails,
  hostLevelUpdate,
  requestReapplyLevelUpdate,
  editHostDetailsInDB,
} from "../../repositories/hostRepository";
import { SessionData } from "express-session";
import {
  generateOTP,
  sendOtpMail,
} from "../../usecases/hostUsecases/signupOTPHost";
import { createHost } from "../../usecases/hostUsecases/createHost";
import {
  loginHost,
  LoginResponse,
} from "../../usecases/hostUsecases/loginHost";
import { sendOtpMailForForgotPass } from "../../usecases/guestUsecases/sendOtpMailForForgotPass";
import { securePassword } from "../../services/bcrypt";
import { uploadHostDetails } from "../../usecases/hostUsecases/uploadHostDetails";
import { uploadMultipleToCloudinary } from "../../usecases/hostUsecases/uploadToCloudinary";
import Jwt, { Secret } from "jsonwebtoken";

interface CustomSessionData extends SessionData {
  otp?: string;
  hostname?: string;
  email?: string;
  phone?: string;
  password?: string;
  forgotPasswordOTP?: string;
  forgotPasswordEmail?: string;
  otpCreatedAt?: Number;
}

export const sendOTPHost = async (req: Request, res: Response) => {
  try {
    const { username, email, phone, password } = req.body;

    const existingHost = await findHostByEmail(email);
    if (!existingHost) {
      const generatedOtp = generateOTP();
      const otpCreatedAt = Date.now();
      (req.session as CustomSessionData).otp = generatedOtp;
      (req.session as CustomSessionData).hostname = username;
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
      res.status(400).json({ error: "A host with this email already exists." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something error happened" });
  }
};

export const resendOTPHost = async (req: Request, res: Response) => {
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

export const verifyOTPHost = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    const sessionOtp = (req.session as CustomSessionData).otp;
    const sessionHostName = (req.session as CustomSessionData).hostname;
    const sessionEmail = (req.session as CustomSessionData).email;
    const sessionPhone = (req.session as CustomSessionData).phone;
    const sessionPassword = (req.session as CustomSessionData).password;
    const otpCreatedAt = (req.session as CustomSessionData).otpCreatedAt;

    if (
      !sessionHostName ||
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
      await createHost(
        sessionHostName,
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

export const hostLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const response: LoginResponse | { error: string } = await loginHost(
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

export const forgotPassHost = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required." });
    }

    const existingGuest = await findHostByEmail(email);
    if (existingGuest) {
      const generatedOtp = generateOTP();
      const otpCreatedAt = Date.now();
      (req.session as CustomSessionData).forgotPasswordOTP = generatedOtp;
      (req.session as CustomSessionData).forgotPasswordEmail = email;
      (req.session as CustomSessionData).otpCreatedAt = otpCreatedAt;

      setTimeout(() => {
        delete (req.session as CustomSessionData).forgotPasswordOTP;
      }, 60000);

      const result = await sendOtpMailForForgotPass(email, generatedOtp);
      res.json(result);
    } else {
      res.status(400).json({ error: "A host with this email doesn't exists." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something error happened" });
  }
};

export const forgot_pass_host_resnd_OTP = async (
  req: Request,
  res: Response
) => {
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

export const forgotPassHostVerifyOTP = async (req: Request, res: Response) => {
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

export const resetPassHost = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const securedPassword = await securePassword(password);
    const sessionforgotPasswordEmail = (req.session as CustomSessionData)
      .forgotPasswordEmail;

    if (!sessionforgotPasswordEmail) {
      return res.status(400).json({ message: "Session data is missing." });
    }

    const passwordUpdated = await findHostByEmailandUpdatePassword(
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

interface AuthenticatedRequest extends Request {
  user?: any;
}

const jwtSecretKey = process.env.JWT_SECRET_KEY;

export const getHostDetails = async (
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
    
    const hostDetails = await findHostDetails(req.user._id);

    res.json(hostDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const submitHostDetails = async (req: Request, res: Response) => {
  try {
    const {
      email,
      hotelName,
      hotelRating,
      gst,
      pan,
      amenities,
      hotelImages,
      roomTypes,
      roomCounts,
      roomFares,
      roomAmenities,
      roomImages,
      place,
      city,
      state,
      country,
      pin,
      policyFile,
      propertyDoc,
      ownerDoc,
    } = req.body;
    

    const {
      "Standard Room": standardRoomCount = 0,
      "Deluxe Room": deluxeRoomCount = 0,
      "Suite Room": suiteRoomCount = 0,
    } = roomCounts;

    const {
      "Standard Room": standardRoomFare,
      "Deluxe Room": deluxeRoomFare,
      "Suite Room": suiteRoomFare,
    } = roomFares;

    const {
      "Standard Room": standardRoomAmenities,
      "Deluxe Room": deluxeRoomAmenities,
      "Suite Room": suiteRoomAmenities,
    } = roomAmenities;

    const getUploadPromise = (imageType: RoomType) =>
      roomImages[imageType]
        ? uploadMultipleToCloudinary(roomImages[imageType])
        : Promise.resolve([]);

    const [
      hotelImageLinks,
      standardRoomImageLinks,
      deluxeRoomImageLinks,
      suiteRoomImageLinks,
      policyFileLinks,
      propertyDocLinks,
      ownerDocLinks,
    ] = await Promise.all([
      uploadMultipleToCloudinary(hotelImages),
      getUploadPromise("Standard Room"),
      getUploadPromise("Deluxe Room"),
      getUploadPromise("Suite Room"),
      uploadMultipleToCloudinary(policyFile),
      uploadMultipleToCloudinary(propertyDoc),
      uploadMultipleToCloudinary(ownerDoc),
    ]);

    type RoomType = "Standard Room" | "Deluxe Room" | "Suite Room";

    const constructedRoomTypes = roomTypes.map((type: RoomType) => {
      let roomCount, roomFare, roomAmenities, roomImageLinks;

      switch (type) {
        case "Standard Room":
          roomCount = standardRoomCount;
          roomFare = standardRoomFare;
          roomAmenities = standardRoomAmenities;
          roomImageLinks = standardRoomImageLinks;
          break;
        case "Deluxe Room":
          roomCount = deluxeRoomCount;
          roomFare = deluxeRoomFare;
          roomAmenities = deluxeRoomAmenities;
          roomImageLinks = deluxeRoomImageLinks;
          break;
        case "Suite Room":
          roomCount = suiteRoomCount;
          roomFare = suiteRoomFare;
          roomAmenities = suiteRoomAmenities;
          roomImageLinks = suiteRoomImageLinks;
          break;
      }

      return {
        type,
        roomCount,
        roomFare,
        roomAmenities,
        roomImageLinks,
      };
    });

    await uploadHostDetails(
      email,
      hotelName,
      hotelRating,
      gst,
      pan,
      amenities,
      hotelImageLinks,
      constructedRoomTypes,
      place,
      city,
      state,
      country,
      pin,
      policyFileLinks,
      propertyDocLinks,
      ownerDocLinks
    );
    await hostLevelUpdate(email);

    res.json({ success: true, message: "Host Data saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const handleReapply = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const hostData = await findHostByEmail(email);
    if (hostData) {
      const id = hostData?._id;

      const response = await requestReapplyLevelUpdate(id);
      if (response) {
        res.json(response);
      } else {
        res.status(404).json({ message: "Request not found." });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something error happened" });
  }
};

export const updateHostDetails = async (req: Request, res: Response) => {
  try {
    const {
      id,
      hotelName,
      hotelRating,
      amenities,
      roomTypes,
      roomCounts,
      roomFares,
      roomAmenities,
    } = req.body;

    const {
      "Standard Room": standardRoomCount = 0,
      "Deluxe Room": deluxeRoomCount = 0,
      "Suite Room": suiteRoomCount = 0,
    } = roomCounts;

    const {
      "Standard Room": standardRoomFare,
      "Deluxe Room": deluxeRoomFare,
      "Suite Room": suiteRoomFare,
    } = roomFares;

    const {
      "Standard Room": standardRoomAmenities,
      "Deluxe Room": deluxeRoomAmenities,
      "Suite Room": suiteRoomAmenities,
    } = roomAmenities;

    type RoomType = "Standard Room" | "Deluxe Room" | "Suite Room";

    const constructedRoomTypes = roomTypes.map((type: RoomType) => {
      let roomCount, roomFare, roomAmenities;

      switch (type) {
        case "Standard Room":
          roomCount = standardRoomCount;
          roomFare = standardRoomFare;
          roomAmenities = standardRoomAmenities;
          break;
        case "Deluxe Room":
          roomCount = deluxeRoomCount;
          roomFare = deluxeRoomFare;
          roomAmenities = deluxeRoomAmenities;
          break;
        case "Suite Room":
          roomCount = suiteRoomCount;
          roomFare = suiteRoomFare;
          roomAmenities = suiteRoomAmenities;
          break;
      }

      return {
        type,
        roomCount,
        roomFare,
        roomAmenities,
      };
    });

    const updatedHostDetails = {
      hotelName,
      hotelRating,
      amenities,
      roomTypes: constructedRoomTypes,
    };

    await editHostDetailsInDB(id, updatedHostDetails);

    res.json({ success: true, message: "Host Data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

import { Router } from "express";
import {
  sendOTP,
  resendOTP,
  verifyOTP,
  guestLogin,
  forgotPass,
  forgotPassVerifyOTP,
  resetPass,
  fetchHotels,
  fetchHotelDetail,
  forgot_pass_resnd_OTP,
  fetchSearchResults,
  fetchGuestDetails,
  uploadProfilePic,
  updateUsername,
  addAddress,
  addOrRemoveFromFavourites,
  proceedToPay,
  paymentCompleted,
  fetchBookedHotels,
  updateBookingStatus,
  cancelBooking,
  
} from "../controllers/guestController";
import {verifyToken} from '../../middlewares/verifyToken';

const guestRoute = Router();

guestRoute.post("/sendOTP", sendOTP);
guestRoute.get("/resendOTP", resendOTP);
guestRoute.post("/login", guestLogin);
guestRoute.post("/verifyotp", verifyOTP);
guestRoute.post("/forgot_pass", forgotPass);
guestRoute.get("/forgot_pass_resnd_OTP", forgot_pass_resnd_OTP);
guestRoute.post("/forgot_pass_verifyOTP", forgotPassVerifyOTP);
guestRoute.post("/resetPass", resetPass);
guestRoute.get("/fetchHotels", fetchHotels);
guestRoute.get("/fetchHotelDetail/:id", fetchHotelDetail);
guestRoute.post("/fetchSearchResults", fetchSearchResults);

guestRoute.get("/fetchGuestDetails",verifyToken, fetchGuestDetails);
guestRoute.post("/uploadProfilePic",verifyToken, uploadProfilePic);
guestRoute.put("/updateUsername",verifyToken, updateUsername);
guestRoute.put("/addAddress",verifyToken, addAddress);
guestRoute.post("/addOrRemoveFromFavourites",verifyToken, addOrRemoveFromFavourites);
guestRoute.post("/proceedToPay/:id", verifyToken, proceedToPay);
guestRoute.post("/paymentCompleted/:id", verifyToken, paymentCompleted);
guestRoute.post("/fetchBookedHotels", verifyToken, fetchBookedHotels);
guestRoute.put("/updateBookingStatus", verifyToken, updateBookingStatus);
guestRoute.post("/cancelBooking", verifyToken, cancelBooking);


export default guestRoute;


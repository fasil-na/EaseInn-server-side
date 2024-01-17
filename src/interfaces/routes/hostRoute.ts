import { Router } from "express";
import { sendOTPHost, verifyOTPHost, hostLogin, forgotPassHost, forgotPassHostVerifyOTP, resetPassHost, getHostDetails, submitHostDetails, resendOTPHost, forgot_pass_host_resnd_OTP, handleReapply,updateHostDetails } from "../controllers/hostController";
import {verifyToken} from '../../middlewares/verifyToken';

const hostRoute =Router()



hostRoute.post('/sendOTPHost', sendOTPHost);
hostRoute.get('/resendOTPHost', resendOTPHost);
hostRoute.post('/verifyotpHost', verifyOTPHost);
hostRoute.post('/loginHost', hostLogin);
hostRoute.post('/forgot_pass_host', forgotPassHost);
hostRoute.get('/forgot_pass_host_resnd_OTP', forgot_pass_host_resnd_OTP);
hostRoute.post('/forgot_pass_host_verifyOTP', forgotPassHostVerifyOTP);
hostRoute.post('/resetPassHost', resetPassHost);

hostRoute.get('/getHostDetails',verifyToken, getHostDetails);
hostRoute.post('/submitHostDetails',verifyToken, submitHostDetails);
hostRoute.patch('/handleReapply/:email', handleReapply);
hostRoute.post('/updateHostDetails', updateHostDetails);


export default hostRoute
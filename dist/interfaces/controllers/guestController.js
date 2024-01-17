"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendOTP = void 0;
const guestRepository_1 = require("../../repositories/guestRepository");
const signupOTP_1 = require("../../usecases/guestUsecases/signupOTP");
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const existingGuest = yield (0, guestRepository_1.findGuestByEmail)(email);
        if (!existingGuest) {
            const generatedOtp = (0, signupOTP_1.generateOTP)();
            req.session.otp = generatedOtp;
            const result = yield (0, signupOTP_1.sendOtpMail)(email, generatedOtp);
            res.json(result);
        }
        else {
        }
    }
    catch (error) {
        throw new Error("Something error happened");
    }
});
exports.sendOTP = sendOTP;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;

        //   const existingGuest = await findGuestByEmail(email);
        //   if (!existingGuest) {
        //     const generatedOtp = generateOTP();
        //     const result = await sendOtpMail(email, generatedOtp);
        //     res.json(result);
        //   } else {
        //   }
    }
    catch (error) {
        throw new Error("Something error happened");
    }
});
exports.verifyOTP = verifyOTP;

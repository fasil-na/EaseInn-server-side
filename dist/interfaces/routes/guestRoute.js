"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guestController_1 = require("../controllers/guestController");
const guestRoute = (0, express_1.Router)();
guestRoute.post('/sendOTP', guestController_1.sendOTP);
guestRoute.post('/verifyotp', guestController_1.verifyOTP);
exports.default = guestRoute;

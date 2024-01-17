"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const adminRoute = (0, express_1.Router)();
adminRoute.post('/login', adminController_1.loginAdmin);
exports.default = adminRoute;

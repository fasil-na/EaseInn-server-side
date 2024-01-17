"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hostController_1 = require("../controllers/hostController");
const hostRoute = (0, express_1.Router)();
hostRoute.post('/signup', hostController_1.hostSignup);
exports.default = hostRoute;

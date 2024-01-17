"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateadminToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateadminToken = () => {
    const adminData = {
        email: "admin@gmail.com",
        password: "123"
    };
    const { email } = adminData;
    const jwtSecretKey = "t9rXw5bF2mS7zQ8p";
    const token = jsonwebtoken_1.default.sign({ email }, jwtSecretKey);
    return token;
};
exports.generateadminToken = generateadminToken;

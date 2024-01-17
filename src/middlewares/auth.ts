import Jwt from "jsonwebtoken";
import { GuestInterface } from "../entities/guestModel";
import { HostInterface } from "../entities/hostModel";

export const generateadminToken = () => {
  const adminData = {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: process.env.ADMIN_ROLE,
  };
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (!jwtSecretKey) {
    throw new Error("JWT Secret key must be set!");
  }
  const { email } = adminData;
  const token = Jwt.sign({ email }, jwtSecretKey);
  return token;
};

export const generateAuthToken = (existingGuest: GuestInterface): string => {
  const { _id, username, email, phone } = existingGuest;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (!jwtSecretKey) {
    throw new Error("JWT Secret key must be set!");
  }
  const token = Jwt.sign({ _id, username, email, phone }, jwtSecretKey);
  return token;
};

export const generateHostAuthToken = (existingHost: HostInterface): string => {
  const { _id, username, email, phone } = existingHost;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (!jwtSecretKey) {
    throw new Error("JWT Secret key must be set!");
  }
  const token = Jwt.sign({ _id, username, email, phone }, jwtSecretKey);
  return token;
};







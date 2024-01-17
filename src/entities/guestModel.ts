import mongoose, { Document, Schema } from "mongoose";

export interface Address {
  line1?: string;
  place?: string;
  city?: string;
  state?: string;
  country?: string;
  PIN?: string;
}

export interface Booking {
  _id?: string;
  hotelId: string;
  checkIn: Date;
  checkOut: Date;
  roomType: string;
  guestCount: number;
  bookingDate: Date;
  cancelDate?: Date;
  bookingStatus: string;
  totalAmount: number;
}

export interface GuestInterface extends Document {
  username: string;
  email: string;
  phone: number;
  password: string;
  role?: string;
  status?: string;
  Wallet?: number;
  profilePic?: string;
  address?: Address;
  privilege?: number;
  favoriteHotels?: string[];
  bookings?: Booking[];
}

const AddressSchema = new Schema({
  line1: {
    type: String,
    trim: true,
    sparse: true,
  },
  place: {
    type: String,
    trim: true,
    sparse: true,
  },
  city: {
    type: String,
    trim: true,
    sparse: true,
  },
  state: {
    type: String,
    trim: true,
    sparse: true,
  },
  country: {
    type: String,
    trim: true,
    sparse: true,
  },
  PIN: {
    type: String,
    sparse: true,
  },
});

const BookingSchema = new Schema({
  hotelId: {
    type: String,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  roomType: {
    type: String,
    required: true,
  },
  guestCount: {
    type: Number,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  cancelDate: {
    type: Date,
  },
  bookingStatus: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed",
  },
  totalAmount: {
    type: Number,
  },
});

const GuestSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Guest",
  },
  status: {
    type: String,
    default: "Active",
  },
  Wallet: {
    type: Number,
    default: 0,
  },
  profilePic: {
    type: String,
  },
  address: AddressSchema,
  privilege: {
    type: Number,
    default: 0,
  },
  favoriteHotels: {
    type: [String],
    default: [],
  },
  bookings: {
    type: [BookingSchema],
    default: [],
  },
});

export default mongoose.model<GuestInterface>("guest", GuestSchema);

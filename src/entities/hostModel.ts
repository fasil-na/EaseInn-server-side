import mongoose, { Document, Schema } from "mongoose";

interface Review {
  guestId: string;
  bookingId:String;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema<Review>({
  guestId: { type: String, required: true },
  bookingId: { type: String, required: true },
  rating: { type: Number,required: true },
  comment: { type: String },
});

const dailySlotSchema = new Schema({
  date: Date,
  booked: { type: Number, default: 0 },
});

const roomTypeSchema = new Schema({
  type: String,
  roomCount: { type: Number, required: true },
  roomFare: Number,
  roomAmenities: [String],
  roomImageLinks: [String],
  guestCapacity: { type: Number, default: 3 }, 
  dailySlots: { type: [dailySlotSchema], default: [] },
});

export interface HostInterface extends Document {
  username: string;
  email: string;
  phone: number;
  password: string;
  role: "Host";
  status: "Active";
  level: number;
  hotelName: String;
  hotelRating: Number;
  gst: String;
  pan: String;
  amenities: string[];
  hotelImageLinks: string[];
  place: String;
  city: String;
  state: String;
  country: String;
  pin: Number;
  policyFileLinks: string[];
  propertyDocLinks: string[];
  ownerDocLinks: string[];
  roomTypes: {
    type: string;
    roomCount: number;
    roomFare: number;
    roomAmenities: string[];
    dailySlots: {
      date: Date;
      booked:number;
    }[];
    roomImageLinks: string[];
    guestCapacity: number;
  }[];
}

const HostSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "Host" },
  status: { type: String, default: "Active" },
  level: { type: Number, default: 0 },
  hostWallet: { type: Number, default: 0 },
  hotelName: String,
  hotelRating: Number,
  gst: String,
  pan: String,
  amenities: [String],
  hotelImageLinks: [String],
  place: String,
  city: String,
  state: String,
  country: String,
  pin: Number,
  policyFileLinks: [String],
  propertyDocLinks: [String],
  ownerDocLinks: [String],
  roomTypes: [roomTypeSchema],
  reviews: [reviewSchema],});

export default mongoose.model<HostInterface>("host", HostSchema);

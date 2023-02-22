import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  phone: { type: Number },
  dob: { type: String },
  fcm: { type: String },
  address: { type: String },
  location: { type: [String] },
  image: { type: String },
  aadhar: { type: String },
  join_date: { type: String },
});

const Dealer = mongoose.model("dealer", userSchema);

export default Dealer;

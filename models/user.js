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
  image: { type: String },
  aadhar: { type: String },
  join_date: { type: String },
});

const User = mongoose.model("user", userSchema);
export const RecoveryStaff = mongoose.model("recoveryStaff", userSchema);
export const OfficeStaff = mongoose.model("officeStaff", userSchema);

export default User;

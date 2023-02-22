import mongoose from "mongoose";

const subadminSchema = new mongoose.Schema({
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
  isActive: {
    type: Boolean,
    default: true,
  },
  fcm: {
    type: String,
  },
  type: {
    type: String,
    default: "subadmin",
  },
  phone: { type: Number },
  dob: { type: String },
  address: { type: String },
  image: { type: String },
  aadhar: { type: String },
  join_date: { type: String },
});

const SubAdmin = mongoose.model("subadmin", subadminSchema);

export default SubAdmin;

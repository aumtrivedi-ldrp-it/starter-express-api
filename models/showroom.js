import mongoose from "mongoose";

const dealerBSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: Number },
  fcm: { type: String },
});

export const showroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner_name: {
    type: String,
  },
  location: { type: String },
  dealers: { type: [dealerBSchema] },
});

const Showroom = mongoose.model("showroom", showroomSchema);

export default Showroom;

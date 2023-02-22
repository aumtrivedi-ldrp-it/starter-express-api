import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
  },
});

const RequestReset = mongoose.model("request", requestSchema);

export default RequestReset;

import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  schemePercentage: {
    type: Number,
    required: true,
  },
});

const Scheme = mongoose.model("scheme", schemeSchema);

export default Scheme;

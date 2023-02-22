import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  doformId: { type: mongoose.Schema.Types.ObjectId, ref: "doform" },
  loanAgreementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "loanagreementform",
  },
  password: { type: String, required: true },
  image: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "vehicle" },
});

customerSchema.index({ name: "text" });

const Customer = mongoose.model("customer", customerSchema);

export default Customer;

import mongoose from "mongoose";

export const chequeSchema = new mongoose.Schema(
  {
    chequeNumber: { type: String, required: true },
    chequeDate: { type: Date, required: true },
    paymentDate: { type: Date },
    emi: { type: Number, required: true },
    payedAmount: { type: Number },
    extraCharge: { type: Number },
    isPaid: { type: Boolean, default: false },
    paymentReceivedBy: { type: String },
    paymentReceivedById: { type: String },
    gstCharges: { type: Number },
    penaltyCharges: { type: Number },
    modeOfPayment: { type: String },
    cashType: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true }
);

const Cheque = mongoose.model("cheque", chequeSchema);

export default Cheque;

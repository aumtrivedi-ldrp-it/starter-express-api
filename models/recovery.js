import mongoose from "mongoose";

export const recoverySchema = new mongoose.Schema(
  {
    loanAgreement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "loanagreementform",
    },
    recoveryStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recoveryStaff",
    },
  },
  { timestamps: true }
);

const Recovery = mongoose.model("recovery", recoverySchema);

export default Recovery;

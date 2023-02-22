import mongoose from "mongoose";

const doformSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: () => new Date(),
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dealer",
    },
    customerName: { type: String, required: true },
    customerFatherOrHusbandName: { type: String, required: true },
    customerMobileNumber: {
      type: Number,
      required: true,
    },
    customerAddressLandMark: { type: String, required: true },
    customerAddressWardNumber: { type: String, required: true },
    customerAddressVillageName: { type: String, required: true },
    customerAddressPostalCode: { type: String, required: true },
    customerAddressDivision: { type: String, required: true },
    customerAddressDistrict: { type: String, required: true },
    differenceBetweenCustomerAddressAndShowroom: {
      type: String,
      required: true,
    },
    customerOccupation: { type: String, required: true },
    customerMonthlyIncome: { type: String, required: true },
    customerDesignation: { type: String, required: true },
    customerOfficeAddress: { type: String, required: true },
    customerFarmArea: { type: String, required: true },
    vehicle: { type: String, required: true },
    vehicleExShowroomPrice: { type: Number, required: true },
    vehicleRtoPrice: { type: Number, required: true },
    vehicleInsurancePrice: { type: Number, required: true },
    vehicleOtherPrices: { type: Number, required: true },
    vehicleOnRoadPrice: { type: Number, required: true },
    vehicleLA: { type: Number, required: true },
    vehicleEmiAmount: { type: Number, required: true },
    vehicleTotalEmiCount: { type: Number, required: true },
    vehicleLTV: { type: Number, required: true },
    vehicleScheme: { type: Number, required: true },
    reference1Name: { type: String, required: true },
    reference1FatherOrHusbandName: { type: String, required: true },
    reference1Village: { type: String, required: true },
    reference1PostalCode: { type: String, required: true },
    reference1Division: { type: String, required: true },
    reference1District: { type: String, required: true },
    reference1MobileNumber: {
      type: Number,
      required: true,
    },
    reference2Name: { type: String, required: true },
    reference2FatherOrHusbandName: { type: String, required: true },
    reference2Village: { type: String, required: true },
    reference2PostalCode: { type: String, required: true },
    reference2Division: { type: String, required: true },
    reference2District: { type: String, required: true },
    reference2MobileNumber: {
      type: Number,
      required: true,
    },
    isApproved: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    reasonForCancellation: { type: String },
    dealerPaymentDate: { type: String },
    salesExecutiveName: { type: String, required: true },
    salesExecutiveSignature: { type: String, required: true },
    branchHeadName: { type: String, required: true },
    branchHeadSignature: { type: String, required: true },
    dealerSignature: { type: String, required: true },
    isLoanAgreementFilled: { type: Boolean, default: false },
    formLink: { type: String, required: true },
    message: {type: String}
  },
  { timestamps: true }
);

const DoForm = mongoose.model("doform", doformSchema);

export default DoForm;

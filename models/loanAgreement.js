import mongoose from "mongoose";
import { chequeSchema } from "./cheques.js";

const loanAgreementSchema = new mongoose.Schema(
  {
    mf_no: { type: String, required: true },
    showroom_acc_no: { type: String },
    key_no: { type: String },
    branch_name: { type: String },
    party_name: { type: String },
    customer_image: { type: String },
    customer_signature: { type: String },
    guarnteer_image: { type: String },
    guarnteer_signature: { type: String },
    vehicle_company_name: { type: String },
    model_no: { type: String },
    engine_no: { type: String },
    vehicle_color: { type: String },
    vehicle_value: { type: Number },
    chassis_no: { type: String },
    vehicle_period_of_stay: { type: Number },
    customer_name: { type: String },
    father_or_husband_name: { type: String },
    mobile_no: { type: Number },
    landmark: { type: String },
    ward_no: { type: String },
    village_name: { type: String },
    postal_code: { type: String },
    division: { type: String },
    district_name: { type: String },
    city: { type: String },
    state: { type: String },
    occupation: { type: String },
    monthly_income: { type: Number },
    farm_land_area: { type: String },
    guarnteer_name: { type: String },
    guarnteer_father_or_husband_name: { type: String },
    guarnteer_residence_mobile: { type: Number },
    guarnteer_office_mobile: { type: Number },
    guarnteer_landmark: { type: String },
    guarnteer_ward_no: { type: String },
    guarnteer_village: { type: String },
    guarnteer_postal_code: { type: String },
    guarnteer_division: { type: String },
    guarnteer_district_name: { type: String },
    guarnteer_city: { type: String },
    guarnteer_state: { type: String },
    vehicle_number: { type: String },

    // page 2
    loan_amount: { type: Number },
    loan_amount_in_words: { type: String },
    interest: { type: Number },
    tenure_in_months: { type: Number },
    emi: { type: Number },
    final_amount: { type: Number },
    interest_amount: { type: Number },
    document_charges: { type: Number },
    vehicle_amount: { type: Number },
    scheme: { type: mongoose.Schema.Types.ObjectId, ref: "scheme" },
    schemePercentage: { type: Number},

    // page 3
    bank_acc_no: { type: Number },
    bank_name: { type: String },
    bank_branch: { type: String },
    bank_address: { type: String },
    bank_acc_type: { type: String },
    cheques: {
      type: [chequeSchema],
    },

    // page 4
    lender_name: { type: String },
    lender_signature: { type: String },
    co_borrower_name: { type: String },
    co_borrower_signature: { type: String },
    co_borrower_signature_with_seal: { type: String },
    guarnator_2_name: { type: String },
    guarnator_2_signature: { type: String },

    // page 5
    sales_executive: { type: String },
    dealership: { type: String },
    guarnteer_2_residence_mobile: { type: Number },
    guarnteer_2_office_mobile: { type: Number },
    guarnteer_2_landmark: { type: String },
    guarnteer_2_ward_no: { type: String },
    guarnteer_2_village: { type: String },
    guarnteer_2_postal_code: { type: String },
    guarnteer_2_division: { type: String },
    guarnteer_2_district_name: { type: String },
    guarnteer_2_city: { type: String },
    guarnteer_2_state: { type: String },

    reference_1_name: { type: String },
    reference_1_residence_mobile: { type: Number },
    reference_1_office_mobile: { type: Number },
    reference_1_landmark: { type: String },
    reference_1_ward_no: { type: String },
    reference_1_village: { type: String },
    reference_1_postal_code: { type: String },
    reference_1_division: { type: String },
    reference_1_district_name: { type: String },
    reference_1_city: { type: String },
    reference_1_state: { type: String },
    reference_1_signature: { type: String },

    reference_2_name: { type: String },
    reference_2_residence_mobile: { type: Number },
    reference_2_office_mobile: { type: Number },
    reference_2_landmark: { type: String },
    reference_2_ward_no: { type: String },
    reference_2_village: { type: String },
    reference_2_postal_code: { type: String },
    reference_2_division: { type: String },
    reference_2_district_name: { type: String },
    reference_2_city: { type: String },
    reference_2_state: { type: String },
    reference_2_signature: { type: String },

    // page 6
    witness_1_name: { type: String },
    witness_1_mobile: { type: Number },
    witness_1_landmark: { type: String },
    witness_1_ward_no: { type: String },
    witness_1_village: { type: String },
    witness_1_postal_code: { type: String },
    witness_1_division: { type: String },
    witness_1_district_name: { type: String },
    witness_1_city: { type: String },
    witness_1_state: { type: String },
    witness_1_occupation: { type: String },
    witness_1_signature: { type: String },

    witness_2_name: { type: String },
    witness_2_mobile: { type: Number },
    witness_2_landmark: { type: String },
    witness_2_ward_no: { type: String },
    witness_2_village: { type: String },
    witness_2_postal_code: { type: String },
    witness_2_division: { type: String },
    witness_2_district_name: { type: String },
    witness_2_city: { type: String },
    witness_2_state: { type: String },
    witness_2_occupation: { type: String },
    witness_2_signature: { type: String },
    branch_head_signature_with_seal: { type: String },

    // page 7
    jurisdiction: { type: String },
    language: { type: String },
    court: { type: String },
    motor_vehicle_department: { type: String },
    isApproved: { type: Boolean, default: true },
    isRecover: { type: Boolean, default: false },

    //internal
    doformNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doform",
    },

    isLoanCompletelyPaid: {
      type: Boolean,
      default: false,
    },

    currentEmiPaidCount: {
      type: Number,
      default: 0,
    },

    totalEmi: {
      type: Number,
      required: true,
    },

    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer" },

    loanAgreementLink: { type: String },
  },
  { timestamps: true }
);

const LoanAgreement = mongoose.model("loanagreementform", loanAgreementSchema);

export default LoanAgreement;

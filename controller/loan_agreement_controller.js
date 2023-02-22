import LoanAgreement from "../models/loanAgreement.js";
import Cheque from "../models/cheques.js";
import moment from "moment";
import DoForm from "../models/doform.js";
import bcrypt from "bcrypt";
import Customer from "../models/customer.js";
import mongoose from "mongoose";
import * as fs from "fs";
import uploadfile from "../utils/uploadfile.js";
import pdf from "dynamic-html-pdf";
import got from "got";
import Vehicle from "../models/vehicle.js";

const convertImage = async (url) => {
  try {
    const response = await got(url, { responseType: "buffer" });
    const buffer =
      "data:" +
      response.headers["content-type"] +
      ";base64," +
      response.body.toString("base64");
    return buffer;
  } catch (error) {
    throw Error;
  }
};

export const createLoanAgreement = async (req, res) => {
  try {
    const {
      doformId: doformId,
      mf_no: mf_no,
      showroom_acc_no: showroom_acc_no,
      key_no: key_no,
      branch_name: branch_name,
      party_name: party_name,
      vehicle_company_name: vehicle_company_name,
      model_no: model_no,
      engine_no: engine_no,
      vehicle_color: vehicle_color,
      vehicle_value: vehicle_value,
      chassis_no: chassis_no,
      vehicle_period_of_stay: vehicle_period_of_stay,
      customer_name: customer_name,
      father_or_husband_name: father_or_husband_name,
      mobile_no: mobile_no,
      landmark: landmark,
      ward_no: ward_no,
      village_name: village_name,
      postal_code: postal_code,
      division: division,
      district_name: district_name,
      city: city,
      state: state,
      occupation: occupation,
      monthly_income: monthly_income,
      farm_land_area: farm_land_area,
      guarnteer_name: guarnteer_name,
      guarnteer_father_or_husband_name: guarnteer_father_or_husband_name,
      guarnteer_residence_mobile: guarnteer_residence_mobile,
      guarnteer_office_mobile: guarnteer_office_mobile,
      guarnteer_landmark: guarnteer_landmark,
      guarnteer_ward_no: guarnteer_ward_no,
      guarnteer_village: guarnteer_village,
      guarnteer_postal_code: guarnteer_postal_code,
      guarnteer_division: guarnteer_division,
      guarnteer_district_name: guarnteer_district_name,
      guarnteer_city: guarnteer_city,
      guarnteer_state: guarnteer_state,
      vehicle_number: vehicle_number,

      loan_amount: loan_amount,
      loan_amount_in_words: loan_amount_in_words,
      interest: interest,
      tenure_in_months: tenure_in_months,
      emi: emi,
      final_amount: final_amount,
      interest_amount: interest_amount,

      bank_acc_no: bank_acc_no,
      bank_name: bank_name,
      bank_branch: bank_branch,
      bank_address: bank_address,
      bank_acc_type: bank_acc_type,

      lender_name: lender_name,
      co_borrower_name: co_borrower_name,
      guarnator_2_name: guarnator_2_name,

      sales_executive: sales_executive,
      dealership: dealership,
      guarnteer_2_residence_mobile: guarnteer_2_residence_mobile,
      guarnteer_2_office_mobile: guarnteer_2_office_mobile,
      guarnteer_2_landmark: guarnteer_2_landmark,
      guarnteer_2_ward_no: guarnteer_2_ward_no,
      guarnteer_2_village: guarnteer_2_village,
      guarnteer_2_postal_code: guarnteer_2_postal_code,
      guarnteer_2_division: guarnteer_2_division,
      guarnteer_2_district_name: guarnteer_2_district_name,
      guarnteer_2_city: guarnteer_2_city,
      guarnteer_2_state: guarnteer_2_state,

      reference_1_name: reference_1_name,
      reference_1_residence_mobile: reference_1_residence_mobile,
      reference_1_office_mobile: reference_1_office_mobile,
      reference_1_landmark: reference_1_landmark,
      reference_1_ward_no: reference_1_ward_no,
      reference_1_village: reference_1_village,
      reference_1_postal_code: reference_1_postal_code,
      reference_1_division: reference_1_division,
      reference_1_district_name: reference_1_district_name,
      reference_1_city: reference_1_city,
      reference_1_state: reference_1_state,

      reference_2_name: reference_2_name,
      reference_2_residence_mobile: reference_2_residence_mobile,
      reference_2_office_mobile: reference_2_office_mobile,
      reference_2_landmark: reference_2_landmark,
      reference_2_ward_no: reference_2_ward_no,
      reference_2_village: reference_2_village,
      reference_2_postal_code: reference_2_postal_code,
      reference_2_division: reference_2_division,
      reference_2_district_name: reference_2_district_name,
      reference_2_city: reference_2_city,
      reference_2_state: reference_2_state,

      witness_1_name: witness_1_name,
      witness_1_mobile: witness_1_mobile,
      witness_1_landmark: witness_1_landmark,
      witness_1_ward_no: witness_1_ward_no,
      witness_1_village: witness_1_village,
      witness_1_postal_code: witness_1_postal_code,
      witness_1_division: witness_1_division,
      witness_1_district_name: witness_1_district_name,
      witness_1_city: witness_1_city,
      witness_1_state: witness_1_state,
      witness_1_occupation: witness_1_occupation,

      witness_2_name: witness_2_name,
      witness_2_mobile: witness_2_mobile,
      witness_2_landmark: witness_2_landmark,
      witness_2_ward_no: witness_2_ward_no,
      witness_2_village: witness_2_village,
      witness_2_postal_code: witness_2_postal_code,
      witness_2_division: witness_2_division,
      witness_2_district_name: witness_2_district_name,
      witness_2_city: witness_2_city,
      witness_2_state: witness_2_state,
      witness_2_occupation: witness_2_occupation,

      jurisdiction: jurisdiction,
      language: language,
      court: court,
      motor_vehicle_department: motor_vehicle_department,
    } = req.body;

    let customer_image,
      customer_signature,
      guarnteer_image,
      guarnteer_signature,
      lender_signature,
      co_borrower_signature,
      co_borrower_signature_with_seal,
      guarnator_2_signature,
      reference_1_signature,
      reference_2_signature,
      witness_1_signature,
      witness_2_signature,
      branch_head_signature_with_seal;

    if (req.files) {
      if (req.files.customer_image)
        customer_image = req.files.customer_image[0].publicUrl;
      if (req.files.customer_signature)
        customer_signature = req.files.customer_signature[0].publicUrl;
      if (req.files.guarnteer_image)
        guarnteer_image = req.files.guarnteer_image[0].publicUrl;
      if (req.files.guarnteer_signature)
        guarnteer_signature = req.files.guarnteer_signature[0].publicUrl;
      if (req.files.lender_signature)
        lender_signature = req.files.lender_signature[0].publicUrl;
      if (req.files.co_borrower_signature)
        co_borrower_signature = req.files.co_borrower_signature[0].publicUrl;
      if (req.files.co_borrower_signature_with_seal)
        co_borrower_signature_with_seal =
          req.files.co_borrower_signature_with_seal[0].publicUrl;
      if (req.files.guarnator_2_signature)
        guarnator_2_signature = req.files.guarnator_2_signature[0].publicUrl;
      if (req.files.reference_1_signature)
        reference_1_signature = req.files.reference_1_signature[0].publicUrl;
      if (req.files.reference_2_signature)
        reference_2_signature = req.files.reference_2_signature[0].publicUrl;
      if (req.files.witness_1_signature)
        witness_1_signature = req.files.witness_1_signature[0].publicUrl;
      if (req.files.witness_2_signature)
        witness_2_signature = req.files.witness_2_signature[0].publicUrl;
      if (req.files.branch_head_signature_with_seal)
        branch_head_signature_with_seal =
          req.files.branch_head_signature_with_seal[0].publicUrl;
    }

    // update cheques
    let chequeArray = req.body.cheques;
    chequeArray = eval(chequeArray);

    
    //
   
    var bufferCustomerImage = await convertImage(
      customer_image
    );
    var bufferCustomerSignature = await convertImage(customer_signature);
    var bufferGuarnteerImage = await convertImage(guarnteer_image);
    var bufferGuarnteerSignature = await convertImage(guarnteer_signature);
    var bufferLenderSignature = await convertImage(lender_signature);
    var bufferCoBorroweSignature = await convertImage(co_borrower_signature);
    var bufferCoBorroweSignatureWithSeal = await convertImage(co_borrower_signature_with_seal);
    var bufferGuarnator2Signature = await convertImage(guarnator_2_signature);
    var bufferReference1Signature = await convertImage(reference_1_signature);
    var bufferReference2Signature = await convertImage(reference_2_signature);
    var bufferWitness1Signature = await convertImage(witness_1_signature);
    var bufferWitness2Signature = await convertImage(witness_2_signature);
    var bufferBranchHeadSignatureWithSeal = await convertImage(branch_head_signature_with_seal);

    var doHtmlPath = "./utils/loanAgreement.html";

    var html = fs.readFileSync(doHtmlPath, "utf8");
    pdf.registerHelper("ifCond", function (v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    var pdfName = `${customer_name
      .concat(mobile_no)
      .concat(Date.now())}.pdf`;

    var options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
    };
    var document = {
      type: "file",
      template: html,
      context: {
      doformId: doformId,
      mf_no: mf_no,
      showroom_acc_no: showroom_acc_no,
      key_no: key_no,
      branch_name: branch_name,
      party_name: party_name,
      vehicle_company_name: vehicle_company_name,
      model_no: model_no,
      engine_no: engine_no,
      vehicle_color: vehicle_color,
      vehicle_value: vehicle_value,
      chassis_no: chassis_no,
      vehicle_period_of_stay: vehicle_period_of_stay,
      customer_name: customer_name,
      father_or_husband_name: father_or_husband_name,
      mobile_no: mobile_no,
      landmark: landmark,
      ward_no: ward_no,
      village_name: village_name,
      postal_code: postal_code,
      division: division,
      district_name: district_name,
      city: city,
      state: state,
      occupation: occupation,
      monthly_income: monthly_income,
      farm_land_area: farm_land_area,
      guarnteer_name: guarnteer_name,
      guarnteer_father_or_husband_name: guarnteer_father_or_husband_name,
      guarnteer_residence_mobile: guarnteer_residence_mobile,
      guarnteer_office_mobile: guarnteer_office_mobile,
      guarnteer_landmark: guarnteer_landmark,
      guarnteer_ward_no: guarnteer_ward_no,
      guarnteer_village: guarnteer_village,
      guarnteer_postal_code: guarnteer_postal_code,
      guarnteer_division: guarnteer_division,
      guarnteer_district_name: guarnteer_district_name,
      guarnteer_city: guarnteer_city,
      guarnteer_state: guarnteer_state,
      vehicle_number: vehicle_number,
      loan_amount: loan_amount,
      loan_amount_in_words: loan_amount_in_words,
      interest: interest,
      tenure_in_months: tenure_in_months,
      emi: emi,
      final_amount: final_amount,
      interest_amount: interest_amount,
      bank_acc_no: bank_acc_no,
      bank_name: bank_name,
      bank_branch: bank_branch,
      bank_address: bank_address,
      bank_acc_type: bank_acc_type,
      lender_name: lender_name,
      co_borrower_name: co_borrower_name,
      guarnator_2_name: guarnator_2_name,
      sales_executive: sales_executive,
      dealership: dealership,
      guarnteer_2_residence_mobile: guarnteer_2_residence_mobile,
      guarnteer_2_office_mobile: guarnteer_2_office_mobile,
      guarnteer_2_landmark: guarnteer_2_landmark,
      guarnteer_2_ward_no: guarnteer_2_ward_no,
      guarnteer_2_village: guarnteer_2_village,
      guarnteer_2_postal_code: guarnteer_2_postal_code,
      guarnteer_2_division: guarnteer_2_division,
      guarnteer_2_district_name: guarnteer_2_district_name,
      guarnteer_2_city: guarnteer_2_city,
      guarnteer_2_state: guarnteer_2_state,
      reference_1_name: reference_1_name,
      reference_1_residence_mobile: reference_1_residence_mobile,
      reference_1_office_mobile: reference_1_office_mobile,
      reference_1_landmark: reference_1_landmark,
      reference_1_ward_no: reference_1_ward_no,
      reference_1_village: reference_1_village,
      reference_1_postal_code: reference_1_postal_code,
      reference_1_division: reference_1_division,
      reference_1_district_name: reference_1_district_name,
      reference_1_city: reference_1_city,
      reference_1_state: reference_1_state,
      reference_2_name: reference_2_name,
      reference_2_residence_mobile: reference_2_residence_mobile,
      reference_2_office_mobile: reference_2_office_mobile,
      reference_2_landmark: reference_2_landmark,
      reference_2_ward_no: reference_2_ward_no,
      reference_2_village: reference_2_village,
      reference_2_postal_code: reference_2_postal_code,
      reference_2_division: reference_2_division,
      reference_2_district_name: reference_2_district_name,
      reference_2_city: reference_2_city,
      reference_2_state: reference_2_state,
      witness_1_name: witness_1_name,
      witness_1_mobile: witness_1_mobile,
      witness_1_landmark: witness_1_landmark,
      witness_1_ward_no: witness_1_ward_no,
      witness_1_village: witness_1_village,
      witness_1_postal_code: witness_1_postal_code,
      witness_1_division: witness_1_division,
      witness_1_district_name: witness_1_district_name,
      witness_1_city: witness_1_city,
      witness_1_state: witness_1_state,
      witness_1_occupation: witness_1_occupation,
      witness_2_name: witness_2_name,
      witness_2_mobile: witness_2_mobile,
      witness_2_landmark: witness_2_landmark,
      witness_2_ward_no: witness_2_ward_no,
      witness_2_village: witness_2_village,
      witness_2_postal_code: witness_2_postal_code,
      witness_2_division: witness_2_division,
      witness_2_district_name: witness_2_district_name,
      witness_2_city: witness_2_city,
      witness_2_state: witness_2_state,
      witness_2_occupation: witness_2_occupation,
      jurisdiction: jurisdiction,
      language: language,
      court: court,
      motor_vehicle_department: motor_vehicle_department,
      bufferCustomerImage:bufferCustomerImage,
      bufferCustomerSignature:bufferCustomerSignature,
      bufferGuarnteerImage:bufferGuarnteerImage,
      bufferGuarnteerSignature:bufferGuarnteerSignature,
      bufferLenderSignature: bufferLenderSignature ,
      bufferCoBorroweSignature: bufferCoBorroweSignature,
      bufferCoBorroweSignatureWithSeal:bufferCoBorroweSignatureWithSeal,
      bufferGuarnator2Signature: bufferGuarnator2Signature,
      bufferReference1Signature: bufferReference1Signature,
      bufferReference2Signature:bufferReference2Signature,
      bufferWitness1Signature:bufferWitness1Signature,
      bufferWitness2Signature:bufferWitness2Signature,
      bufferBranchHeadSignatureWithSeal:bufferBranchHeadSignatureWithSeal,
      chequeArray: chequeArray,
      totalEmi: chequeArray.length,
      date: moment(new Date()).format("DD/MM/YYYY"),
      },
      path: `./doforms/${pdfName}`,
    };
    await pdf.create(document, options);
    var link = await uploadfile(`./doforms/${pdfName}`);
    console.log(link)
    await fs.unlinkSync(`./doforms/${pdfName}`);

    //


    const newLoanAgreement = await LoanAgreement({
      mf_no: mf_no,
      showroom_acc_no: showroom_acc_no,
      key_no: key_no,
      branch_name: branch_name,
      party_name: party_name,
      vehicle_company_name: vehicle_company_name,
      model_no: model_no,
      engine_no: engine_no,
      vehicle_color: vehicle_color,
      vehicle_value: vehicle_value,
      chassis_no: chassis_no,
      vehicle_period_of_stay: vehicle_period_of_stay,
      customer_name: customer_name,
      father_or_husband_name: father_or_husband_name,
      mobile_no: mobile_no,
      landmark: landmark,
      ward_no: ward_no,
      village_name: village_name,
      postal_code: postal_code,
      division: division,
      district_name: district_name,
      vehicle_number: vehicle_number,
      city: city,
      state: state,
      occupation: occupation,
      monthly_income: monthly_income,
      farm_land_area: farm_land_area,
      guarnteer_name: guarnteer_name,
      guarnteer_father_or_husband_name: guarnteer_father_or_husband_name,
      guarnteer_residence_mobile: guarnteer_residence_mobile,
      guarnteer_office_mobile: guarnteer_office_mobile,
      guarnteer_landmark: guarnteer_landmark,
      guarnteer_ward_no: guarnteer_ward_no,
      guarnteer_village: guarnteer_village,
      guarnteer_postal_code: guarnteer_postal_code,
      guarnteer_division: guarnteer_division,
      guarnteer_district_name: guarnteer_district_name,
      guarnteer_city: guarnteer_city,
      guarnteer_state: guarnteer_state,

      loan_amount: loan_amount,
      loan_amount_in_words: loan_amount_in_words,
      interest: interest,
      tenure_in_months: tenure_in_months,
      emi: emi,
      final_amount: final_amount,
      interest_amount: interest_amount,

      bank_acc_no: bank_acc_no,
      bank_name: bank_name,
      bank_branch: bank_branch,
      bank_address: bank_address,
      bank_acc_type: bank_acc_type,

      lender_name: lender_name,
      co_borrower_name: co_borrower_name,
      guarnator_2_name: guarnator_2_name,

      sales_executive: sales_executive,
      dealership: dealership,
      guarnteer_2_residence_mobile: guarnteer_2_residence_mobile,
      guarnteer_2_office_mobile: guarnteer_2_office_mobile,
      guarnteer_2_landmark: guarnteer_2_landmark,
      guarnteer_2_ward_no: guarnteer_2_ward_no,
      guarnteer_2_village: guarnteer_2_village,
      guarnteer_2_postal_code: guarnteer_2_postal_code,
      guarnteer_2_division: guarnteer_2_division,
      guarnteer_2_district_name: guarnteer_2_district_name,
      guarnteer_2_city: guarnteer_2_city,
      guarnteer_2_state: guarnteer_2_state,

      reference_1_name: reference_1_name,
      reference_1_residence_mobile: reference_1_residence_mobile,
      reference_1_office_mobile: reference_1_office_mobile,
      reference_1_landmark: reference_1_landmark,
      reference_1_ward_no: reference_1_ward_no,
      reference_1_village: reference_1_village,
      reference_1_postal_code: reference_1_postal_code,
      reference_1_division: reference_1_division,
      reference_1_district_name: reference_1_district_name,
      reference_1_city: reference_1_city,
      reference_1_state: reference_1_state,

      reference_2_name: reference_2_name,
      reference_2_residence_mobile: reference_2_residence_mobile,
      reference_2_office_mobile: reference_2_office_mobile,
      reference_2_landmark: reference_2_landmark,
      reference_2_ward_no: reference_2_ward_no,
      reference_2_village: reference_2_village,
      reference_2_postal_code: reference_2_postal_code,
      reference_2_division: reference_2_division,
      reference_2_district_name: reference_2_district_name,
      reference_2_city: reference_2_city,
      reference_2_state: reference_2_state,

      witness_1_name: witness_1_name,
      witness_1_mobile: witness_1_mobile,
      witness_1_landmark: witness_1_landmark,
      witness_1_ward_no: witness_1_ward_no,
      witness_1_village: witness_1_village,
      witness_1_postal_code: witness_1_postal_code,
      witness_1_division: witness_1_division,
      witness_1_district_name: witness_1_district_name,
      witness_1_city: witness_1_city,
      witness_1_state: witness_1_state,
      witness_1_occupation: witness_1_occupation,

      witness_2_name: witness_2_name,
      witness_2_mobile: witness_2_mobile,
      witness_2_landmark: witness_2_landmark,
      witness_2_ward_no: witness_2_ward_no,
      witness_2_village: witness_2_village,
      witness_2_postal_code: witness_2_postal_code,
      witness_2_division: witness_2_division,
      witness_2_district_name: witness_2_district_name,
      witness_2_city: witness_2_city,
      witness_2_state: witness_2_state,
      witness_2_occupation: witness_2_occupation,

      jurisdiction: jurisdiction,
      language: language,
      court: court,
      motor_vehicle_department: motor_vehicle_department,
      customer_image: customer_image,
      customer_signature: customer_signature,
      guarnteer_image: guarnteer_image,
      guarnteer_signature: guarnteer_signature,
      lender_signature: lender_signature,
      co_borrower_signature: co_borrower_signature,
      co_borrower_signature_with_seal: co_borrower_signature_with_seal,
      guarnator_2_signature: guarnator_2_signature,
      reference_1_signature: reference_1_signature,
      reference_2_signature: reference_2_signature,
      witness_1_signature: witness_1_signature,
      witness_2_signature: witness_2_signature,
      branch_head_signature_with_seal: branch_head_signature_with_seal,
      doformNumber: doformId,
      totalEmi: chequeArray.length,
      loanAgreementLink: link
    });

    // save
    const getLoanAgreement = await newLoanAgreement.save();

    // add cheques
    for (let index = 0; index < chequeArray.length; index++) {
      var data = JSON.parse(chequeArray[index]);
      const cheque = await Cheque({
        chequeNumber: data.chequeNumber,
        chequeDate: moment(data.chequeDate, "DD MM YYYY").toISOString(),
        emi: emi,
      });

      await LoanAgreement.findOneAndUpdate(
        { _id: getLoanAgreement._id },
        { $push: { cheques: cheque } }
      );
    }

    // update do form
    await DoForm.findOneAndUpdate(
      { _id: doformId },
      { isLoanAgreementFilled: true }
    );

    //save user
    const password = await bcrypt.hash(
      customer_name.toString().substr(0, 3).concat(mobile_no.toString().substr(0, 4)).toUpperCase(),
      10
    );

    const newCustomer = Customer({
      name: customer_name,
      doformId: doformId,
      loanAgreementId: getLoanAgreement._id,
      password: password,
      image: customer_image,
      phoneNumber: mobile_no,
    });
    const customer = await newCustomer.save();

    const newVehicle = await Vehicle({
      customerId: customer._id,
      loanAgreementId: getLoanAgreement._id,

    });
    const vehicle = await newVehicle.save();

    //add customerId in loan-agreement
    await LoanAgreement.findOneAndUpdate(
      { _id: getLoanAgreement._id },
      { customerId: customer._id }
    );

    await Customer.findOneAndUpdate(
      { _id: customer._id },
      { vehicleId: vehicle._id }
    );

    return res.status(200).json({
      fileNumber: customer._id,
      customerId: customer._id,
      password: "First 3 letter customer name in upper case + First 4 digit of Phone Number",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
};

export const getLoanAgreementById = async (req, res) => {
  try {
    const loanAgreement = await LoanAgreement.findById(req.params.id).lean();
    if (!loanAgreement) {
      return res.status(400).json({ message: "please enter correct id" });
    }
    return res.status(200).json(loanAgreement);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const payEmi = async (req, res) => {
  try {
    const {
      customerId: customerId,
      paymentAmount: paymentAmount,
      paymentReceivedById: paymentReceivedById,
      paymentReceivedBy: paymentReceivedBy,
      penaltyCharges: penaltyCharges,
      modeOfPayment: modeOfPayment,
      cashType: cashType
    } = req.body;
    const loanAgreement = await LoanAgreement.findOne({
      customerId: customerId,
    });
    if (!loanAgreement) {
      return res.status(400).json({ message: "Enter correct customerId" });
    }

    if(loanAgreement.isLoanCompletelyPaid){
      return res.status(400).json({ message: "Loan already paid" });
      
    }

    let update = {};
    if (loanAgreement.totalEmi - 1 === loanAgreement.currentEmiPaidCount) {
      update = {
        currentEmiPaidCount: loanAgreement.totalEmi,
        isLoanCompletelyPaid: true,
        "cheques.$[count].paymentDate": new Date(),
        "cheques.$[count].payedAmount": paymentAmount,
        extraCharge: paymentAmount - loanAgreement.emi,
        "cheques.$[count].isPaid": true,
        "cheques.$[count].paymentReceivedBy": paymentReceivedBy,
        "cheques.$[count].paymentReceivedById": paymentReceivedById,
        "cheques.$[count].gstCharges": (0.18 * paymentAmount).toFixed(2),
        "cheques.$[count].penaltyCharges": penaltyCharges,
        "cheques.$[count].modeOfPayment": modeOfPayment,
        "cheques.$[count].cashType": cashType,        
      };
    
    } else {
      update = {
        currentEmiPaidCount: loanAgreement.currentEmiPaidCount + 1,
        "cheques.$[count].paymentDate": new Date(),
        "cheques.$[count].payedAmount": paymentAmount,
        extraCharge: paymentAmount - loanAgreement.emi,
        "cheques.$[count].isPaid": true,
        "cheques.$[count].paymentReceivedBy": paymentReceivedBy,
        "cheques.$[count].paymentReceivedById": paymentReceivedById,
        "cheques.$[count].gstCharges": (0.18 * paymentAmount).toFixed(2),
        "cheques.$[count].penaltyCharges": penaltyCharges,
        "cheques.$[count].modeOfPayment": modeOfPayment,
        "cheques.$[count].cashType": cashType,
      };
    }
    await LoanAgreement.findOneAndUpdate(
      { customerId: customerId },
      update,
      {
        arrayFilters: [{ "count._id": mongoose.Types.ObjectId(loanAgreement.cheques[loanAgreement.currentEmiPaidCount]._id) }],
        new: true,
      }
    ).exec();
    return res.status(200).json({ message: "Paid success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


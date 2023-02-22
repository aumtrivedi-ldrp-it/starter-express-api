import Dealer from "../models/dealer.js";
import DoForm from "../models/doform.js";
import * as fs from "fs";
import uploadfile from "../utils/uploadfile.js";
import pdf from "dynamic-html-pdf";
import got from "got";
import moment from "moment";

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

export const createDoForm = async (req, res) => {
  try {
    if (req.Auth) {
      let dealer = await Dealer.findOne({ email: req.body.dealerEmail });
      if (!dealer) {
        return res.status(400).json({ message: "dealer not found" });
      }
      const {
        customerName: customerName,
        customerFatherOrHusbandName: customerFatherOrHusbandName,
        customerMobileNumber: customerMobileNumber,
        customerAddressLandMark: customerAddressLandMark,
        customerAddressWardNumber: customerAddressWardNumber,
        customerAddressVillageName: customerAddressVillageName,
        customerAddressPostalCode: customerAddressPostalCode,
        customerAddressDivision: customerAddressDivision,
        customerAddressDistrict: customerAddressDistrict,
        differenceBetweenCustomerAddressAndShowroom:
          differenceBetweenCustomerAddressAndShowroom,
        customerOccupation: customerOccupation,
        customerMonthlyIncome: customerMonthlyIncome,
        customerDesignation: customerDesignation,
        customerOfficeAddress: customerOfficeAddress,
        customerFarmArea: customerFarmArea,
        vehicle: vehicle,
        vehicleExShowroomPrice: vehicleExShowroomPrice,
        vehicleRtoPrice: vehicleRtoPrice,
        vehicleInsurancePrice: vehicleInsurancePrice,
        vehicleOtherPrices: vehicleOtherPrices,
        vehicleOnRoadPrice: vehicleOnRoadPrice,
        vehicleLA: vehicleLA,
        vehicleEmiAmount: vehicleEmiAmount,
        vehicleTotalEmiCount: vehicleTotalEmiCount,
        vehicleLTV: vehicleLTV,
        vehicleScheme: vehicleScheme,
        reference1Name: reference1Name,
        reference1FatherOrHusbandName: reference1FatherOrHusbandName,
        reference1Village: reference1Village,
        reference1PostalCode: reference1PostalCode,
        reference1Division: reference1Division,
        reference1District: reference1District,
        reference1MobileNumber: reference1MobileNumber,
        reference2Name: reference2Name,
        reference2FatherOrHusbandName: reference2FatherOrHusbandName,
        reference2Village: reference2Village,
        reference2PostalCode: reference2PostalCode,
        reference2Division: reference2Division,
        reference2District: reference2District,
        reference2MobileNumber: reference2MobileNumber,
        salesExecutiveName: salesExecutiveName,
        branchHeadName: branchHeadName,
      } = req.body;

      let salesExecutiveSignature, branchHeadSignature, dealerSignature;
      if (req.files) {
        if (req.files.salesExecutiveSignature)
          salesExecutiveSignature =
            req.files.salesExecutiveSignature[0].publicUrl;
        if (req.files.branchHeadSignature)
          branchHeadSignature = req.files.branchHeadSignature[0].publicUrl;
        if (req.files.dealerSignature)
          dealerSignature = req.files.dealerSignature[0].publicUrl;
      }

      var bufferSalesExecutiveSignature = await convertImage(
        salesExecutiveSignature
      );
      var bufferBranchHeadSignature = await convertImage(branchHeadSignature);
      var bufferDealerSignature = await convertImage(dealerSignature);

      var doHtmlPath = "./utils/do.html";

      var html = fs.readFileSync(doHtmlPath, "utf8");
      pdf.registerHelper("ifCond", function (v1, v2, options) {
        if (v1 === v2) {
          return options.fn(this);
        }
        return options.inverse(this);
      });

      var pdfName = `${customerName
        .concat(customerMobileNumber)
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
          dealerName: dealer.name,
          customerName: customerName,
          customerFatherOrHusbandName: customerFatherOrHusbandName,
          customerMobileNumber: customerMobileNumber,
          customerAddressLandMark: customerAddressLandMark,
          customerAddressWardNumber: customerAddressWardNumber,
          customerAddressVillageName: customerAddressVillageName,
          customerAddressPostalCode: customerAddressPostalCode,
          customerAddressDivision: customerAddressDivision,
          customerAddressDistrict: customerAddressDistrict,
          differenceBetweenCustomerAddressAndShowroom:
            differenceBetweenCustomerAddressAndShowroom,
          customerOccupation: customerOccupation,
          customerMonthlyIncome: customerMonthlyIncome,
          customerDesignation: customerDesignation,
          customerOfficeAddress: customerOfficeAddress,
          customerFarmArea: customerFarmArea,
          vehicle: vehicle,
          vehicleExShowroomPrice: vehicleExShowroomPrice,
          vehicleRtoPrice: vehicleRtoPrice,
          vehicleInsurancePrice: vehicleInsurancePrice,
          vehicleOtherPrices: vehicleOtherPrices,
          vehicleOnRoadPrice: vehicleOnRoadPrice,
          vehicleLA: vehicleLA,
          vehicleEmiAmount: vehicleEmiAmount,
          vehicleTotalEmiCount: vehicleTotalEmiCount,
          vehicleLTV: vehicleLTV,
          vehicleScheme: vehicleScheme,
          reference1Name: reference1Name,
          reference1FatherOrHusbandName: reference1FatherOrHusbandName,
          reference1Village: reference1Village,
          reference1PostalCode: reference1PostalCode,
          reference1Division: reference1Division,
          reference1District: reference1District,
          reference1MobileNumber: reference1MobileNumber,
          reference2Name: reference2Name,
          reference2FatherOrHusbandName: reference2FatherOrHusbandName,
          reference2Village: reference2Village,
          reference2PostalCode: reference2PostalCode,
          reference2Division: reference2Division,
          reference2District: reference2District,
          reference2MobileNumber: reference2MobileNumber,
          salesExecutiveName: salesExecutiveName,
          branchHeadName: branchHeadName,
          date: moment(new Date()).format("DD/MM/YYYY"),
          salesExecutiveSignature: bufferSalesExecutiveSignature,
          branchHeadSignature: bufferBranchHeadSignature,
          dealerSignature: bufferDealerSignature,
        },
        path: `./doforms/${pdfName}`,
      };
      await pdf.create(document, options);
      var link = await uploadfile(`./doforms/${pdfName}`);
      await fs.unlinkSync(`./doforms/${pdfName}`);
      const new_doForm = await DoForm.create({
        dealer: dealer._id,
        customerName: customerName,
        customerFatherOrHusbandName: customerFatherOrHusbandName,
        customerMobileNumber: customerMobileNumber,
        customerAddressLandMark: customerAddressLandMark,
        customerAddressWardNumber: customerAddressWardNumber,
        customerAddressVillageName: customerAddressVillageName,
        customerAddressPostalCode: customerAddressPostalCode,
        customerAddressDivision: customerAddressDivision,
        customerAddressDistrict: customerAddressDistrict,
        differenceBetweenCustomerAddressAndShowroom:
          differenceBetweenCustomerAddressAndShowroom,
        customerOccupation: customerOccupation,
        customerMonthlyIncome: customerMonthlyIncome,
        customerDesignation: customerDesignation,
        customerOfficeAddress: customerOfficeAddress,
        customerFarmArea: customerFarmArea,
        vehicle: vehicle,
        vehicleExShowroomPrice: vehicleExShowroomPrice,
        vehicleRtoPrice: vehicleRtoPrice,
        vehicleInsurancePrice: vehicleInsurancePrice,
        vehicleOtherPrices: vehicleOtherPrices,
        vehicleOnRoadPrice: vehicleOnRoadPrice,
        vehicleLA: vehicleLA,
        vehicleEmiAmount: vehicleEmiAmount,
        vehicleTotalEmiCount: vehicleTotalEmiCount,
        vehicleLTV: vehicleLTV,
        vehicleScheme: vehicleScheme,
        reference1Name: reference1Name,
        reference1FatherOrHusbandName: reference1FatherOrHusbandName,
        reference1Village: reference1Village,
        reference1PostalCode: reference1PostalCode,
        reference1Division: reference1Division,
        reference1District: reference1District,
        reference1MobileNumber: reference1MobileNumber,
        reference2Name: reference2Name,
        reference2FatherOrHusbandName: reference2FatherOrHusbandName,
        reference2Village: reference2Village,
        reference2PostalCode: reference2PostalCode,
        reference2Division: reference2Division,
        reference2District: reference2District,
        reference2MobileNumber: reference2MobileNumber,
        salesExecutiveName: salesExecutiveName,
        salesExecutiveSignature: salesExecutiveSignature,
        branchHeadName: branchHeadName,
        branchHeadSignature: branchHeadSignature,
        dealerSignature: dealerSignature,
        formLink: link,
      });
      var saved = await new_doForm.save();
      return res.status(200).json({ form_id: saved._id });
    } else {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const nonApprovedDoForm = async (req, res) => {
  try {
    let nonVerifiedForm = await DoForm.find({
      isApproved: false,
      isCancelled: false,
    });
    console.log("error///")
    
    return res.status(200).json(nonVerifiedForm);
  } catch (error) {
    console.log("error",error)
    return res.status(400).json({ message: error.message });
  }
};

export const updateApproveDoForm = async (req, res) => {
  try {
    let nonApprovedForm = await DoForm.findOneAndUpdate(
      { _id: req.body.id },
      { isApproved: true },
      {
        returnOriginal: false,
      }
    );
    return res.status(200).json(nonApprovedForm);
  } catch (error) {
    return res.status(200).json({ message: error.message });
  }
};

export const approvedDoForms = async (req, res) => {
  try {
    let approvedDoForms = await DoForm.find({
      isApproved: true,
      isLoanAgreementFilled: false,
    }).lean();
    return res.status(200).json(approvedDoForms);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const doFormById = async (req, res) => {
  try {
    let getDoForm = await DoForm.findById(req.params.id);
    if (!getDoForm) {
      return res.status(400).json({ message: "Do form not found" });
    }
    return res.status(200).json(getDoForm);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const cancelDoForm = async (req, res) => {
  try {
    const { message: message, doformid: doformid } = req.body;
    const doform = await DoForm.findById(doformid);
    if (!doform) {
      return res.status(400).json({ message: "Enter valid id" });
    }
    await DoForm.findByIdAndUpdate(doformid, {
      message: message,
    });
    await DoForm.findByIdAndDelete(doformid);
    return res.status(200).json({ message: "Do form canceled" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

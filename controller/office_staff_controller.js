import LoanAgreement from "../models/loanAgreement.js";
import Recovery from "../models/recovery.js";
import { RecoveryStaff } from "../models/user.js";
import Vehicle from "../models/vehicle.js";

import moment from "moment";

export const listOfPendingEMI = async (req, res) => {
  try {
    var today = moment().startOf("day");
    let loanAgreement = await LoanAgreement.aggregate([
      { $unwind: "$cheques" },
      {
        $match: {
          $and: [
            { "cheques.isPaid": false },
            {
              "cheques.chequeDate": {
                $gte: new Date(2018, 1, 1),
                $lte: moment(today).endOf("day").toDate(),
              },
            },
          ],
        },
      },
      {
        $project: {
          customer_name: 1,
          emi: 1,
          mobile_no: 1,
          landmark: 1,
          ward_no: 1,
          village_name: 1,
          postal_code: 1,
          division: 1,
          district_name: 1,
          city: 1,
          state: 1,
          loan_amount: 1,
          loan_amount_in_words: 1,
          cheques: 1,
        },
      },
    ]);
    return res.status(200).json(loanAgreement);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const markRecovery = async (req, res) => {
  try {
    const {
      loanAgreementId: loanAgreementId,
      recoveryStaffId: recoveryStaffId,
    } = req.body;
    
    const recoveryExist = await Recovery.findOne({
      loanAgreement: loanAgreementId,
    }).lean();

    if (recoveryExist) {
      return res.status(400).json({ message: "Recovery alread exist" });
    }

    const newRecovery = await Recovery({
      loanAgreement: loanAgreementId,
      recoveryStaff: recoveryStaffId,
    });

    await newRecovery.save();
    
    return res.status(200).json({ message: "Recovery assign successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const reAssignRecoveryToAnotherStaff = async (req, res) => {
  try {
    const { recoveryId: recoveryId, recoveryStaffId: recoveryStaffId } =
      req.body;

    const recoveryExist = await Recovery.findById(recoveryId).lean();

    if (!recoveryExist) {
      return res.status(400).json({ message: "Recovery doesn't exist" });
    }

    await Recovery.findByIdAndUpdate(recoveryId, {
      recoveryStaff: recoveryStaffId,
    }).exec();
    return res.status(200).json({ message: "Recovery assign successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getListOfRecoveryStaff = async (req, res) => {
  try {
    var listOfRecoveryStaff = await RecoveryStaff.find({});

    return res.status(200).json(listOfRecoveryStaff);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getAllRecovery =  async(req,res) =>{
  try {
    var recoveries = await Recovery.find({}).lean();
    return res.status(200).json(recoveries);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const getAllSeizedVehicles = async (req,res) =>{
  try {
    var vehicles = await Vehicle.find({
      "isSeized": true
    }).lean(); 
    return res.status(200).json(vehicles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const UnseizedVehicle = async (req,res) =>{
  try {
    const {vehicleId : vehicleId  , officestaffname: officestaffname} = req.body;

    var vehicle = Vehicle.findById(vehicleId).lean();
    if(!vehicle ||  !vehicle.isSeized){
      return res.status(400).json({message: "Please Enter correct vehicle id"});
    }

    await Vehicle.findByIdAndUpdate( vehicleId, {
      "isSeized": false,
      $push : {
        seizedHistory: `vehicle unseized by ${officestaffname} on ${moment()}`
      }
    }); 
    return res.status(200).json({message : "Vehicle Unseized"});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
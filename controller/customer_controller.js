import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Customer from "../models/customer.js";
import Vehicle from "../models/vehicle.js";
import LoanAgreement from "../models/loanAgreement.js";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const userLogin = async (req, res) => {
  try {
    console.log("req.body",req.body)
    const { email: customerId, password: password } = req.body;
    const user = await Customer.findOne({ email: customerId }).lean();

    if (!user) {
      return res
        .status(404)
        .json({ message: "user doesn't exist, use a different email" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign(
        { email: customerId },
        process.env.CUSTOMER_JWT
      );
      const newUser = {
        name: user.name,
        customerId: user._id,
        image: user.image,
        phoneNumber: user.phoneNumber,
      };
      return res.status(200).json({ user: newUser, token: accessToken });
    }

    return res.status(404).json({ message: "please enter correct password" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const searchCustomer = async (req, res) => {
  try {
    const query = req.params.query;
    let regx = new RegExp(query, "i");
    const customer = await Customer.find(
      {
        name: { $regex: query, $options: "i" },
      },
      "name phoneNumber image vehicleId loanAgreementId"
    ).exec();
    return res.status(200).json(customer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getChequeListById = async (req, res) => {
  try {
    const loanAgreement = await LoanAgreement.findOne({
      customerId: req.params.customerId,
    });
    if (!loanAgreement) {
      return res.status(400).json({ message: "enter correct customer id" });
    }
    return res.status(200).json(loanAgreement.cheques);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getVehicleStatus =  async(req,res) =>{

  try {
    const customerId = req.params.customerId;

    const customer =  await  Customer.findById(customerId);
    if(!customer){
      return res.status(400).json({message: "Enter correct customer id"});
    }

    const vehicle = await Vehicle.findById(customer.vehicleId, "isSeized");
    return res.status(200).json(vehicle);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

} 
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/admin.js";
import { OfficeStaff, RecoveryStaff } from "../models/user.js";
import Dealer from "../models/dealer.js";
import RequestReset from "../models/resetPassRequest.js";
import Customer from "../models/customer.js";
import Dio from "../models/doform.js";
import User from "../models/user.js";
import moment from "moment";
import LoanAgreement from "../models/loanAgreement.js";
import Scheme  from  "../models/scheme.js";

const ObjectId = mongoose.Types.ObjectId;

export const checkEmailExists = async (req, res) => {
  try {
    validationResult(req).throw();

    const email = req.params.email;
    let user;

    user = await Dealer.findOne({ email: email });
    if (user) {
      return res.status(200).json(user);
    }

    user = await OfficeStaff.findOne({ email: email });
    if (user) {
      return res.status(200).json(user);
    }

    user = await RecoveryStaff.findOne({ email: email });
    if (user) {
      return res.status(200).json(user);
    }

    return res
      .status(404)
      .json({ message: "user doesn't exist, use a different email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const checkTypeOfUser = async (req, res) => {
  try {
    validationResult(req).throw();

    const email = req.params.email;
    let user;

    user = await Dealer.findOne({ email: email });
    if (user) {
      return res.status(200).json(user.type);
    }

    user = await OfficeStaff.findOne({ email: email });
    if (user) {
      return res.status(200).json(user.type);
    }

    user = await RecoveryStaff.findOne({ email: email });
    if (user) {
      return res.status(200).json(user.type);
    }

    return res
      .status(404)
      .json({ message: "user doesn't exist, use a different email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const dealerLogin = async (req, res) => {
  try {
    validationResult(req).throw();

    const { email: email, password: password } = req.body;

    const user = await Dealer.findOne({ email: email }).lean();

    if (!user) {
      return res
        .status(404)
        .json({ message: "user doesn't exist, use a different email" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ email: email }, process.env.USER_JWT_KEY);

      return res.status(200).json({ user: user, token: accessToken });
    }

    return res.status(401).json({ error: "Invalid email/ password" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const officeStaffLogin = async (req, res) => {
  try {
    validationResult(req).throw();

    const { email: email, password: password } = req.body;

    const user = await OfficeStaff.findOne({ email: email }).lean();

    if (!user) {
      return res
        .status(404)
        .json({ message: "user doesn't exist, use a different email" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ email: email }, process.env.USER_JWT_KEY);

      return res.status(200).json({ user: user, token: accessToken });
    }

    return res.status(401).json({ error: "Invalid email/ password" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const recoveryLogin = async (req, res) => {
  try {
    validationResult(req).throw();

    const { email: email, password: password } = req.body;

    const user = await RecoveryStaff.findOne({ email: email }).lean();

    if (!user) {
      return res
        .status(404)
        .json({ message: "user doesn't exist, use a different email" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ email: email }, process.env.USER_JWT_KEY);

      return res.status(200).json({ user: user, token: accessToken });
    }

    return res.status(401).json({ error: "Invalid email/ password" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDealerInfo = async (req, res) => {
  try {
    const { token: token, email: email } = req.body;
    jwt.verify(token, process.env.USER_JWT_KEY, async (err, data) => {
      if (err) {
        req.Auth = false;
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      } else {
        let user = await Dealer.findOne({ email: email });
        if (user) {
          return res.status(200).json(user);
        }
        return res
          .status(404)
          .json({ message: "user doesn't exist, use a different email" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOfficeStaffInfo = async (req, res) => {
  try {
    const { token: token, email: email } = req.body;
    jwt.verify(token, process.env.USER_JWT_KEY, async (err, data) => {
      if (err) {
        req.Auth = false;
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      } else {
        let user = await OfficeStaff.findOne({ email: email });
        if (user) {
          return res.status(200).json(user);
        }
        return res
          .status(404)
          .json({ message: "user doesn't exist, use a different email" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRecoveryInfo = async (req, res) => {
  try {
    const { token: token, email: email } = req.body;
    jwt.verify(token, process.env.USER_JWT_KEY, async (err, data) => {
      if (err) {
        req.Auth = false;
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      } else {
        let user = await RecoveryStaff.findOne({ email: email });
        if (user) {
          return res.status(200).json(user);
        }
        return res
          .status(404)
          .json({ message: "user doesn't exist, use a different email" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const requestResetPassword = async (req, res) => {
  try {
    validationResult(req).throw();

    const { name: name, email: email, type: type, token: token } = req.body;

    if (token != process.env.PASSWORD_REQUEST_TOKEN) {
      return res.status(400).json({ message: "Invalid request token" });
    }

    let user;
    if (type == "dealer") {
      user = await Dealer.findOne({ email: email }).lean();
    } else if (type == "officeStaff") {
      user = await OfficeStaff.findOne({ email: email }).lean();
    } else {
      user = await RecoveryStaff.findOne({ email: email }).lean();
    }

    if (!user) {
      return res
        .status(400)
        .json({ message: "User doesn't exist, use a different email" });
    }

    const request = await RequestReset.findOne({ email: email }).lean();
    if (request) {
      return res.status(400).json({ message: "user already made a request" });
    }

    const new_request = await RequestReset({
      name: name,
      email: email,
      type: type,
    });
    const get_request = await new_request.save();

    return res.status(200).json(get_request);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAdminFcm = async (req, res) => {
  if (req.Auth) {
    try {
      const admin = await Admin.findOne({ name: "admin" }, "name fcm").lean();
      if (!admin || !admin.fcm) {
        return res.status(400).json({ message: "admin doesn't have a fcm" });
      }

      res.status(200).json(admin);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const getAllUsersFcm = async (req, res) => {
  if (req.Auth) {
    try {
      let dealers, office_staffs, recovery_staffs;
      dealers = await Dealer.find({}, "name email type fcm");
      office_staffs = await OfficeStaff.find({}, "name email type fcm");
      recovery_staffs = await RecoveryStaff.find({}, "name email type fcm");

      return res.status(200).json({
        dealers: dealers,
        office_staffs: office_staffs,
        recovery_staffs: recovery_staffs,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const getUsersFcmByType = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      const type = req.params.type;
      let users;
      if (type == "dealer") {
        users = await Dealer.find({}, "name email type fcm");
      } else if (type == "officeStaff") {
        users = await OfficeStaff.find({}, "name email type fcm");
      } else {
        users = await RecoveryStaff.find({}, "name email type fcm");
      }

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const getUserFcm = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      const email = req.params.email;
      let user;

      user = await Dealer.findOne({ email: email }, "name email fcm");
      if (user) {
        return res.status(200).json(user);
      }

      user = await OfficeStaff.findOne({ email: email }, "name email fcm");
      if (user) {
        return res.status(200).json(user);
      }

      user = await RecoveryStaff.findOne({ email: email }, "name email fcm");
      if (user) {
        return res.status(200).json(user);
      }

      return res
        .status(404)
        .json({ message: "user doesn't exist, use a different email" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};



export const updateFcm = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      const { email: email, fcm: fcm, type: type } = req.body;

      let user;
      if (type == "dealer") {
        user = await Dealer.findOne({ email: email }).lean();
        if (!user) {
          return res
            .status(404)
            .json({ message: "user doesn't exist, use a different email" });
        }

        await Dealer.findOneAndUpdate({ email: email }, { $set: { fcm: fcm } });
        user = await Dealer.findOne({ email: email }, "name fcm").lean();
      } else if (type == "officeStaff") {
        user = await OfficeStaff.findOne({ email: email }).lean();
        if (!user) {
          return res
            .status(404)
            .json({ message: "user doesn't exist, use a different email" });
        }

        await OfficeStaff.findOneAndUpdate(
          { email: email },
          { $set: { fcm: fcm } }
        );
        user = await OfficeStaff.findOne({ email: email }, "name fcm").lean();
      } else if (type == "recovery") {
        user = await RecoveryStaff.findOne({ email: email }).lean();
        if (!user) {
          return res
            .status(404)
            .json({ message: "user doesn't exist, use a different email" });
        }

        await RecoveryStaff.findOneAndUpdate(
          { email: email },
          { $set: { fcm: fcm } }
        );
        user = await RecoveryStaff.findOne({ email: email }, "name fcm").lean();
      } else {
        user = await Admin.findOne({ email: email }).lean();
        if (!user) {
          return res
            .status(404)
            .json({ message: "user doesn't exist, use a different email" });
        }

        await Admin.findOneAndUpdate({ email: email }, { $set: { fcm: fcm } });
        user = await Admin.findOne({ email: email }, "name fcm").lean();
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const getAllCustomers = async (req, res) => {
  if (req.headers['authorization']) {
    try {
      const customers = await Customer.find({});

      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const listOfEmi = async (req, res) => {
  try {
    const userID = req.params.id;
    const member_Email = req.body.email;
    const checkMember = await Dealer.findOne({ email: member_Email }).lean();
    if (!checkMember) {
      return res.status(500).json({ message: "Check the credentials!" });
    } else {
      const getUser = await Dio.findById(userID);
      return res.status(200).json(getUser.emi_delivery_in_weeks);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



//get pending emi according to customer-id
export const getPendingEmiById = async (req, res) => {
  try {
    var today = moment().startOf("day");
    let loanAgreement = await LoanAgreement.aggregate([
      { $match: { customerId: ObjectId(req.params.customerId) } },
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
    return res.status(500).json({ message: error.message });
  }
};

export const searchStaff = async (req, res) => {
  try {
    const query = req.params.query;
    let regx = new RegExp(query, "i");
    const officeStaff = await OfficeStaff.find(
      {
        name: { $regex: query, $options: "i" },
      },
      "name email phone type image"
    ).exec();

    const dealer = await Dealer.find(
      {
        name: { $regex: query, $options: "i" },
      },
      "name email phone type image"
    ).exec();

    const recovery = await RecoveryStaff.find(
      {
        name: { $regex: query, $options: "i" },
      },
      "name email phone type image"
    ).exec();

    var internalOutput = officeStaff.concat(dealer);
    var finalOutput = internalOutput.concat(recovery);

    
    return res.status(200).json(finalOutput);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllSchemes = async(req,res) => {
  try {
    const schemes = await Scheme.find({});
    return res.status(200).json(schemes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import Attendance from "../models/attendance.js";
import { OfficeStaff, RecoveryStaff } from "../models/user.js";
import Dealer from "../models/dealer.js";
import Admin from "../models/admin.js";
import RequestReset from "../models/resetPassRequest.js";
import Customer from "../models/customer.js";
import SubAdmin from "../models/subAdmin.js";
import Scheme from "../models/scheme.js";

export const adminSignup = async (req, res) => {
  try {
    validationResult(req).throw();

    const { email: email, password: plain_password } = req.body;

    const checkUser = await Admin.findOne({ email: email }).lean();
    if (checkUser) {
      return res
        .status(400)
        .json({ message: "email already exists, use a different email" });
    }
    const password = await bcrypt.hash(plain_password, 10);

    const new_admin = await Admin({ email: email, password: password });
    const get_admin = await new_admin.save();

    return res.status(200).json(get_admin);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const adminLogin = async (req, res) => {
  console.log("req",req.body)
  try {
    validationResult(req).throw();

    const { email: email, password: password } = req.body;

    const admin = await Admin.findOne({ email: email }).lean();

    if (!admin) {
      return res
        .status(404)
        .json({ message: "email doesn't exist, use a different email" });
    }

    if (await bcrypt.compare(password, admin.password)) {
      const accessToken = jwt.sign({ email: email }, process.env.ADMIN_JWT_KEY);

      return res
        .status(200)
        .json({ message: "Admin login successful", token: accessToken });
    }

    return res.status(401).json({ message: "Invalid email/ password" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAdminFcm = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      const { email: email, fcm: fcm } = req.body;
      let admin = await Admin.findOne({ email: email }).lean();

      if (!admin) {
        return res
          .status(400)
          .json({ message: "Admin doesn't exist, use a different email" });
      }

      admin = await Admin.findOneAndUpdate(
        { email: email },
        { $set: { fcm: fcm } }
      );

      return res.status(200).json(admin);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const resetPassword = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      const { email: email, password: new_password, type: type } = req.body;
      let user;

      if (type == "dealer") {
        user = await Dealer.findOne({ email: email }).lean();

        if (user) {
          const password = await bcrypt.hash(new_password, 10);
          await Dealer.findOneAndUpdate(
            { email: email },
            { $set: { password: password } }
          );
          await RequestReset.findOneAndDelete({ email: email });

          return res
            .status(200)
            .json({ message: "password updated successfully" });
        }
      } else if (type == "officeStaff") {
        user = await OfficeStaff.findOne({ email: email }).lean();

        if (user) {
          const password = await bcrypt.hash(new_password, 10);
          await OfficeStaff.findOneAndUpdate(
            { email: email },
            { $set: { password: password } }
          );
          await RequestReset.findOneAndDelete({ email: email });

          return res
            .status(200)
            .json({ message: "password updated successfully" });
        }
      } else {
        user = await RecoveryStaff.findOne({ email: email }).lean();

        if (user) {
          const password = await bcrypt.hash(new_password, 10);
          await RecoveryStaff.findOneAndUpdate(
            { email: email },
            { $set: { password: password } }
          );
          await RequestReset.findOneAndDelete({ email: email });

          return res
            .status(200)
            .json({ message: "password updated successfully" });
        }
      }

      return res
        .status(400)
        .json({ message: "User doesn't exist, use a different email" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const createNewUser = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      let {
        name: name,
        email: email,
        password: plain_password,
        type: type,
        phone: phone,
        dob: dob,
        join_date: join_date,
        address: address,
        location: location,
      } = req.body;
      let image, aadhar;
      if (req.files) {
        if (req.files.image) image = req.files.image[0].publicUrl;
        if (req.files.aadhar) aadhar = req.files.aadhar[0].publicUrl;
      }

      if (!phone) phone = 0;

      if (type == "dealer") {
        const checkUser = await Dealer.findOne({ email: email }).lean();
        if (checkUser) {
          return res
            .status(400)
            .json({ message: "User already exists, use a different email" });
        }

        const password = await bcrypt.hash(plain_password, 10);

        const new_user = await Dealer({
          name: name,
          email: email,
          password: password,
          type: type,
          phone: phone,
          dob: dob,
          join_date: join_date,
          address: address,
          image: image,
          aadhar: aadhar,
        });
        await new_user.save();

        if (location) {
          await Dealer.findOneAndUpdate(
            { email: email },
            { $push: { location: location } }
          );
        }

        const get_user = await Dealer.findOne({ email: email }).lean();
        return res.status(200).json(get_user);
      } else if (type == "officeStaff") {
        const checkUser = await OfficeStaff.findOne({ email: email }).lean();
        if (checkUser) {
          return res
            .status(400)
            .json({ message: "User already exists, use a different email" });
        }

        const password = await bcrypt.hash(plain_password, 10);

        const new_user = await OfficeStaff({
          name: name,
          email: email,
          password: password,
          type: type,
          phone: phone,
          dob: dob,
          join_date: join_date,
          address: address,
          image: image,
          aadhar: aadhar,
        });
        const get_user = await new_user.save();

        return res.status(200).json(get_user);
      } else {
        const checkUser = await RecoveryStaff.findOne({ email: email }).lean();
        if (checkUser) {
          return res
            .status(400)
            .json({ message: "User already exists, use a different email" });
        }

        const password = await bcrypt.hash(plain_password, 10);

        const new_user = await RecoveryStaff({
          name: name,
          email: email,
          password: password,
          type: type,
          phone: phone,
          dob: dob,
          join_date: join_date,
          address: address,
          image: image,
          aadhar: aadhar,
        });
        const get_user = await new_user.save();

        return res.status(200).json(get_user);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const updateUser = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      const {
        name: name,
        email: email,
        type: type,
        phone: phone,
        dob: dob,
        address: address,
        join_date: join_date,
        location: location,
      } = req.body;
      let image, aadhar;
      if (req.files) {
        if (req.files.image) image = req.files.image[0].publicUrl;
        if (req.files.aadhar) aadhar = req.files.aadhar[0].publicUrl;
      }

      if (type == "dealer") {
        let user = await Dealer.findOne({ email: email }).lean();
        if (!user) {
          return res
            .status(400)
            .json({ message: "User doesn't exist, use a different email" });
        }

        if (name) {
          await Dealer.findOneAndUpdate(
            { email: email },
            { $set: { name: name } }
          );
        }
        if (type) {
          await Dealer.findOneAndUpdate(
            { email: email },
            { $set: { type: type } }
          );
        }
        if (phone) {
          await Dealer.findOneAndUpdate(
            { email: email },
            { $set: { phone: phone } }
          );
        }
        if (dob) {
          await Dealer.findOneAndUpdate(
            { email: email },
            { $set: { dob: dob } }
          );
        }
        if (join_date) {
          await Dealer.findOneAndUpdate(
            { email: email },
            { $set: { join_date: join_date } }
          );
        }
        if (location) {
          await Dealer.findOneAndUpdate(
            { email: email },
            { $set: { location: location } }
          );
        }
        if (address) {
          await Dealer.findOneAndUpdate(
            { email: email },
            { $set: { address: address } }
          );
        }
        if (image) {
          await Dealer.findOneAndUpdate(
            { email: email },
            { $set: { image: image } }
          );
        }
        if (aadhar) {
          await Dealer.findOneAndUpdate(
            { email: email },
            { $set: { aadhar: aadhar } }
          );
        }

        user = await Dealer.findOne({ email: email }).lean();
        return res.status(200).json(user);
      } else if (type == "officeStaff") {
        let user = await OfficeStaff.findOne({ email: email }).lean();
        if (!user) {
          return res
            .status(400)
            .json({ message: "User doesn't exist, use a different email" });
        }

        if (name) {
          await OfficeStaff.findOneAndUpdate(
            { email: email },
            { $set: { name: name } }
          );
        }
        if (type) {
          await OfficeStaff.findOneAndUpdate(
            { email: email },
            { $set: { type: type } }
          );
        }
        if (phone) {
          await OfficeStaff.findOneAndUpdate(
            { email: email },
            { $set: { phone: phone } }
          );
        }
        if (dob) {
          await OfficeStaff.findOneAndUpdate(
            { email: email },
            { $set: { dob: dob } }
          );
        }
        if (join_date) {
          await RecoveryStaff.findOneAndUpdate(
            { email: email },
            { $set: { join_date: join_date } }
          );
        }
        if (location) {
          await OfficeStaff.findOneAndUpdate(
            { email: email },
            { $set: { location: location } }
          );
        }
        if (address) {
          await OfficeStaff.findOneAndUpdate(
            { email: email },
            { $set: { address: address } }
          );
        }
        if (image) {
          await OfficeStaff.findOneAndUpdate(
            { email: email },
            { $set: { image: image } }
          );
        }
        if (aadhar) {
          await OfficeStaff.findOneAndUpdate(
            { email: email },
            { $set: { aadhar: aadhar } }
          );
        }

        user = await OfficeStaff.findOne({ email: email }).lean();
        return res.status(200).json(user);
      } else {
        let user = await RecoveryStaff.findOne({ email: email }).lean();
        if (!user) {
          return res
            .status(400)
            .json({ message: "User doesn't exist, use a different email" });
        }

        if (name) {
          await RecoveryStaff.findOneAndUpdate(
            { email: email },
            { $set: { name: name } }
          );
        }
        if (type) {
          await RecoveryStaff.findOneAndUpdate(
            { email: email },
            { $set: { type: type } }
          );
        }
        if (phone) {
          await RecoveryStaff.findOneAndUpdate(
            { email: email },
            { $set: { phone: phone } }
          );
        }
        if (dob) {
          await RecoveryStaff.findOneAndUpdate(
            { email: email },
            { $set: { dob: dob } }
          );
        }
        if (join_date) {
          await RecoveryStaff.findOneAndUpdate(
            { email: email },
            { $set: { join_date: join_date } }
          );
        }
        if (location) {
          await RecoveryStaff.findOneAndUpdate(
            { email: email },
            { $set: { location: location } }
          );
        }
        if (address) {
          await RecoveryStaff.findOneAndUpdate(
            { email: email },
            { $set: { address: address } }
          );
        }
        if (image) {
          await RecoveryStaff.findOneAndUpdate(
            { email: email },
            { $set: { image: image } }
          );
        }
        if (aadhar) {
          await RecoveryStaff.findOneAndUpdate(
            { email: email },
            { $set: { aadhar: aadhar } }
          );
        }

        user = await RecoveryStaff.findOne({ email: email }).lean();
        return res.status(200).json(user);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const deleteUser = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      let email = req.params.email;
      let user;

      user = await Dealer.findOne({ email: email }).lean();
      if (user) {
        await Dealer.deleteOne({ email: email });
        await Attendance.deleteMany({ email: email });

        return res.status(200).json("successfully deleted user from database");
      }

      user = await OfficeStaff.findOne({ email: email }).lean();
      if (user) {
        await OfficeStaff.deleteOne({ email: email });
        await Attendance.deleteMany({ email: email });

        return res.status(200).json("successfully deleted user from database");
      }

      user = await RecoveryStaff.findOne({ email: email }).lean();
      if (user) {
        await RecoveryStaff.deleteOne({ email: email });
        await Attendance.deleteMany({ email: email });

        return res.status(200).json("successfully deleted user from database");
      }

      res
        .status(400)
        .json({ message: "User doesn't exist, use a different email" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const getUserSortByCategory = async (req, res) => {
  if (req.Auth) {
    try {
      let dealers, office_staffs, recovery_staffs;
      dealers = await Dealer.find({});
      office_staffs = await OfficeStaff.find({});
      recovery_staffs = await RecoveryStaff.find({});

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

export const getUserByCategory = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      const type = req.params.type;
      let users;
      if (type == "dealer") {
        users = await Dealer.find({});
        if (users) {
          return res.status(200).json(users);
        }
      } else if (type == "officeStaff") {
        users = await OfficeStaff.find({});
        if (users) {
          return res.status(200).json(users);
        }
      } else if (type == "recovery") {
        users = await RecoveryStaff.find({});
        if (users) {
          return res.status(200).json(users);
        }
      } else if (type == "customer") {
        users = await Customer.find({});
        if (users) {
          return res.status(200).json(users);
        }
      }

      return res.status(400).json({ message: "No user in database" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const getAllResetPasswordRequests = async (req, res) => {
  if (req.Auth) {
    try {
      const requests = await RequestReset.find({});

      return res.status(200).json(requests);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const getAllUser = async (req, res) => {
  if (req.Auth) {
    try {
      let dealers, office_staffs, recovery_staffs, customers;
      dealers = await Dealer.find({});
      office_staffs = await OfficeStaff.find({});
      recovery_staffs = await RecoveryStaff.find({});
      customers = await Customer.find({});

      return res.status(200).json({
        dealers: dealers,
        office_staffs: office_staffs,
        recovery_staffs: recovery_staffs,
        customers: customers,
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

export const getAllDealers = async (req, res) => {
  try {
    var dealers = await Dealer.find({});
    return res.status(200).json(dealers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addSubAdmin = async (req, res) => {
  try {
    validationResult(req).throw();
    let {
      name: name,
      email: email,
      password: plain_password,
      phone: phone,
      dob: dob,
      join_date: join_date,
      address: address,
    } = req.body;
    console.log("req.body",req.body)
    let image, aadhar;
    if (req.files) {
      if (req.files.image) image = req.files.image[0].publicUrl;
      if (req.files.aadhar) aadhar = req.files.aadhar[0].publicUrl;
    }

    const checkUser = await SubAdmin.findOne({ email: email }).lean();

    if (checkUser) {
      return res
        .status(400)
        .json({ message: "User already exists, use a different email" });
    }
    console.log("plain_passw,ord",plain_password)

    const password = await bcrypt.hash(plain_password, 10);
    const new_user = await SubAdmin({
      name: name,
      email: email,
      password: password,
      phone: phone,
      dob: dob,
      join_date: join_date,
      address: address,
      image: image,
      aadhar: aadhar,
    });
    const get_user = await new_user.save();

    return res.status(200).json(get_user);
  } catch (error) {
    console.log("error",error)
    return res.status(500).json({ message: error.message });
  }
};

export const getAllSubAdmin = async (req, res) => {
  try {
    const subAdmin = await SubAdmin.find({});
    return res.status(200).json(subAdmin);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSubAdmin = async (req, res) => {
  try {
    let email = req.params.email;
    const subAdmin = await SubAdmin.findOne({ email: email }).lean();

    if (!subAdmin) {
      return res.status(400).json({ message: "Enter valid id" });
    }

    await SubAdmin.findOneAndDelete({ email: email });

    return res.status(200).json({ message: "Sub-Admin deleted success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addNewScheme = async (req, res) => {
  try {
    const { schemename: schemename, schemepercentage: schemepercentage } =
      req.body;
    const newScheme = await Scheme({
      name: schemename,
      schemePercentage: schemepercentage,
    });
    await newScheme.save();
    return res.status(200).json({ message: "Scheme added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteScheme = async (req, res) => {
  try {
    let id = req.params.id;

    var scheme = await Scheme.findById(id).lean();
    if (!scheme) {
      return res.status(400).json({ message: "Enter valid id" });
    }

    await Scheme.findByIdAndDelete(id);

    return res.status(200).json({ message: "Scheme Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

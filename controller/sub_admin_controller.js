import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import SubAdmin from  "../models/subAdmin.js"


export const subadminLogin = async (req, res) => {
    try {

      validationResult(req).throw();
  
      const { email: email, password: password } = req.body;
  
      const subadmin = await SubAdmin.findOne({ email: email }).lean();
  
      if (!subadmin) {
         
        return res
          .status(404)
          .json({ message: "email doesn't exist, use a different email" });
      }
  
      if (await bcrypt.compare(password, subadmin.password)) {
        const accessToken = jwt.sign({ email: email }, process.env.ADMIN_JWT_KEY);
  
        return res
          .status(200)
          .json({   user: subadmin  , token: accessToken });
      }
  
      return res.status(401).json({ error: "Invalid email/ password" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
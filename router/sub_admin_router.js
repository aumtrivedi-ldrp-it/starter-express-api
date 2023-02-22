import { Router } from "express";
import { uploadMulter } from "../utils/uploadmulter.js";
import { adminAuth } from "../middleware/auth.js";

import { subadminLogin } from "../controller/sub_admin_controller.js";

import {
  createNewUser,
  getAllUser,
  getUserSortByCategory,
  deleteUser,
  getUserByCategory,
  getAllResetPasswordRequests,
  resetPassword,
  getAllDealers,
} from "../controller/admin_controller.js";
import {
  createUserValidation,
  emailValidation,
  loginValidation,
  resetPasswordValidation,
  paramTypeValidation,
} from "../middleware/validation.js";

const router = Router();

router.post("/login", loginValidation, subadminLogin);

router.post(
  "/create/staff",
  adminAuth,
  uploadMulter.fields([{ name: "image" }, { name: "aadhar" }]),
  createUserValidation,
  createNewUser
);

router.delete("/deletestaff/:email", adminAuth, emailValidation, deleteUser);

router.get("/reset/requests", adminAuth, getAllResetPasswordRequests);

router.put(
  "/reset/password",
  adminAuth,
  resetPasswordValidation,
  resetPassword
);

router.get(
  "/users/category/:type",
  adminAuth,
  paramTypeValidation,
  getUserByCategory
);

router.get("/users/all/category", adminAuth, getUserSortByCategory);

router.get("/users", adminAuth, getAllUser);

router.get("/getall/dealers", adminAuth, getAllDealers);

export default router;

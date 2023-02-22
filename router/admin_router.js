import { Router } from "express";
import { uploadMulter } from "../utils/uploadmulter.js";
import { adminAuth } from "../middleware/auth.js";
import {
  createNewUser,
  getAllUser,
  getUserSortByCategory,
  deleteUser,
  getUserByCategory,
  updateUser,
  adminSignup,
  adminLogin,
  getAllResetPasswordRequests,
  resetPassword,
  updateAdminFcm,
  getAllDealers,
  getAllSubAdmin,
  addSubAdmin,
  deleteSubAdmin,
  addNewScheme,
  deleteScheme,
} from "../controller/admin_controller.js";
import {
  createUserValidation,
  emailValidation,
  updateUserValidation,
  adminSignupValidation,
  loginValidation,
  resetPasswordValidation,
  updateFcmValidation,
  paramTypeValidation,
  subadminCreateValidation,
} from "../middleware/validation.js";

const router = Router();

router.get("/", adminAuth, async (req, res) => {
  res.status(200).json({ message: "success" });
});

router.post("/signup", adminSignupValidation, adminSignup);

router.post("/login", loginValidation, adminLogin);

router.put("/update/fcm", adminAuth, updateFcmValidation, updateAdminFcm);

router.post(
  "/create",
  adminAuth,
  uploadMulter.fields([{ name: "image" }, { name: "aadhar" }]),
  createUserValidation,
  createNewUser
);

router.post(
  "/update",
  adminAuth,
  uploadMulter.fields([{ name: "image" }, { name: "aadhar" }]),
  updateUserValidation,
  updateUser
);

router.delete("/delete/:email", adminAuth, emailValidation, deleteUser);

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

router.post(
  "/create/subadmin",
  adminAuth,
  uploadMulter.fields([{ name: "image" }, { name: "aadhar" }]),
  subadminCreateValidation,
  addSubAdmin
);

router.get("/get/subadmin", adminAuth, getAllSubAdmin);

router.delete("/subadmin/:email", adminAuth, deleteSubAdmin);

router.post("/addnew/scheme", addNewScheme);

router.delete("/scheme/:id" , deleteScheme);


export default router;

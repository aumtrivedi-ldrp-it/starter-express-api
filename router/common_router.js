import { Router } from "express";

import { userAuth } from "../middleware/auth.js";
import {
  bodyEmailValidation,
  checkEmailValidation,
  emailValidation,
  loginValidation,
  paramTypeValidation,
  requestResetPasswordValidation,
  typeValidation,
  updateFcmValidation,
} from "../middleware/validation.js";
import {
  checkEmailExists,
  checkTypeOfUser,
  dealerLogin,
  getAdminFcm,
  getAllCustomers,
  getAllUsersFcm,
  getDealerInfo,
  getOfficeStaffInfo,
  getRecoveryInfo,
  getUserFcm,
  getUsersFcmByType,
  officeStaffLogin,
  recoveryLogin,
  requestResetPassword,
  updateFcm,
  listOfEmi,
  getPendingEmiById,
  searchStaff,
  getAllSchemes
} from "../controller/common_controller.js";

const router = Router();

router.post("/dealer/login", loginValidation, dealerLogin);
router.post("/office/login", loginValidation, officeStaffLogin);
router.post("/recovery/login", loginValidation, recoveryLogin);

router.get("/", userAuth, async (req, res) => {
  res.status(200).json({ message: "success" });
});

router.post("/dealer/getinfo", bodyEmailValidation, getDealerInfo);

router.post("/office/getinfo", bodyEmailValidation, getOfficeStaffInfo);

router.post("/recovery/getinfo", bodyEmailValidation, getRecoveryInfo);

router.get("/:email", checkEmailValidation, checkEmailExists);

router.get("/type/:email", checkEmailValidation, checkTypeOfUser);

router.post(
  "/request/password-reset",
  requestResetPasswordValidation,
  requestResetPassword
);

router.get("/fcm/users", userAuth, getAllUsersFcm);

router.get(
  "/fcm/type/users/:type",
  userAuth,
  paramTypeValidation,
  getUsersFcmByType
);

router.get("/fcm/admin", userAuth, getAdminFcm);

router.get("/fcm/user/:email", userAuth, emailValidation, getUserFcm);

router.put("/update/fcm", userAuth, updateFcmValidation, updateFcm);

router.get("/customers/all", userAuth, getAllCustomers);

//list of emi
router.get("/user/listofEmi/:userID", listOfEmi);

router.get("/getpendingemibyid/:customerId", getPendingEmiById);

router.get("/searchstaff/:query", searchStaff);

router.get("/all/schemes", getAllSchemes);

export default router;

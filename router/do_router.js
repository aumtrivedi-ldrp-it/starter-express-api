import { Router } from "express";
import { userAuth } from "../middleware/auth.js";
import { uploadMulter } from "../utils/uploadmulter.js";
import {
  approvedDoForms,
  createDoForm,
  doFormById,
  nonApprovedDoForm,
  updateApproveDoForm,
  cancelDoForm
} from "../controller/do_controller.js";


const router = Router();

router.post(
  "/create/",
  userAuth,
  uploadMulter.fields([
    { name: "salesExecutiveSignature" },
    { name: "branchHeadSignature" },
    { name: "dealerSignature" },
  ]),
  createDoForm
);

router.get("/non-approved-form", userAuth ,nonApprovedDoForm);

router.put("/update-do-form", userAuth , updateApproveDoForm);

router.get("/approved-do-form", userAuth , approvedDoForms);

router.get("/doformById/:id", userAuth , doFormById);

router.delete("/cancel", cancelDoForm);

export default router;

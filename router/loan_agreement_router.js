import { Router } from "express";
import { userAuth } from "../middleware/auth.js";
import multer from "multer";
import FirebaseStorage from "multer-firebase-storage";

import {
  createLoanAgreement,
  getLoanAgreementById,
  payEmi,
} from "../controller/loan_agreement_controller.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("../keys/firebase.json");

const upload = multer({
  storage: FirebaseStorage({
    bucketName: process.env.FIREBASE_BUCKET_NAME,
    credentials: {
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
      projectId: serviceAccount.project_id,
    },
    public: true,
    directoryPath: process.env.FIREBASE_DIRECTORY_PATH,
    hooks: {
      beforeUpload(req, file) {
        file.originalname = new Date().toISOString() + "-" + file.originalname;
      },
    },
  }),
});

const uploadMultiple = upload.fields([
  { name: "customer_image" },
  { name: "customer_signature" },
  { name: "guarnteer_image" },
  { name: "guarnteer_signature" },
  { name: "lender_signature" },
  { name: "co_borrower_signature" },
  { name: "co_borrower_signature_with_seal" },
  { name: "guarnator_2_signature" },
  { name: "reference_1_signature" },
  { name: "reference_2_signature" },
  { name: "witness_1_signature" },
  { name: "witness_2_signature" },
  { name: "branch_head_signature_with_seal" },
]);


const router = Router();

router.post("/create/" , uploadMultiple , createLoanAgreement);

router.get("/:id", userAuth, getLoanAgreementById);

router.put("/payEmi",userAuth ,payEmi);

export default router;

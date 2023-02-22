import { Router } from "express";

import { getRecovery , completeRecovery, madePayment} from "../controller/recovery_staff_controller.js";

const router = Router();

router.get("/getRecovery/:recoveryStaffId",getRecovery );

router.post("/completerecovery", completeRecovery);

router.post("/madepayment", madePayment)

export default router;
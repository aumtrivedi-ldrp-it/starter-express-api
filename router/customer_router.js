import { Router } from "express";
import { userLogin, searchCustomer ,getChequeListById , getVehicleStatus} from "../controller/customer_controller.js";
import { userAuth } from "../middleware/auth.js";

const router = Router();

router.post('/login', userLogin);

//search customer
router.get("/search/:query", searchCustomer );

router.get("/chequeList/:customerId", getChequeListById)

router.get("/vehiclestatus/:customerId", getVehicleStatus)

export default router;
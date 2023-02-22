import { Router } from "express";
import { listOfPendingEMI , markRecovery , reAssignRecoveryToAnotherStaff, getListOfRecoveryStaff , getAllRecovery , getAllSeizedVehicles , UnseizedVehicle ,} from "../controller/office_staff_controller.js";
import { userAuth } from "../middleware/auth.js";

const router = Router();

router.get("/listofpendingemi",userAuth ,listOfPendingEMI);

router.put("/markrecovery", markRecovery );

router.put("/reassign/recovery",reAssignRecoveryToAnotherStaff);

router.get("/recoverystafflist", getListOfRecoveryStaff);

router.get("/recovery/all" ,  getAllRecovery);

router.get("/seizedvehicles", getAllSeizedVehicles);

router.put("/unseizedvehicle" , UnseizedVehicle);

export default router;

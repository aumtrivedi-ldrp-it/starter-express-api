import { Router } from "express";

import {
  addShowroomDealers,
  createShowroom,
  deleteShowroom,
  getAllShowrooms,
  removeShowroomDealers,
  updateShowroom,
  getAllDealerInShowroom
} from "../controller/showroom_controller.js";
import { adminAuth } from "../middleware/auth.js";
import {
  createShowroomValidation,
  idValidation,
  showroomDealerValidation,
  updateShowroomValidation,
  allDealersByShowroom
} from "../middleware/showroom_validation.js";

const router = Router();

router.post("/admin/showroom/create", createShowroomValidation, createShowroom);

router.get("/admin/showroom/all", adminAuth, getAllShowrooms);

router.put(
  "/admin/showroom/update",
  adminAuth,
  updateShowroomValidation,
  updateShowroom
);

router.put(
  "/admin/showroom/delete/:id",
  adminAuth,
  idValidation,
  deleteShowroom
);

router.put(
  "/admin/showroom/dealer/add",
  adminAuth,
  showroomDealerValidation,
  addShowroomDealers
);

router.put(
  "/admin/showroom/dealer/remove",
  adminAuth,
  showroomDealerValidation,
  removeShowroomDealers
);

router.get(
  "/admin/showroom/alldealers/:showroomid",
  adminAuth,
  allDealersByShowroom,
  getAllDealerInShowroom

)

export default router;

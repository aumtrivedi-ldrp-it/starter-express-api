import { Router } from "express";

import {
  createNotification,
  createUserNotification,
  deleteNotification,
  getAllNotification,
  getUserNotification,
} from "../controller/notification_controllers.js";
import { adminAuth, userAuth } from "../middleware/auth.js";
import { idValidation } from "../middleware/showroom_validation.js";
import {
  emailValidation,
  notificationValidation,
  userNotificationValidation,
} from "../middleware/validation.js";

const router = Router();

router.post(
  "/admin/notification/create/all",
  adminAuth,
  notificationValidation,
  createNotification
);

router.post(
  "/admin/notification/create",
  adminAuth,
  userNotificationValidation,
  createUserNotification
);

router.post(
  "/admin/notification/delete",
  adminAuth,
  idValidation,
  deleteNotification
);

router.get("/common/notifications/all", userAuth, getAllNotification);

router.get(
  "/common/notifications/user/:email",
  userAuth,
  emailValidation,
  getUserNotification
);

export default router;

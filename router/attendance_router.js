import { Router } from "express";

import {
  markAttendance,
  attendanceAccordingToDate,
  presentCountAccordingToDate,
  excelAttendanceAccordingToDate,
  attendanceAccordingToMonth,
  excelAttendanceAccordingToMonth,
} from "../controller/attendance_controller.js";
import { adminAuth, userAuth } from "../middleware/auth.js";

const router = Router();

router.post(
  "/admin/mark/attendance",

  markAttendance
);

router.get(
  "/admin/attendance/accordingto/date/:date",
  attendanceAccordingToDate
);

router.get(
  "/admin/attendance/presentcount/accordingto/date/:date",
  presentCountAccordingToDate
);

router.get(
  "/attendance/excel/accordingto/date/:date",
  excelAttendanceAccordingToDate
);

router.get(
  "/admin/attendance/accordingto/month/:date",
  attendanceAccordingToMonth
);

router.get(
  "/attendance/excel/accordingto/month/:date",
  excelAttendanceAccordingToMonth
);

export default router;

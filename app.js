import express, { urlencoded, json } from "express";
import cors from "cors";

import initDB from "./initDb.js";

import commonRouter from "./router/common_router.js";
import adminRouter from "./router/admin_router.js";
import subadminRouter from "./router/sub_admin_router.js";
import customerRouter from "./router/customer_router.js";
import notificationRouter from "./router/notification_router.js";
import attendanceRouter from "./router/attendance_router.js";
import showroomRouter from "./router/showroom_router.js";
// import doRouter from "./router/do_router.js";
// import loanagreementRouter from "./router/loan_agreement_router.js";
import officestaffRouter from "./router/office_staff_router.js";
import recoverystaffRouter from "./router/recovery_staff_router.js";

const app = express();
const HOST = "0.0.0.0";

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());

//! initialize mongoDB
initDB();

app.get("/", (req, res) => {
  res.send("Api working");
});

// ! admin router
app.use("/admin", adminRouter);


// ! sub-admin router
app.use("/subadmin", subadminRouter);

// ! common router
app.use("/common", commonRouter);

// ! customer router
app.use("/customer", customerRouter);

// ! notification router
app.use("/", notificationRouter);

// ! attendance router
app.use("/", attendanceRouter);

// ! showroom router
app.use("/", showroomRouter);

// ! do router
// app.use("/doform", doRouter);

//! loanagreement router
// app.use("/loanagreement", loanagreementRouter);

//! officestaff router
app.use("/officestaff", officestaffRouter);

//! recoverystaff router
app.use("/recoverystaff", recoverystaffRouter);

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, HOST, () => {
      console.log(`Server started at ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

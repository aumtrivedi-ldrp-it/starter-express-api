import ExcelJs from "exceljs";
import * as fs from "fs";
import uploadfile from "../utils/uploadfile.js";
import Attendance from "../models/attendance.js";
import moment from "moment";

export const markAttendance = async (req, res) => {
  try {
    const { employees: employees } = req.body;

    const newAttendance = await Attendance({
      employees: employees,
    });

    await newAttendance.save();
    return res.status(200).json({
      message: "Attendance marked success",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const attendanceAccordingToDate = async (req, res) => {
  try {
    const date = req.params.date;
    let todayDate = moment(date, "YYYY-MM-DD").toDate();
    let today = moment(todayDate).startOf("day");
    const attendance = await Attendance.findOne({
      date: {
        $gte: today.toDate(),
        $lte: moment(today).endOf("day").toDate(),
      },
    });
    if (!attendance) {
      return res.status(200).json({});
    }
    return res.status(200).json(attendance);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const presentCountAccordingToDate = async (req, res) => {
  try {
    const date = req.params.date;
    let todayDate = moment(date, "YYYY-MM-DD").toDate();
    let today = moment(todayDate).startOf("day");
    const attendance = await Attendance.findOne({
      date: {
        $gte: today.toDate(),
        $lte: moment(today).endOf("day").toDate(),
      },
    });

    if (!attendance) {
      return res.status(200).json({
        "total employees": 0,
        present: 0,
      });
    }
    const totalEmpCount = attendance.employees.length;

    let presentCount = 0;

    for (let index = 0; index < attendance.employees.length; index++) {
      if (attendance.employees[index].attendance > 0) {
        presentCount += 1;
      }
    }

    return res.status(200).json({
      "total employees": totalEmpCount,
      present: presentCount,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const excelAttendanceAccordingToDate = async (req, res) => {
  try {
    const date = req.params.date;
    let todayDate = moment(date, "YYYY-MM-DD").toDate();
    let today = moment(todayDate).startOf("day");
    const attendances = await Attendance.findOne({
      date: {
        $gte: today.toDate(),
        $lte: moment(today).endOf("day").toDate(),
      },
    });
    if (!attendances) {
      return res.status(400).json({ message: "Attendance not found" });
    }

    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet("worksheet");
    worksheet.columns = [
      { header: "S.No", key: "s_no", width: 10 },
      { header: "Name", key: "userName", width: 10 },
      { header: "Email", key: "userEmail", width: 30 },
      { header: "Type", key: "userType", width: 10 },
      { header: "Attendance", key: "attendance", width: 10 },
    ];

    let index = 1;

    attendances.employees.forEach((attendance) => {
      attendance.s_no = index;
      worksheet.addRow(attendance);
      index++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    await workbook.xlsx.writeFile("./attendance/attendance.xlsx");

    let url = await uploadfile("./attendance/attendance.xlsx");

   fs.unlinkSync(`./attendance/attendance.xlsx`);
    return res.status(200).json({ url: url });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
};

export const attendanceAccordingToMonth = async (req, res) => {
  try {
    const date = req.params.date;
    let todayDate = moment(date, "YYYY-MM-DD").toDate();
    let today = moment(todayDate).startOf("month");
    const attendances = await Attendance.find({
      date: {
        $gte: today.toDate(),
        $lte: moment(today).endOf("month").toDate(),
      },
    });
    if (!attendances) {
      return res.status(200).json({});
    }
    return res.status(200).json(attendances);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const excelAttendanceAccordingToMonth = async (req, res) => {
  try {
    const date = req.params.date;
    let todayDate = moment(date, "YYYY-MM-DD").toDate();
    let today = moment(todayDate).startOf("month");
    const attendances = await Attendance.find({
      date: {
        $gte: today.toDate(),
        $lte: moment(today).endOf("month").toDate(),
      },
    });
    if (!attendances) {
      return res.status(400).json({ message: "Attendance not found" });
    }
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet("worksheet");
    worksheet.columns = [
      { header: "S.No", key: "s_no", width: 10 },
      { header: "Name", key: "userName", width: 10 },
      { header: "Email", key: "userEmail", width: 30 },
      { header: "Type", key: "userType", width: 10 },
      { header: "Attendance", key: "attendance", width: 10 },
    ];
    let attendanceArray = [];
    attendances.forEach((attendace) => {
      attendace.employees.forEach((employee, index) => {
        attendanceArray[index] =
          attendanceArray[index] !== undefined
            ? attendanceArray[index] + employee.attendance
            : employee.attendance;
      });
    });
    attendances[0].employees.forEach((employee, index) => {
      employee.s_no = index + 1;
      employee.attendance = attendanceArray[index];
      worksheet.addRow(employee);
    });
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    await workbook.xlsx.writeFile("attendance/attendance.xlsx");
    let url = await uploadfile("./attendance/attendance.xlsx");
    fs.unlinkSync(`./attendance/attendance.xlsx`);
    return res.status(200).json({ url: url });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

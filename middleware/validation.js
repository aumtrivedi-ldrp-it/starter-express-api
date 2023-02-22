import { param, check } from "express-validator";

export const adminSignupValidation = [
  check("email", "Invalid email").isEmail(),
  check("password", "Password is required").notEmpty().isString(),
];

export const loginValidation = [
  check("email", "Invalid email").isEmail(),
  check("password", "Password is required").notEmpty().isString(),
];

export const checkEmailValidation = [param("email", "Invalid email").isEmail()];

export const bodyEmailValidation = [check("email", "Invalid email").isEmail()];

export const dateValidation = [
  param("date", "Must be a valid date in format yyyy-mm-dd").isDate({
    format: "YYYY-MM-DD",
  }),
];

export const nameValidation = [
  check("name", "Name is required").notEmpty().isString(),
];

export const notificationValidation = [
  check("text", "text is required").notEmpty().isString(),
];

export const userNotificationValidation = [
  check("email", "Invalid email").isEmail(),
  check("text", "text is required").notEmpty().isString(),
];

export const typeValidation = [
  check(
    "type",
    `type must be a value from given values ["dealer", "officeStaff", "recovery"] `
  ).isIn(["dealer", "officeStaff", "recovery"]),
];

export const allTypeValidation = [
  check(
    "type",
    `type must be a value from given values ["dealer", "officeStaff", "recovery", "customer"] `
  ).isIn(["dealer", "officeStaff", "recovery", "customer"]),
];

export const paramTypeValidation = [
  param(
    "type",
    `type must be a value from given values ["dealer", "officeStaff", "recovery", "customer"] `
  ).isIn(["dealer", "officeStaff", "recovery", "customer"]),
];

export const emailValidation = [param("email", "Invalid email").isEmail()];

export const dateAndTypeValidation = [
  check("date", "Must be a valid date in format yyyy-mm-dd").isDate({
    format: "YYYY-MM-DD",
  }),
  check(
    "type",
    `type must be a value from given values ["dealer", "officeStaff", "recovery"] `
  ).isIn(["dealer", "officeStaff", "recovery"]),
];

export const userByMonthValidation = [
  check("email", "Invalid email").isEmail(),
  check("month", "invalid month, month must be in range 1 - 12").isInt({
    min: 1,
    max: 12,
  }),
];

export const userByDateValidation = [
  check("email", "Invalid email").isEmail(),
  check("date", "Must be a valid date in format yyyy-mm-dd").isDate({
    format: "YYYY-MM-DD",
  }),
];

export const createUserValidation = [
  check("name", "Name is required").notEmpty().isString(),
  check("email", "Invalid email").isEmail(),
  check(
    "type",
    `type must be a value from given values ["dealer", "officeStaff", "recovery"] `
  ).isIn(["dealer", "officeStaff", "recovery"]),
  check("phone", "Invalid phone number")
    .optional()
    .isInt({ min: 1000000000, max: 9999999999 }),
  check("dob", "Must be a valid date in format yyyy-mm-dd").isDate({
    format: "YYYY-MM-DD",
  }),
  check("join_date", "Must be a valid date in format yyyy-mm-dd").isDate({
    format: "YYYY-MM-DD",
  }),
  check("address").optional().isString(),
  check("location").optional().isString(),
];

export const subadminCreateValidation = [
  check("name", "Name is required").notEmpty().isString(),
  check("email", "Invalid email").isEmail(),
  check("phone", "Invalid phone number")
    .isInt({ min: 1000000000, max: 9999999999 }),
  check("dob", "Must be a valid date in format yyyy-mm-dd").isDate({
    format: "YYYY-MM-DD",
  }),
  check("join_date", "Must be a valid date in format yyyy-mm-dd").isDate({
    format: "YYYY-MM-DD",
  }),
  check("address").optional().isString(),
  check("location").optional().isString(),
];

export const updateUserValidation = [
  check("name", "Name is required").optional().isString(),
  check("email", "Invalid email").isEmail(),
  check(
    "type",
    `type must be a value from given values ["dealer", "officeStaff", "recovery"] `
  ).isIn(["dealer", "officeStaff", "recovery"]),
  check("phone", "Invalid phone number")
    .optional()
    .isInt({ min: 1000000000, max: 9999999999 }),
  check("dob", "Must be a valid date in format yyyy-mm-dd")
    .optional()
    .isDate({ format: "YYYY-MM-DD" }),
  check("join_date", "Must be a valid date in format yyyy-mm-dd")
    .optional()
    .isDate({ format: "YYYY-MM-DD" }),
  check("address").optional().isString(),
  check("location").optional().isString(),
];

export const monthValidation = [
  param("month", "invalid month, month must be in range 1 - 12").isInt({
    min: 1,
    max: 12,
  }),
];

export const getListByDateValidation = [
  check("date", "Must be a valid date in format yyyy-mm-dd").isDate({
    format: "YYYY-MM-DD",
  }),
  check("isPresent", "isPresent must be a boolean type").isBoolean(),
];

export const getListByMonthValidation = [
  check("month", "invalid month, month must be in range 1 - 12").isInt({
    min: 1,
    max: 12,
  }),
  check("isPresent", "isPresent must be a boolean type").isBoolean(),
];

export const resetPasswordValidation = [
  check("email", "Invalid email").isEmail(),
  check("password", "Password is required").notEmpty().isString(),
  check(
    "type",
    `type must be a value from given values ["dealer", "officeStaff", "recovery"] `
  ).isIn(["dealer", "officeStaff", "recovery"]),
];

export const requestResetPasswordValidation = [
  check("name", "Name is required").isString(),
  check("email", "Invalid email").isEmail(),
  check(
    "type",
    `type must be a value from given values ["dealer", "officeStaff", "recovery"] `
  ).isIn(["dealer", "officeStaff", "recovery"]),
  check("token", "token is required").isString(),
];

export const updateFcmValidation = [
  check("email", "Invalid email").isEmail(),
  check("fcm", "fcm is required").notEmpty().isString(),
  check(
    "type",
    `type must be a value from given values ["dealer", "officeStaff", "recovery", "admin"] `
  ).isIn(["dealer", "officeStaff", "recovery", "admin"]),
];

import { validationResult } from "express-validator";

import Notification from "../models/notification.js";

export const createNotification = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      const { text: text } = req.body;

      const new_notification = await Notification({
        text: text,
        isGlobal: true,
      });
      const get_notification = await new_notification.save();

      return res.status(200).json(get_notification);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const createUserNotification = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      const { text: text, email: email } = req.body;

      const new_notification = await Notification({
        text: text,
        user_email: email,
        isGlobal: false,
      });
      const get_notification = await new_notification.save();

      return res.status(200).json(get_notification);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const deleteNotification = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      const id = req.params.id;

      await Notification.findByIdAndDelete({ _id: id });

      return res
        .status(200)
        .json({ message: "successfully deleted notification" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const getUserNotification = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      let email = req.params.email;
      const notifications = await Notification.find({
        user_email: email,
        isGlobal: false,
      });

      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const getAllNotification = async (req, res) => {
  if (req.Auth) {
    try {
      const notifications = await Notification.find({ isGlobal: true });

      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

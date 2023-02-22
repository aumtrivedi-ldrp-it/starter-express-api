import { validationResult } from "express-validator";

import Dealer from "../models/dealer.js";
import Showroom from "../models/showroom.js";

export const createShowroom = async (req, res) => {
  // if (req.Auth) {
  if (true) {
    try {
      validationResult(req).throw();

      const {
        showroom_name: showroom_name,
        showroom_owner: showroom_owner,
        showroom_location: showroom_location,
      } = req.body;

      const new_showroom = await Showroom({
        name: showroom_name,
        owner_name: showroom_owner,
        location: showroom_location,
      });
      const get_showroom = await new_showroom.save();

      return res.status(200).json(get_showroom);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const updateShowroom = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      const {
        id: id,
        showroom_name: showroom_name,
        showroom_owner: showroom_owner,
        showroom_location: showroom_location,
      } = req.body;

      let showroom = await Showroom.findOne({ _id: id });
      if (!showroom) {
        return res.status(200).json({
          message: "showroom with this id doesn't exist ,use different id",
        });
      }

      if (showroom_location) {
        let dealers = showroom.dealers;

        if (Array.isArray(dealers)) {
          for (var i = 0; i < dealers.length; i++) {
            let dealer = dealers[i];
            await Dealer.findOneAndUpdate(
              { email: dealer.email },
              { $pull: { location: showroom.location } }
            );
            await Dealer.findOneAndUpdate(
              { email: dealer.email },
              { $push: { location: showroom_location } }
            );
          }
        }
        await Showroom.findOneAndUpdate(
          { _id: id },
          { location: showroom_location }
        );
      }

      if (showroom_name) {
        await Showroom.findOneAndUpdate({ _id: id }, { name: showroom_name });
      }
      if (showroom_owner) {
        await Showroom.findOneAndUpdate(
          { _id: id },
          { owner_name: showroom_owner }
        );
      }

      const get_showroom = await Showroom.findOne({ _id: id });

      return res.status(200).json(get_showroom);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const deleteShowroom = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      const id = req.params.id;

      let showroom = await Showroom.findOne({ _id: id });
      if (!showroom) {
        return res.status(200).json({
          message: "showroom with this id doesn't exist ,use different id",
        });
      }

      await Showroom.findOneAndDelete({ _id: id });

      return res.status(200).json({ message: "successfully delete the room" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const addShowroomDealers = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      const { showroom_id: showroom_id, dealer_email: dealer_email } = req.body;

      let showroom = await Showroom.findOne({ _id: showroom_id });
      let dealer = await Dealer.findOne({ email: dealer_email });

      if (!dealer) {
        return res.status(200).json({
          message: "dealer with this email doesn't exist ,use different email",
        });
      }
      if (!showroom) {
        return res.status(200).json({
          message: "showroom with this id doesn't exist ,use different id",
        });
      }

      await Showroom.findOneAndUpdate(
        { _id: showroom_id },
        {
          $push: {
            dealers: {
              name: dealer.name,
              email: dealer_email,
              phone: dealer.phone,
              fcm: dealer.fcm,
            },
          },
        }
      );
      await Dealer.findOneAndUpdate(
        { email: dealer.email },
        { $push: { location: showroom.location } }
      );

      return res
        .status(200)
        .json({ message: "succesfully added dealer to the showroom" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const removeShowroomDealers = async (req, res) => {
  if (req.Auth) {
    try {
      validationResult(req).throw();

      const { showroom_id: showroom_id, dealer_email: dealer_email } = req.body;

      let showroom = await Showroom.findOne({ _id: showroom_id });
      let dealer = await Dealer.findOne({ email: dealer_email });

      if (!dealer) {
        return res.status(200).json({
          message: "dealer with this email doesn't exist ,use different email",
        });
      }
      if (!showroom) {
        return res.status(200).json({
          message: "showroom with this id doesn't exist ,use different id",
        });
      }

      await Showroom.findOneAndUpdate(
        { _id: showroom_id },
        { $pull: { dealers: { email: dealer_email } } }
      );
      await Dealer.findOneAndUpdate(
        { email: dealer.email },
        { $pull: { location: showroom.location } }
      );

      return res
        .status(200)
        .json({ message: "succesfully removed dealer from the showroom" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};

export const getAllShowrooms = async (req, res) => {
  if (req.Auth) {
    try {
      let showrooms = await Showroom.find({});

      return res.status(200).json(showrooms);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};


export const getAllDealerInShowroom = async(req,res) => {
    if (req.Auth) {
    try {
      validationResult(req).throw();
      const id = req.params.showroomid;
      let showrooms = await Showroom.findById(id);

      return res.status(200).json(showrooms);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
   else {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
}
import mongoose from "mongoose";

export const notificationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isGlobal: {
    type: Boolean,
    default: false,
  },
  user_email: {
    type: String,
  },
  date: {
    type: Date,
    default: new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000
    ),
  },
});

const Notification = mongoose.model("notification", notificationSchema);

export default Notification;

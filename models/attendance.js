import mongoose from "mongoose";

export const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000
      ),
    },
    employees: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId },
        userType: { type: String },
        attendance: { type: Number },
        userEmail: {type: String},
        userPhoto: {type:String},
        userName: {type:String}
      },
    ],
  },
  { timestamps: true  }
);

const Attendance = mongoose.model("attendance", attendanceSchema);

export default Attendance;

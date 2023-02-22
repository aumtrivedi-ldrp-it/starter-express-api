import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const initDb = () => {
  mongoose
    .connect('mongodb://localhost:27017/', {
      dbName: 'TempFint',
      user: '',
      pass: '',
      // userNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    })
    .then(() => {
      console.log("Mongodb connected");
    })
    .catch((err) => console.log(err.message));

  mongoose.connection.on("connected", () => {
    console.log("Mongodb connected to db");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongodb disconnected");
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log("Mongoose connection is disconnected due to app termination");
      process.exit(0);
    });
  });
};

export default initDb;

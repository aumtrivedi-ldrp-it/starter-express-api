import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("../keys/firebase.json");

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${process.env.FIREBASE_BUCKET_NAME}`,
});

const storage = getStorage();
const bucket = storage.bucket();
const token = storage.token;

const uploadfile = async (filepath) => {
  try {
    const options = {
      public: true,
    };
    var file = await bucket.upload(filepath, options);
    return file[1].mediaLink;
  } catch (error) {
    throw Error;
  }
};
export default uploadfile;

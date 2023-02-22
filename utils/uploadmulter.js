import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("../keys/firebase.json");
import multer from "multer";
import FirebaseStorage from "multer-firebase-storage";


export const uploadMulter =  multer({
  storage: FirebaseStorage({
    bucketName: process.env.FIREBASE_BUCKET_NAME,
    credentials: {
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
      projectId: serviceAccount.project_id,
    },
    public: true,
    directoryPath: process.env.FIREBASE_DIRECTORY_PATH,
    hooks: {
      beforeUpload(req, file) {
        file.originalname = new Date().toISOString() + "-" + file.originalname;
      },
    },
  }),
});

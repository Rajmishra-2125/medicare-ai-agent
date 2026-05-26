import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Gracefully skip initialization if the service account path isn't provided
if (!process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  console.log("Firebase Admin SDK skipped. Service account path missing.");
} else {
  try {
    const serviceAccount = JSON.parse(
      fs.readFileSync(
        path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH),
        "utf-8"
      )
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.log("Failed to initialize Firebase Admin SDK:", error);
  }
}

export const firebaseAdmin = admin;

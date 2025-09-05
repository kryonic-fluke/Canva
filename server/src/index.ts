import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import * as admin from "firebase-admin";

import userRoutes from "./routes/userRoutes";
import canvasRoutes from "./routes/canvasRoutes";

dotenv.config();

if (admin.apps.length === 0) {
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    credential = admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    );
  } else {
    try {
      const serviceAccount = require("../../serviceAccountKey.json");
      credential = admin.credential.cert(serviceAccount);
    } catch (error) {
      console.error("Neither FIREBASE_SERVICE_ACCOUNT env var nor local file found");
      throw new Error("Firebase credentials not configured properly");
    }
  }
  
  admin.initializeApp({ credential });
  console.log("Firebase Admin SDK Initialized.");
}

export const firestoreDb = admin.firestore();

export const app = express();
const port = process.env.PORT || 5001;
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clustercanva0.4bwgyeq.mongodb.net/creative-canvas-db?retryWrites=true&w=majority`;

if (!mongoURI) {
  throw new Error("MONGO_URI not found in .env file.");
}
const corsOrigins = process.env.NETLIFY
  ? [process.env.URL, "https://synapse-workspace.netlify.app"]
  : ["http://localhost:5174"];

app.use(
  cors({
    origin: corsOrigins as string[],
    credentials: true,
  })
);
app.use(express.json());

app.use('/users', userRoutes);
app.use('/canvases', canvasRoutes);

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    if (!mongoURI) throw new Error("MONGO_URI not found");
    await mongoose.connect(mongoURI);
    console.log("New MongoDB connection established.");
  }
};

if (!process.env.NETLIFY) {
  connectToDatabase().then(() => {
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  });
}

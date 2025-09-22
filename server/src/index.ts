// server/src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import * as admin from "firebase-admin";

import userRoutes from "./routes/userRoutes";
import canvasRoutes from "./routes/canvasRoutes";

dotenv.config();

if (admin.apps.length === 0) {
  let appOptions = {};

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    appOptions = {};
    console.log("Firebase credentials sourced from GOOGLE_APPLICATION_CREDENTIALS.");
  }
  else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    appOptions = {
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      ),
    };
  }
  else {
    try {
      const serviceAccount = require("../../serviceAccountKey.json");
      appOptions = {
        credential: admin.credential.cert(serviceAccount),
      };
    } catch (error) {
      console.error("No Firebase credentials found (env vars or local file).");
      throw new Error("Firebase credentials not configured properly");
    }
  }

  admin.initializeApp(appOptions);
  console.log("Firebase Admin SDK Initialized.");
}

export const firestoreDb = admin.firestore();

export const app = express();
const port = process.env.PORT || 5001;

const corsOrigins = process.env.NETLIFY
  ? [process.env.URL, "https://synapse-workspace.netlify.app"]
  : ["http://localhost:5174"];

app.use(
  cors({
    origin: corsOrigins as string[],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);
app.use(express.json());

app.use('/users', userRoutes);
app.use('/canvases', canvasRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

let cachedConnection: mongoose.Connection | null = null;

export const connectToDatabase = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }
  
  const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clustercanva0.4bwgyeq.mongodb.net/creative-canvas-db`;
     const connection = await mongoose.connect(mongoURI);
 cachedConnection = connection.connection;
     console.log(" database connection established successfully.");

   return cachedConnection;
};

if (!process.env.NETLIFY) {
  connectToDatabase().then(() => {
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  }).catch(console.error);
}
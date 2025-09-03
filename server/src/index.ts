import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import * as admin from 'firebase-admin';

import userRoutes from './routes/userRoutes';
import canvasRoutes from './routes/canvasRoutes';

import serviceAccount from '../../server/serviceAccountKey.json';

dotenv.config();

if (admin.apps.length === 0) {
  const credential = process.env.FIREBASE_SERVICE_ACCOUNT
    ? admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) // PRODUCTION: Use the env variable
    : admin.credential.cert(serviceAccount as admin.ServiceAccount);      // LOCAL: Use the local file

  admin.initializeApp({ credential });
  console.log('Firebase Admin SDK Initialized.');
}


export const firestoreDb = admin.firestore();

export const app = express();
const port = process.env.PORT || 5001;
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clustercanva0.4bwgyeq.mongodb.net/creative-canvas-db?retryWrites=true&w=majority`;

if (!mongoURI) {
    throw new Error('MONGO_URI not found in .env file.');
}

app.use(cors({ origin: 'http://localhost:5174' }));
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/canvases', canvasRoutes);

const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 0) {
         if (!mongoURI) throw new Error('MONGO_URI not found');
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
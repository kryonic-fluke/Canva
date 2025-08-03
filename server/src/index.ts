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
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
  console.log('Firebase Admin SDK Initialized.');
}

export const firestoreDb = admin.firestore();

const app = express();
const port = process.env.PORT || 5001;
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clustercanva0.4bwgyeq.mongodb.net/creative-canvas-db?retryWrites=true&w=majority`;

if (!mongoURI) {
    throw new Error('MONGO_URI not found in .env file.');
}

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).send({ status: 'OK', message: 'Server is healthy!' });
});

app.use('/api/users', userRoutes);
app.use('/api/canvases', canvasRoutes);

mongoose.connect(mongoURI).then(() => {
  console.log('Successfully connected to MongoDB.');
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}).catch((error) => {
  console.log("Error connecting to database:", error.message);
  process.exit(1);
});
import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from '../src/routes/userRoutes'
import canvasRoutes from './routes/canvasRoutes'
dotenv.config(); 

const app = express();     
const port = process.env.PORT || 5001;  
const router = Router();



const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clustercanva0.4bwgyeq.mongodb.net/creative-canvas-db?retryWrites=true&w=majority`;
if(!mongoURI) throw new Error('not mongo string found');


app.use(cors({
  origin: 'http://localhost:5173'        
}));    

app.use(express.json());         


app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).send({ status: 'OK', message: 'Server is healthy and running!' });     
});

app.use('/api/users',userRoutes)

app.use('/api/canvases',canvasRoutes)






mongoose.connect(mongoURI).then(()=>{
  console.log('Successfully connected to MongoDB.');
  app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);     
})

}).catch((error)=>{
  console.log("error while connecting to database",error.message);
  process.exit(1);
}) 
  




import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();     
const port = process.env.PORT || 5001;  


app.use(cors({

  
  origin: 'http://localhost:5173'        
}));   

app.use(express.json());         


app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).send({ status: 'OK', message: 'Server is healthy and running!' });       //deifned a url path that will return the specified message
});



app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);     //listening for request 
});

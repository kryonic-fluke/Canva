import { Router } from 'express';
import { createOrUpdateUser } from '../controllers/userControl';
import { createCanvas } from '../controllers/canvasControl';


const router = Router();






router.post('/',createCanvas);



export default router;


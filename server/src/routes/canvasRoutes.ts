import { Router } from 'express';

import { createCanvas, getCanvases } from '../controllers/canvasControl';
import { protect } from '../middleware/authMiddleWare';
const router = Router();


router.post('/',protect,createCanvas);

router.get('/',protect,getCanvases)

export default router;


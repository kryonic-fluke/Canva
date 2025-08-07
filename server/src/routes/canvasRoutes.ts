import { Router } from 'express';

import { createCanvas, deleteCanvas, getCanvases } from '../controllers/canvasControl';
import { protect } from '../middleware/authMiddleWare';
const router = Router();


router.post('/',protect,createCanvas);

router.get('/',protect,getCanvases)

router.delete('/:_id', protect,deleteCanvas)

export default router;


import { Router } from 'express';
import { createOrUpdateUser } from '../controllers/userControl';
import { protect } from '../middleware/authMiddleWare';
import { declineRequest } from '../controllers/canvasControl';


const router = Router();


router.post('/',  protect,createOrUpdateUser);
router.post('/:_id/decline-request', protect,declineRequest);


export default router;


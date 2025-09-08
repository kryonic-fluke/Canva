import { Router } from 'express';

import { approveRequest, createCanvas, deleteCanvas, getCanvases, getInviteLink, requestAccess,  } from '../controllers/canvasControl';
import { protect } from '../middleware/authMiddleWare';
const router = Router();


router.post('/',protect,createCanvas);

router.get('/',protect,getCanvases)

router.delete('/:_id', protect,deleteCanvas)
router.get('/:_id/invite-link',protect,getInviteLink)

router.post('/:_id/request-access',protect,requestAccess);
router.post('/:_id/approve-request',protect, approveRequest);


export default router;


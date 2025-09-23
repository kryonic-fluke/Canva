import { Router } from 'express';

import { approveRequest, createCanvas, declineRequest, deleteCanvas, getCanvases, getInviteLink, removeContributor, requestAccess,  } from '../controllers/canvasControl';
import { protect } from '../middleware/authMiddleWare';
import { remove } from 'lodash';
const router = Router();


router.post('/',protect,createCanvas);

router.get('/',protect,getCanvases)

router.delete('/:_id', protect,deleteCanvas)
router.get('/:_id/invite-link',protect,getInviteLink)
router.post('/:_id/decline-request', protect, declineRequest);
router.delete('/:_id/contributors/:userId', protect, removeContributor);
router.post('/:_id/request-access',protect,requestAccess);
router.post('/:_id/approve-request',protect, approveRequest);


export default router;


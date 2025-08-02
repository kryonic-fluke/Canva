import { Router } from 'express';
import { createOrUpdateUser } from '../controllers/userControl';


const router = Router();


router.post('/', createOrUpdateUser);

export default router;


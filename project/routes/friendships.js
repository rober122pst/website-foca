import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import * as friendshipController from '../controllers/friendshipController.js';


router.use(auth);

router.post('/', friendshipController.createFriendship);

export default router;

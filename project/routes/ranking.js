import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import * as rankingController from '../controllers/ranksController.js';


router.use(auth);

router.get('/', rankingController.getRankingGeral);

export default router;

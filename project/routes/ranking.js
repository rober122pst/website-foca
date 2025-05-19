import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import carregarAmigos from '../middlewares/carregarAmigos.js';
import * as rankingController from '../controllers/ranksController.js';


router.use(auth);

router.get('/', rankingController.getRankingGeral);
router.get('/friends', carregarAmigos, rankingController.getRankingFriends);

export default router;

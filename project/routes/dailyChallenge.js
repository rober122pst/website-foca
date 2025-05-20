import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import isAdmin from '../middlewares/isAdmin.js';
import * as challengesController from '../controllers/challengeController.js';


router.use(auth);

router.post('/', isAdmin, challengesController.createChallenge);
router.get('/', challengesController.getChallenge);
router.get('/:id', challengesController.getChallengeById);
router.put('/:id', isAdmin, challengesController.updateChallenge);
router.delete('/:id', isAdmin, challengesController.deleteChallenge);

export default router;

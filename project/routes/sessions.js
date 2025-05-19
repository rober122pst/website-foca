import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import * as sessionController from '../controllers/sessionController.js';


router.use(auth);

router.post('/', sessionController.createSession);
router.get('/', sessionController.getSessions);
router.get('/total-duration', sessionController.sumSessionTime);
router.get('/weekly-durations', sessionController.getWeeklySessions);
router.get('/:id', sessionController.getSessionById);
router.put('/:id', sessionController.updateSession);
router.delete('/:id', sessionController.deleteSession);

export default router;

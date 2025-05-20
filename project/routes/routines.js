import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import * as routineController from '../controllers/routineController.js';


router.use(auth);

router.post('/', routineController.createRoutine);
router.get('/', routineController.getRoutine);
router.get('/today', routineController.getTodayRoutine);
router.get('/:id', routineController.getRoutineById);
router.put('/:id', routineController.updateRoutine);
router.delete('/:id', routineController.deleteRoutine);
router.put('/:id/today', routineController.updateTodayRoutine);

export default router;

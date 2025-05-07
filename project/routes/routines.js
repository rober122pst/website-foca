import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import * as tasksController from '../controllers/tasksController.js';


router.use(auth);

router.post('/', tasksController.createTask);
router.get('/', tasksController.getTasks);
router.get('/:id', tasksController.getTaskById);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

export default router;

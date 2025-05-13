import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import * as userController from '../controllers/userController.js';


router.use(auth);

router.get('/', userController.getUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;

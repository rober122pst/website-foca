import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import * as userController from '../controllers/userController.js';

router.get('/:id', userController.getUserById);

router.get('/', auth, userController.getUser);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);
router.put('/:id/status', auth, userController.updateUserStatus);

export default router;

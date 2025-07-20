import express from 'express';
import { UserRepository } from '../repository/user.respository';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);
const router = express.Router();

router.get('/:id', authenticate, userController.get);
router.put('/:id', authenticate, userController.get);
export default router;

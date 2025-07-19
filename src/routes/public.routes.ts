import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repository/user.respository';

const userRepo = new UserRepository();
const authService = new AuthService(userRepo);
const authController = new AuthController(authService);
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/token/:id', authController.token);

export default router;

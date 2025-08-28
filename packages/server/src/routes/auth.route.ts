import { Router } from 'express';
import authController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/send-otp', authController.sendOTP);
authRouter.post('/verify-otp', authController.verifyOTP);
authRouter.post('/reset-password', authController.resetPassword);

export default authRouter;

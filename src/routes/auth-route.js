import { Router } from 'express';
import {
  LoginValidation,
  ResetPasswordValidation,
} from '../validators/user-validator.js';
import validator from '../middlewares/validator-middleware.js';
import {
  verifiyCode,
  resetPassword,
  verifyResetPassword,
  login,
  logout,
} from '../controllers/auth-controller.js';

const router = Router();
router.get('/verification/:verificationCode', verifiyCode);
router.post(
  '/reset-password',
  ResetPasswordValidation,
  validator,
  resetPassword
);
router.post('/verification-password', verifyResetPassword);
router.post('/', LoginValidation, validator, login);
router.delete('/', logout);

export default router;

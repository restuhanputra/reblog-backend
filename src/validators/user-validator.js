import { check } from 'express-validator';

const name = check('name', 'Name is required').not().isEmpty();
const username = check('username', 'Username is required').not().isEmpty();
const email = check('email')
  .not()
  .isEmpty()
  .withMessage('Email is required')
  .bail()
  .isEmail()
  .withMessage('Please provide a valid email');
const password = check('password', 'Password is required').isLength({ min: 6 });

export const UserValidation = [name, username, email, password];
export const LoginValidation = [username, password];
export const ResetPasswordValidation = [email];

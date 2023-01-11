import { Router } from 'express';
import { UserValidation } from '../validators/user-validator.js';
import validator from '../middlewares/validator-middleware.js';
import {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user-controller.js';

const router = Router();

router.post('/', UserValidation, validator, createUser);
router.get('/', getAllUser);
router.get('/:id', getUserById);
router.patch('/:id', UserValidation, validator, updateUser);
router.delete('/:id', deleteUser);

export default router;

import { Router } from 'express';
import {
  RegisterValidation,
  UpdateValidation,
} from '../validators/user-validator.js';
import validator from '../middlewares/validator-middleware.js';
import {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user-controller';

const router = Router();

router.post('/', RegisterValidation, validator, createUser);
router.get('/', getAllUser);
router.get('/:id', getUserById);
router.patch('/:id', UpdateValidation, validator, updateUser);
router.delete('/:id', deleteUser);

export default router;

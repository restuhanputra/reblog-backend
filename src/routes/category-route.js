import { Router } from 'express';
import { CategoryValidation } from '../validators/category-validator.js';
import validator from '../middlewares/validator-middleware.js';
import {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category-controller.js';

const router = Router();

router.post('/', CategoryValidation, validator, createCategory);
router.get('/', getAllCategory);
router.get('/:id', getCategoryById);
router.patch('/:id', CategoryValidation, validator, updateCategory);
router.delete('/:id', deleteCategory);

export default router;

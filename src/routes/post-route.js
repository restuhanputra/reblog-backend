import { Router } from 'express';
import {
  PostValidation,
  UpdatePostValidation,
} from '../validators/post-validator.js';
import validator from '../middlewares/validator-middleware.js';
import {
  createPost,
  getAllPost,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/post-controller.js';

const router = Router();

router.post('/', PostValidation, validator, createPost);
router.get('/', getAllPost);
router.get('/:id', getPostById);
router.patch('/:id', UpdatePostValidation, validator, updatePost);
router.delete('/:id', deletePost);

export default router;

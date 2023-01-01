import { check } from 'express-validator';

const title = check('title', 'Title is required').not().isEmpty();
const content = check('content', 'Content is required').not().isEmpty();
const image = check('image').custom((value, { req }) => {
  if (!req.files) throw new Error('Image is required');

  return true;
});

export const PostValidation = [title, content, image];
export const UpdatePostValidation = [title, content, image];

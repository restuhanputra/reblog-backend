import { check } from 'express-validator';

const title = check('title', 'Title is required').not().isEmpty();
const content = check('content', 'Content is required').not().isEmpty();
const image = check('image').custom((value, { req }) => {
  if (!req.files) throw new Error('Image is required');
  return true;
});
const categoryId = check('categoryId').custom((value) => {
  // check length array
  if (!value.length) throw new Error('CategoryId is required');

  // check type array
  if (!Array.isArray(value)) throw new Error('CategoryId must be an array');
  return true;
});

export const PostValidation = [title, content, image, categoryId];
export const UpdatePostValidation = [title, content, image, categoryId];

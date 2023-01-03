import { check } from 'express-validator';

const name = check('name', 'Name is required').not().isEmpty();

export const CategoryValidation = [name];

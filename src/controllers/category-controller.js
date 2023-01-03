import Category from '../models/category.js';
import asyncWrapper from '../middlewares/async-middleware.js';
import createError from '../utils/error-util.js';

export const createCategory = asyncWrapper(async (req, res) => {
  await Category.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Category created',
  });
});

export const getAllCategory = asyncWrapper(async (req, res) => {
  const categories = await Category.find().select('-__v');

  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const getCategoryById = asyncWrapper(async (req, res) => {
  const category = await Category.findById(req.params.id).select('-__v');
  if (!category) throw createError(404, 'Category not found');

  res.status(200).json({
    success: true,
    data: category,
  });
});

export const updateCategory = asyncWrapper(async (req, res) => {
  const checkCategory = await Category.findById(req.params.id);
  if (!checkCategory) throw createError(404, 'Category not found');

  await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: 'Category updated',
  });
});

export const deleteCategory = asyncWrapper(async (req, res) => {
  const checkCategory = await Category.findById(req.params.id);
  if (!checkCategory) throw createError(404, 'Category not found');

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Category deleted',
  });
});

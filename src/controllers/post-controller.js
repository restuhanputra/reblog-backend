import path from 'path';
import fs from 'fs';
import slugify from 'slugify';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Post from '../models/post.js';
import asyncWrapper from '../middlewares/async-middleware.js';
import createError from '../utils/error-util.js';
import getUrl from '../utils/url-util.js';

export const createPost = asyncWrapper(async (req, res) => {
  const randomId = crypto.randomBytes(16).toString('hex');
  const file = req.files.image;
  const fileName = `${randomId}${path.extname(file.name)}`;
  console.log('filename: ', fileName);
  const exceptedFileTypes = ['png', 'jpg', 'jpeg'];
  const fileExtension = file.mimetype.split('/').pop();

  if (!exceptedFileTypes.includes(fileExtension))
    throw createError(415, 'Image must be .png, .jpg, or .jpeg');

  if (file.size > 5000000)
    throw createError(422, 'Image must be less than 5MB');

  const uploadPath = `./public/images/${fileName}`;

  file.mv(uploadPath, async (error) => {
    if (error) throw createError(500, error.message);
  });

  let category = req.body.categoryId;
  let objectCategoryIdArray = category.map((s) => mongoose.Types.ObjectId(s));
  req.body.categoryId = objectCategoryIdArray;

  let post = new Post({
    ...req.body,
    image: fileName,
    slug: slugify(req.body.title, { lower: true }),
    urlImage: `${getUrl(req)}/api/v1/images/${fileName}`,
  });
  await post.save();

  res.status(201).json({
    success: true,
    message: 'Post created',
  });
});

export const getAllPost = asyncWrapper(async (req, res) => {
  const posts = await Post.find().select('-__v').populate({
    path: 'categoryId',
    select: '_id, name',
  });

  res.status(200).json({
    success: true,
    data: posts,
  });
});

export const getPostById = asyncWrapper(async (req, res) => {
  const post = await Post.findById(req.params.id).select('-__v').populate({
    path: 'categoryId',
    select: '_id, name',
  });
  if (!post) throw createError(404, 'Post not found');

  res.status(200).json({
    success: true,
    data: post,
  });
});

export const updatePost = asyncWrapper(async (req, res) => {
  const checkPost = await Post.findById(req.params.id);
  if (!checkPost) throw createError(404, 'Post not found');

  let fileName;
  if (!req?.files?.image) {
    fileName = checkPost.image;
  } else {
    const randomId = crypto.randomBytes(16).toString('hex');
    const file = req.files.image;
    fileName = `${randomId}${path.extname(file.name)}`;
    const exceptedFileTypes = ['png', 'jpg', 'jpeg'];
    const fileExtension = file.mimetype.split('/').pop();

    if (!exceptedFileTypes.includes(fileExtension))
      throw createError(415, 'Image must be .png, .jpg, or .jpeg');

    if (file.size > 5000000)
      throw createError(422, 'Image must be less than 5MB');

    const filepath = `./public/images/${checkPost.image}`;
    fs.unlink(filepath, (error) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
    });

    const uploadPath = `./public/images/${fileName}`;
    file.mv(uploadPath, (error) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
    });
  }

  let category = req.body.categoryId;
  if (category) {
    let objectCategoryIdArray = category.map((s) => mongoose.Types.ObjectId(s));
    req.body.categoryId = objectCategoryIdArray;
  }

  let updatePost = {
    ...req.body,
    slug: slugify(req.body.title, { lower: true }),
    image: fileName,
    urlImage: `${getUrl(req)}/api/v1/images/${fileName}`,
  };

  await Post.findByIdAndUpdate(req.params.id, updatePost, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: 'Post updated',
  });
});

export const deletePost = asyncWrapper(async (req, res) => {
  const checkPost = await Post.findById(req.params.id);
  if (!checkPost) throw createError(404, 'Post not found');

  const filepath = `./public/images/${checkPost.image}`;
  fs.unlink(filepath, (error) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
  });

  await Post.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Post deleted',
  });
});

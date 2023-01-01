import dotenv from 'dotenv';
import request from 'supertest';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker/locale/id_ID';
import fs, { stat } from 'fs';
import path from 'path';
import config from '../src/config/index.js';
import app from '../src/app.js';
dotenv.config();

beforeEach(async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe('[POST] /api/v1/posts', () => {
  it('should insert a post', async () => {
    const imageFullPath = path.resolve('tests/testfile/profile.jpg');

    fs.stat(imageFullPath, (err, stats) => {
      if (err) {
        console.log(err);
      }
      // console.log(stats);
    });

    const res = await request(app)
      .post('/api/v1/posts')
      .field('title', faker.lorem.sentence())
      .field('content', faker.lorem.paragraph())
      .attach('image', imageFullPath);

    expect(res.statusCode).toBe(201);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Post created',
      })
    );
  });
});

describe('[GET] /api/v1/posts', () => {
  it('should get all post', async () => {
    const res = await request(app).get('/api/v1/posts');

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.any(Array),
      })
    );
  });
});

describe('[GET] /api/v1/posts/:id', () => {
  it('should get single post', async () => {
    // get all data
    const getPosts = await request(app).get('/api/v1/posts');
    const arrData = getPosts.body.data;

    // get the last id
    let id;
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        id = val._id;
      }
    });

    const res = await request(app).get(`/api/v1/posts/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          _id: expect.any(String),
          title: expect.any(String),
          slug: expect.any(String),
          content: expect.any(String),
          image: expect.any(String),
          urlImage: expect.any(String),
          status: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      })
    );
  });
});

describe('[PATCH] /api/v1/posts/:id', () => {
  it('should update single post', async () => {
    const getPosts = await request(app).get('/api/v1/posts');
    const arrData = getPosts.body.data;

    let id;
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        id = val._id;
      }
    });

    const imageFullPath = path.resolve('tests/testfile/profile-updated.jpg');

    fs.stat(imageFullPath, (err, stats) => {
      if (err) {
        console.log(err);
      }
      // console.log(stats);
    });

    const res = await request(app)
      .patch(`/api/v1/posts/${id}`)
      .field('title', faker.lorem.sentence())
      .field('content', faker.lorem.paragraph())
      .attach('image', imageFullPath);

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Post updated',
      })
    );
  });
});

describe('[DELETE] /api/v1/posts/:id', () => {
  it('should delete post', async () => {
    const getPosts = await request(app).get('/api/v1/posts');
    const arrData = getPosts.body.data;

    let id;
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        id = val._id;
      }
    });

    const res = await request(app).delete(`/api/v1/posts/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Post deleted',
      })
    );
  });
});

describe('Field validation', () => {
  it('should return error when field is empty', async () => {
    const res = await request(app).post('/api/v1/users').send({
      title: '',
      content: '',
      image: '',
    });

    expect(res.statusCode).toBe(400);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        errors: expect.objectContaining({
          name: 'Name is required',
          username: 'Username is required',
          email: 'Email is required',
          password: 'Password is required',
        }),
      })
    );
  });
});

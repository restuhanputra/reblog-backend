import dotenv from 'dotenv';
import request from 'supertest';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker/locale/id_ID';
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

describe('[POST] /api/v1/categories', () => {
  it('should insert a category', async () => {
    console.log('category name: ', faker.name.jobArea());

    const res = await request(app).post('/api/v1/categories').send({
      name: faker.name.jobArea(),
    });

    expect(res.status).toBe(201);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Category created',
      })
    );
  });
});

describe('[GET] /api/v1/categories', () => {
  it('should get all category', async () => {
    const res = await request(app).get('/api/v1/categories');

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

describe('[GET] /api/v1/categories/:id', () => {
  it('should get single category', async () => {
    // get all data
    const getCategories = await request(app).get('/api/v1/categories');
    const arrData = getCategories.body.data;

    // get the last id
    let id;
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        id = val._id;
      }
    });

    const res = await request(app).get(`/api/v1/categories/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      })
    );
  });
});

describe('[PATCH] /api/v1/categories/:id', () => {
  it('should update single category', async () => {
    const getCategories = await request(app).get('/api/v1/categories');
    const arrData = getCategories.body.data;

    let id;
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        id = val._id;
      }
    });

    const res = await request(app).patch(`/api/v1/categories/${id}`).send({
      name: faker.name.jobArea(),
    });

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Category updated',
      })
    );
  });
});

describe('[DELETE] /api/v1/categories/:id', () => {
  it('should delete category', async () => {
    const getCategories = await request(app).get('/api/v1/categories');
    const arrData = getCategories.body.data;

    let id;
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        id = val._id;
      }
    });

    const res = await request(app).delete(`/api/v1/categories/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Category deleted',
      })
    );
  });
});

describe('Field validation', () => {
  it('should return error when field is empty', async () => {
    const res = await request(app).post('/api/v1/categories').send({
      name: '',
    });

    expect(res.statusCode).toBe(400);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        errors: expect.objectContaining({
          name: 'Name is required',
        }),
      })
    );
  });
});

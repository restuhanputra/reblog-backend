import dotenv from 'dotenv';
import request from 'supertest';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker/locale/id_ID';
import config from '../src/config/index.js';
import app from '../src/app.js';
dotenv.config();
let token = '';
beforeEach(async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  //[POST] /api/auth
  const response = await request(app).post('/api/v1/auth').send({
    username: 'jensen.pacocha',
    password: '123456',
  });
  token = response.body.token;
});

afterEach(async () => {
  // [DELETE] /api/auth
  await request(app).delete('/api/v1/auth');

  await mongoose.connection.close();
});

describe('[POST] /api/v1/categories', () => {
  it('should insert a category', async () => {
    const res = await request(app)
      .post('/api/v1/categories')
      .send({
        name: faker.name.jobArea(),
      })
      .set('Authorization', `${token}`);

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
    const res = await request(app)
      .get('/api/v1/categories')
      .set('Authorization', `${token}`);

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
    const getCategories = await request(app)
      .get('/api/v1/categories')
      .set('Authorization', `${token}`);
    const arrData = getCategories.body.data;

    // get the last id
    let id;
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        id = val._id;
      }
    });

    const res = await request(app)
      .get(`/api/v1/categories/${id}`)
      .set('Authorization', `${token}`);

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
    const getCategories = await request(app)
      .get('/api/v1/categories')
      .set('Authorization', `${token}`);
    const arrData = getCategories.body.data;

    let id;
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        id = val._id;
      }
    });

    const res = await request(app)
      .patch(`/api/v1/categories/${id}`)
      .send({
        name: faker.name.jobArea(),
      })
      .set('Authorization', `${token}`);

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
    const getCategories = await request(app)
      .get('/api/v1/categories')
      .set('Authorization', `${token}`);
    const arrData = getCategories.body.data;

    let id;
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        id = val._id;
      }
    });

    const res = await request(app)
      .delete(`/api/v1/categories/${id}`)
      .set('Authorization', `${token}`);

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
    const res = await request(app)
      .post('/api/v1/categories')
      .send({
        name: '',
      })
      .set('Authorization', `${token}`);

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

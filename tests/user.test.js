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

describe('[POST] /api/v1/users', () => {
  it('should insert a user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({
        name: faker.name.fullName(),
        username: faker.internet.userName().toLowerCase(),
        email: faker.internet.email(),
        password: '123456',
      })
      .set('Authorization', `${token}`);

    expect(res.status).toBe(201);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'User created',
      })
    );
  });
});

describe('[GET] /api/v1/users', () => {
  it('should get all user', async () => {
    const res = await request(app)
      .get('/api/v1/users')
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

describe('[GET] /api/v1/users/:id', () => {
  it('should get single user', async () => {
    // get all data
    const getUser = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `${token}`);
    const arrData = getUser.body.data;

    // get the last id
    let id;
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        id = val._id;
      }
    });

    const res = await request(app)
      .get(`/api/v1/users/${id}`)
      .set('Authorization', `${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          role: expect.any(String),
        }),
      })
    );
  });
});

describe('[PATCH] /api/v1/users/:id', () => {
  it('should update single user', async () => {
    const getUser = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `${token}`);
    const arrData = getUser.body.data;

    let id;
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        id = val._id;
      }
    });

    const res = await request(app)
      .patch(`/api/v1/users/${id}`)
      .send({
        name: faker.name.fullName(),
        username: faker.internet.userName().toLowerCase(),
        email: faker.internet.email(),
        password: '12345678',
      })
      .set('Authorization', `${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'User updated',
      })
    );
  });
});

describe('[DELETE] /api/v1/users/:id', () => {
  it('should delete user', async () => {
    const getUser = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `${token}`);
    const arrData = getUser.body.data;

    let id;
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        id = val._id;
      }
    });

    const res = await request(app)
      .delete(`/api/v1/users/${id}`)
      .set('Authorization', `${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'User deleted',
      })
    );
  });
});

describe('Field validation', () => {
  it('should return error when field is empty', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({
        name: '',
        username: '',
        email: '',
        password: '',
      })
      .set('Authorization', `${token}`);

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

describe('Email validation', () => {
  it('should return error when email is not valid', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({
        name: faker.name.fullName(),
        username: faker.internet.userName().toLowerCase(),
        email: 'aaa.co',
        password: faker.internet.password(),
      })
      .set('Authorization', `${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        errors: expect.objectContaining({
          email: 'Please provide a valid email',
        }),
      })
    );
  });
});

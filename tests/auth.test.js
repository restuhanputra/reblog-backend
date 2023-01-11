import dotenv from 'dotenv';
import request from 'supertest';
import mongoose from 'mongoose';
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

describe('[GET] /api/auth/verify/:verificationCode', function () {
  let verificationCode;
  it('should verify new user account', async () => {
    const getUsers = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `${token}`);
    const arrData = getUsers.body.data;

    // get the last verificationCode
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        verificationCode = val.verificationCode;
      }
    });

    if (verificationCode) {
      const res = await request(app).get(
        `/api/v1/auth/verification/${verificationCode}`
      );

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toEqual(
        expect.objectContaining({
          success: true,
          message: 'Account verified',
        })
      );
    }
  });
});

describe('[POST] /api/auth/reset-password', function () {
  it('should get reset password link', async () => {
    const getUsers = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `${token}`);

    const arrData = getUsers.body.data;

    // get the last email
    let email;
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        email = val.email;
      }
    });

    const res = await request(app).post('/api/v1/auth/reset-password').send({
      email: email,
    });

    expect(res.status).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Password reset link sent to your email',
      })
    );
  });
});

describe('[POST] /api/auth/verification-password', function () {
  it('should reset password', async () => {
    const getUsers = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `${token}`);

    const arrData = getUsers.body.data;

    // get the last resetPasswordToken
    let resetPasswordToken;
    arrData.forEach((val, key, arr) => {
      if (Object.is(arr.length - 1, key)) {
        resetPasswordToken = val.resetPasswordToken;
      }
    });

    const res = await request(app)
      .post('/api/v1/auth/verification-password')
      .send({
        resetPasswordToken: resetPasswordToken,
        password: '123456',
      });

    expect(res.status).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual({
      success: true,
      message: 'Password reset successfully',
    });
  });
});

describe('Field validation', () => {
  it('should return error when field is empty', async () => {
    const res = await request(app).post('/api/v1/auth').send({
      username: '',
      password: '',
    });

    expect(res.status).toBe(400);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual({
      success: false,
      errors: expect.objectContaining({
        username: 'Username is required',
        password: 'Password is required',
      }),
    });
  });
});

describe('Email validation', () => {
  it('should return error when email is not valid', async () => {
    const res = await request(app).post('/api/v1/auth/reset-password').send({
      email: 'aaa@a',
    });

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

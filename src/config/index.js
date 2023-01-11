import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  SESSION_SECRET: process.env.SESSION_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  },
  MAILTRAP: {
    HOST: process.env.MAILTRAP_HOST,
    PORT: process.env.MAILTRAP_PORT,
    USER: process.env.MAILTRAP_USER,
    PASSWORD: process.env.MAILTRAP_PASSWORD,
  },
  GMAIL: {
    EMAIL: process.env.GMAIL_EMAIL,
    PASSWORD: process.env.GMAIL_PASSWORD,
  },
};

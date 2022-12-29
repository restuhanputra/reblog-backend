import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  SECRET: process.env.SECRET,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
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

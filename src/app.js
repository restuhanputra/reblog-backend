import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import path from 'path';
import passport from 'passport';
import expressSession from 'express-session';
import { randomBytes } from 'crypto';
import config from './config/index.js';

//custom middleware
import errorHandler from './middlewares/error-middleware.js';
import notFoundHandler from './middlewares/notfound-middleware.js';
import { jwtPassport, verifyUser } from './middlewares/passport-middleware.js';

//routes
import userRoute from './routes/user-route.js';
import postRoute from './routes/post-route.js';
import categoryRoute from './routes/category-route.js';
import authRoute from './routes/auth-route.js';

const app = express();
const pathPublicImages = path.resolve('public/images');
const generateId = randomBytes(16).toString('hex');
const session = expressSession({
  genid: function (req) {
    return generateId;
  },
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    maxAge: 3600000, // 1 hour
    expires: new Date(Date.now() + 3600000),
  },
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session);
app.use(fileUpload());
app.use(passport.initialize(jwtPassport));
app.use(passport.session());

// set static files directory ./public/images
app.use('/api/v1/images', express.static(pathPublicImages));

app.use('/api/v1/users', verifyUser, userRoute);
app.use('/api/v1/posts', verifyUser, postRoute);
app.use('/api/v1/categories', verifyUser, categoryRoute);
app.use('/api/v1/auth', authRoute);

app.use(errorHandler);
app.use(notFoundHandler);

export default app;

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import path from 'path';

//custom middleware
import errorHandler from './middlewares/error-middleware.js';
import notFoundHandler from './middlewares/notfound-middleware.js';

//routes
import userRoute from './routes/user-route.js';
import postRoute from './routes/post-route.js';
import categoryRoute from './routes/category-route.js';

const app = express();
const pathPublicImages = path.resolve('public/images');

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());

// set static files directory ./public/images
app.use('/api/v1/images', express.static(pathPublicImages));

app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);
app.use('/api/v1/categories', categoryRoute);

app.use(errorHandler);
app.use(notFoundHandler);

export default app;

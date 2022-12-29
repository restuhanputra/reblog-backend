import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

//custom middleware
import errorHandler from './middlewares/error-middleware.js';
import notFoundHandler from './middlewares/notfound-middleware.js';

//routes
import userRoute from './routes/user-route.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1/users', userRoute);

app.use(errorHandler);
app.use(notFoundHandler);

export default app;

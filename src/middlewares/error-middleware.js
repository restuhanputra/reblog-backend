import consola from 'consola';
/**
 * @description Middleware to handle errors
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns response
 */
const errorHandler = (err, req, res, next) => {
  consola.warn('status: ', err.status);
  consola.error(err.stack);

  let error = {
    status: err.status || 500,
    message: err.message || 'Internal server error',
  };

  // Mongoose bad ObjectId
  if (err.code && err.code === 11000) {
    error.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    error.status = 400;
  }

  // Mongoose validation error
  if (err.name === 'CastError') {
    error.message = `No item found with id: ${err.value}`;
    error.status = 404;
  }

  return res.status(error.status).json({
    success: false,
    error: error.message,
  });
};

export default errorHandler;

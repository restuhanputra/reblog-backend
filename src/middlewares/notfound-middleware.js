/**
 * @description Not found middleware
 * @param req
 * @param res
 * @param next
 * @returns response
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: `Whoops can't find that!, read the API documentation to find your way back home`,
  });

  next();
};

export default notFoundHandler;

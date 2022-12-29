import { validationResult } from 'express-validator';

/**
 * @description Middleware to validate request
 * @param req
 * @param res
 * @param next
 * @returns response
 */
const validator = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorArray = errors.array();
    let extractedErrors = errorArray.reduce(
      (obj, item) => Object.assign(obj, { [item.param]: item.msg }),
      {}
    );

    return res.status(400).json({
      success: false,
      errors: extractedErrors,
    });
  }
  next();
};

export default validator;

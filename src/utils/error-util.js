/**
 * @description Custom error class to handle API errors
 * @param int status
 * @param string message
 */
class CustomAPIError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * @description Create error
 * @param int status
 * @param string message
 * @returns CustomAPIError
 */
const createError = (status, message) => {
  return new CustomAPIError(status, message);
};

export default createError;

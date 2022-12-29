/**
 * @description Async wrapper for handling errors in async functions
 * @param {*} fn
 * @returns {function} - async function
 */
const asyncWrapper = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default asyncWrapper;

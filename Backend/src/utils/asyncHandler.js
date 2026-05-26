const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// another way to use asyncHandler is =>

/*
const asyncHandler = (fn) => {(req, res) => {}}
const asyncHandler = (fn) => async (fn) => {() => {}}
const asyncHandler = (func) => async (req, res, next) => {
    try {
    await fn(req, res)
    } 
    catch(err) {
      res
      .statusCode(err.code || 500)
      .json({
         success: false,
         message: err.message,
    })
    }};
*/

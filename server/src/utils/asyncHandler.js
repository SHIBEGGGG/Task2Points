// Wraps an async route handler so any thrown error / rejected promise is
// automatically passed to next(err), instead of every controller needing
// its own try/catch. Usage: router.get('/x', asyncHandler(async (req,res) => {...}))
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;

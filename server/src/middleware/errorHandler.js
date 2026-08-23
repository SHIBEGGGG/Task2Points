// Catches anything passed to next(err) - including errors thrown inside
// asyncHandler-wrapped routes - and returns a consistent JSON error shape
// instead of leaking a stack trace to the client.
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'MulterError' || /image/i.test(err.message || '')) {
    return res.status(400).json({ error: err.message });
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Something went wrong' : err.message;

  res.status(status).json({ error: message });
}

module.exports = errorHandler;

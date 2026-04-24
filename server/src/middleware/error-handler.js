export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  if (statusCode === 500) {
    console.error(error);
  }

  const payload = {
    success: false,
    message,
  };

  if (error.details) {
    payload.details = error.details;
  }

  res.status(statusCode).json(payload);
}

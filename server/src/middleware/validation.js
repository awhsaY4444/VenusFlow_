import { ValidationError } from "../utils/errors.js";

/**
 * Middleware to validate request body using Zod schema.
 */
export const validate = (schema) => (req, _res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const errors = error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    next(new ValidationError("Validation failed", errors));
  }
};

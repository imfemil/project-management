import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = errors.array().map((err) => ({
    field: err.path,
    message: err.msg
  }));

  // Send response instead of throwing error
  return res.status(422).json({
    statusCode: 422,
    message: "Validation failed",
    errors: extractedErrors
  });
};

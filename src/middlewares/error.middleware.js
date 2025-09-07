import mongoose from "mongoose";
import { ApiError } from "../utils/api-error.js";

export const errorHandler = (err, req, res, next) => {
  // Log error for debugging in development
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  // Default error object
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    success: false,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  };

  // Handle mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    error.statusCode = 400;
    error.message = "Validation Error";
    error.errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Handle mongoose cast errors (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    error.statusCode = 400;
    error.message = "Invalid ID Format";
    error.errors = [{
      field: err.path,
      message: "Invalid ID format"
    }];
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    error.statusCode = 409;
    error.message = "Duplicate Entry";
    error.errors = [{
      field: Object.keys(err.keyPattern)[0],
      message: `This ${Object.keys(err.keyPattern)[0]} already exists`
    }];
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    error.statusCode = 401;
    error.message = "Invalid or Expired Token";
    error.errors = [{
      field: "token",
      message: err.name === "TokenExpiredError" ? "Token has expired" : "Invalid token"
    }];
  }

  // Handle API errors
  if (err instanceof ApiError) {
    error = {
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
      success: false,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    };
  }

  // Remove null or undefined values
  Object.keys(error).forEach(key => 
    (error[key] === undefined || error[key] === null) && delete error[key]
  );

  // Ensure content type is application/json
  res.setHeader('Content-Type', 'application/json');
  
  // Send JSON response
  return res.status(error.statusCode).json(error);
};

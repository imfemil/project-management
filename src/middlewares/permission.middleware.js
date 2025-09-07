import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { hasPermission, checkMultiplePermissions } from "../utils/permissions.js";

export const checkPermission = (requiredPermission) => {
  return asyncHandler(async (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      throw new ApiError(401, "Unauthorized access");
    }

    if (!hasPermission(userRole, requiredPermission)) {
      throw new ApiError(403, "You don't have permission to perform this action");
    }

    next();
  });
};

export const checkPermissions = (requiredPermissions) => {
  return asyncHandler(async (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      throw new ApiError(401, "Unauthorized access");
    }

    if (!checkMultiplePermissions(userRole, requiredPermissions)) {
      throw new ApiError(403, "You don't have permission to perform this action");
    }

    next();
  });
};

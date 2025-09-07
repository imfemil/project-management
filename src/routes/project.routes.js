import { Router } from "express";
import {
  addMembersToProject,
  createProject,
  deleteMember,
  getProjects,
  getProjectById,
  getProjectMembers,
  updateProject,
  deleteProject,
  updateMemberRole,
} from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createProjectValidator,
  addMembertoProjectValidator,
} from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkPermission, checkPermissions } from "../middlewares/permission.middleware.js";
import { Permissions } from "../utils/permissions.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/")
  .get(checkPermission(Permissions.VIEW_PROJECT), getProjects)
  .post(
    checkPermission(Permissions.CREATE_PROJECT),
    createProjectValidator(),
    validate,
    createProject
  );

router
  .route("/:projectId")
  .get(checkPermission(Permissions.VIEW_PROJECT), getProjectById)
  .put(
    checkPermissions([Permissions.VIEW_PROJECT, Permissions.UPDATE_PROJECT]),
    createProjectValidator(),
    validate,
    updateProject
  )
  .delete(
    checkPermissions([Permissions.VIEW_PROJECT, Permissions.DELETE_PROJECT]),
    deleteProject
  );

router
  .route("/:projectId/members")
  .get(
    checkPermissions([Permissions.VIEW_PROJECT, Permissions.VIEW_USERS]),
    getProjectMembers
  )
  .post(
    checkPermissions([Permissions.VIEW_PROJECT, Permissions.MANAGE_PROJECT_MEMBERS]),
    addMembertoProjectValidator(),
    validate,
    addMembersToProject
  );

router
  .route("/:projectId/members/:userId")
  .put(
    checkPermissions([Permissions.VIEW_PROJECT, Permissions.MANAGE_PROJECT_MEMBERS]),
    updateMemberRole
  )
  .delete(
    checkPermissions([Permissions.VIEW_PROJECT, Permissions.MANAGE_PROJECT_MEMBERS]),
    deleteMember
  );

export default router;

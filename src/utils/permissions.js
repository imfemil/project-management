import { UserRolesEnum } from "./constants.js";

export const Permissions = {
	// Project permissions
	CREATE_PROJECT: "create_project",
	UPDATE_PROJECT: "update_project",
	DELETE_PROJECT: "delete_project",
	VIEW_PROJECT: "view_project",
	MANAGE_PROJECT_MEMBERS: "manage_project_members",

	// Task permissions
	CREATE_TASK: "create_task",
	UPDATE_TASK: "update_task",
	DELETE_TASK: "delete_task",
	VIEW_TASK: "view_task",
	ASSIGN_TASK: "assign_task",

	// Note permissions
	CREATE_NOTE: "create_note",
	UPDATE_NOTE: "update_note",
	DELETE_NOTE: "delete_note",
	VIEW_NOTE: "view_note",

	// User management
	MANAGE_USERS: "manage_users",
	VIEW_USERS: "view_users",
}

export const RolePermissions = {
	[UserRolesEnum.ADMIN]: [...Object.values(Permissions)],
	[UserRolesEnum.PROJECT_ADMIN]: [
		Permissions.VIEW_PROJECT,
		Permissions.UPDATE_PROJECT,
		Permissions.MANAGE_PROJECT_MEMBERS,
		Permissions.CREATE_TASK,
		Permissions.UPDATE_TASK,
		Permissions.DELETE_TASK,
		Permissions.VIEW_TASK,
		Permissions.ASSIGN_TASK,
		Permissions.CREATE_NOTE,
		Permissions.UPDATE_NOTE,
		Permissions.DELETE_NOTE,
		Permissions.VIEW_NOTE,
		Permissions.VIEW_USERS,
	],
	[UserRolesEnum.MEMBER]: [
		Permissions.VIEW_PROJECT,
		Permissions.VIEW_TASK,
		Permissions.UPDATE_TASK,
		Permissions.CREATE_NOTE,
		Permissions.UPDATE_NOTE,
		Permissions.VIEW_NOTE,
		Permissions.VIEW_USERS,
	],
}

export const hasPermission = (userRole, requiredPermission) => {
	const permissions = RolePermissions[userRole] || []
	return permissions.includes(requiredPermission)
}

export const checkMultiplePermissions = (userRole, requiredPermissions) => {
	return requiredPermissions.every((permission) =>
		hasPermission(userRole, permission)
	)
}

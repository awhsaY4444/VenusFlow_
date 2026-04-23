import express from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { AppError } from "../utils/errors.js";
import { requireRole } from "../middleware/rbac.js";
import { validate } from "../middleware/validation.js";
import { TaskSchema } from "../utils/schemas.js";
import {
  addTaskComment,
  createTask,
  deleteTask,
  getTaskById,
  listTaskAudit,
  listTaskComments,
  listTasks,
  restoreTask,
  updateTask,
} from "../services/task.service.js";

export const tasksRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management APIs
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
tasksRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const tasks = await listTasks({
      userId: req.user.id,
      role: req.user.role,
      status: req.query.status,
      priority: req.query.priority,
      assigneeId: req.query.assigneeId,
      creatorId: req.query.creatorId,
      includeDeleted: req.query.includeDeleted === "true",
      search: req.query.search,
    });

    res.json({ success: true, tasks });
  })
);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
tasksRouter.get(
  "/:taskId",
  asyncHandler(async (req, res) => {
    const task = await getTaskById({
      taskId: req.params.taskId,
      userId: req.user.id,
      role: req.user.role,
    });

    res.json({ success: true, task });
  })
);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
tasksRouter.post(
  "/",
  validate(TaskSchema),
  asyncHandler(async (req, res) => {
    const task = await createTask({
      organizationId: req.user.organizationId,
      actorId: req.user.id,
      role: req.user.role,
      ...req.body,
    });

    res.status(201).json({ success: true, task });
  })
);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
tasksRouter.put(
  "/:taskId",
  validate(TaskSchema.partial()),
  asyncHandler(async (req, res) => {
    const task = await updateTask({
      organizationId: req.user.organizationId,
      taskId: req.params.taskId,
      actorId: req.user.id,
      role: req.user.role,
      ...req.body,
    });

    res.json({ success: true, task });
  })
);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
tasksRouter.delete(
  "/:taskId",
  asyncHandler(async (req, res) => {
    const result = await deleteTask({
      taskId: req.params.taskId,
      actorId: req.user.id,
      role: req.user.role,
    });

    res.json(result);
  })
);

/**
 * @swagger
 * /api/tasks/{taskId}/restore:
 *   post:
 *     summary: Restore deleted task (Admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
tasksRouter.post(
  "/:taskId/restore",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const result = await restoreTask({
      taskId: req.params.taskId,
      actorId: req.user.id,
    });

    res.json(result);
  })
);

/**
 * @swagger
 * /api/tasks/{taskId}/audit:
 *   get:
 *     summary: Get task audit logs
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
tasksRouter.get(
  "/:taskId/audit",
  asyncHandler(async (req, res) => {
    const audit = await listTaskAudit({
      taskId: req.params.taskId,
      userId: req.user.id,
      role: req.user.role,
    });

    res.json({ success: true, audit });
  })
);

/**
 * @swagger
 * /api/tasks/{taskId}/comments:
 *   get:
 *     summary: Get task comments
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
tasksRouter.get(
  "/:taskId/comments",
  asyncHandler(async (req, res) => {
    const comments = await listTaskComments({
      taskId: req.params.taskId,
      userId: req.user.id,
      role: req.user.role,
    });

    res.json({ success: true, comments });
  })
);

/**
 * @swagger
 * /api/tasks/{taskId}/comments:
 *   post:
 *     summary: Add comment to task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 */
tasksRouter.post(
  "/:taskId/comments",
  asyncHandler(async (req, res) => {
    if (!req.body.body) {
      throw new AppError(400, "Comment body is required");
    }

    const comment = await addTaskComment({
      taskId: req.params.taskId,
      userId: req.user.id,
      role: req.user.role,
      body: req.body.body,
    });

    res.status(201).json({ success: true, comment });
  })
);
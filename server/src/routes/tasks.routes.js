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


tasksRouter.put(
  "/:taskId",
  validate(TaskSchema.partial()), // Partial for updates
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


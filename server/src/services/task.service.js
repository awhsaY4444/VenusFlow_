import { withTransaction, tenantQuery } from "../db.js";
import { AppError, NotFoundError, ForbiddenError } from "../utils/errors.js";
import { logTaskAction } from "./audit.service.js";
import { createNotification } from "./notification.service.js";

function sanitizeTask(task) {
  return {
    id: task.id,
    organizationId: task.organization_id,
    creatorId: task.creator_id,
    assigneeId: task.assignee_id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.due_date,
    deletedAt: task.deleted_at,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
    creatorName: task.creator_name,
    assigneeName: task.assignee_name,
  };
}


async function fetchTask(client, { taskId }) {
  const result = await tenantQuery(
    client,
    `SELECT t.*,
            creator.name AS creator_name,
            assignee.name AS assignee_name
     FROM tasks t
     JOIN users creator ON creator.id = t.creator_id
     LEFT JOIN users assignee ON assignee.id = t.assignee_id
     WHERE t.id = $1`,
    [taskId]
  );

  return result.rows[0];
}

export async function listTasks({
  userId,
  role,
  status,
  priority,
  assigneeId,
  creatorId,
  includeDeleted,
  search,
}) {
  return withTransaction(async (client) => {
    const values = [];
    const filters = [];

    // Tenant filter is automatically injected by tenantQuery

    if (!includeDeleted) {
      filters.push("t.deleted_at IS NULL");
    }

    if (role === "member") {
      values.push(userId);
      filters.push(`(t.creator_id = $${values.length} OR t.assignee_id = $${values.length})`);
    }

    if (status) {
      values.push(status);
      filters.push(`t.status = $${values.length}`);
    }

    if (priority) {
      values.push(priority);
      filters.push(`t.priority = $${values.length}`);
    }

    if (assigneeId) {
      values.push(assigneeId);
      filters.push(`t.assignee_id = $${values.length}`);
    }

    if (creatorId) {
      values.push(creatorId);
      filters.push(`t.creator_id = $${values.length}`);
    }

    if (search) {
      values.push(`%${search}%`);
      filters.push(`(t.title ILIKE $${values.length} OR t.description ILIKE $${values.length})`);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

    const result = await tenantQuery(
      client,
      `SELECT t.*,
              creator.name AS creator_name,
              assignee.name AS assignee_name
       FROM tasks t
       JOIN users creator ON creator.id = t.creator_id
       LEFT JOIN users assignee ON assignee.id = t.assignee_id
       ${whereClause}
       ORDER BY
         CASE t.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
         t.created_at DESC`,
      values
    );

    return result.rows.map(sanitizeTask);
  });
}

export async function getTaskById({ taskId, userId, role }) {
  return withTransaction(async (client) => {
    const task = await fetchTask(client, { taskId });

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    if (role === "member" && task.creator_id !== userId && task.assignee_id !== userId) {
      throw new ForbiddenError("You do not have access to this task");
    }

    return sanitizeTask(task);
  });
}

export async function createTask({
  organizationId,
  actorId,
  role,
  title,
  description,
  status,
  priority,
  dueDate,
  assigneeId,
}) {
  return withTransaction(async (client) => {
    // Note: tenantQuery is more for SELECTs, for INSERTs we still explicitly 
    // set organizationId to ensure data integrity during creation.
    
    if (role === "member" && assigneeId && assigneeId !== actorId) {
      throw new ForbiddenError("Members can only assign tasks to themselves");
    }

    if (assigneeId) {
      const assigneeResult = await client.query(
        "SELECT id FROM users WHERE id = $1 AND organization_id = $2",
        [assigneeId, organizationId]
      );

      if (!assigneeResult.rows[0]) {
        throw new AppError(400, "Assignee must belong to your organization");
      }
    }

    const result = await client.query(
      `INSERT INTO tasks (
          organization_id, creator_id, assignee_id, title, description, status, priority, due_date
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        organizationId,
        actorId,
        assigneeId || actorId,
        title,
        description || "",
        status || "todo",
        priority || "medium",
        dueDate || null,
      ]
    );

    const task = result.rows[0];

    // Point 3: Audit Log improvements
    await logTaskAction(client, {
      organizationId,
      taskId: task.id,
      actorId,
      action: "created",
      changes: {
        before: null,
        after: {
          title: task.title,
          status: task.status,
          priority: task.priority,
          assigneeId: task.assignee_id
        },
      },
    });

    // Point 6: Trigger assignment notification
    if (task.assignee_id && task.assignee_id !== actorId) {
      await createNotification({
        organization_id: organizationId,
        user_id: task.assignee_id,
        type: "TASK_ASSIGNED",
        data: { taskId: task.id, title: task.title, actorName: "Someone" },
      }).catch(err => console.error("Notification failed", err));
    }



    const hydratedTask = await fetchTask(client, { taskId: task.id });
    return sanitizeTask(hydratedTask);
  });
}

export async function updateTask({
  organizationId,
  taskId,
  actorId,
  role,
  title,
  description,
  status,
  priority,
  dueDate,
  assigneeId,
}) {
  return withTransaction(async (client) => {
    const existingTask = await fetchTask(client, { taskId });

    if (!existingTask || existingTask.deleted_at) {
      throw new NotFoundError("Task not found");
    }

    if (role === "member" && existingTask.creator_id !== actorId) {
      throw new ForbiddenError("Members can only edit tasks they created");
    }

    if (role === "member" && assigneeId && assigneeId !== actorId) {
      throw new ForbiddenError("Members can only assign tasks to themselves");
    }

    if (assigneeId) {
      const assigneeResult = await client.query(
        "SELECT id FROM users WHERE id = $1 AND organization_id = $2",
        [assigneeId, organizationId]
      );

      if (!assigneeResult.rows[0]) {
        throw new AppError(400, "Assignee must belong to your organization");
      }
    }

    const updatedValues = {
      title: title ?? existingTask.title,
      description: description ?? existingTask.description,
      status: status ?? existingTask.status,
      priority: priority ?? existingTask.priority,
      dueDate: dueDate === undefined ? existingTask.due_date : dueDate,
      assigneeId: assigneeId === undefined ? existingTask.assignee_id : assigneeId,
    };

    await client.query(
      `UPDATE tasks
       SET title = $3,
           description = $4,
           status = $5,
           priority = $6,
           due_date = $7,
           assignee_id = $8,
           updated_at = NOW()
       WHERE id = $1 AND organization_id = $2`,
      [
        taskId,
        organizationId,
        updatedValues.title,
        updatedValues.description,
        updatedValues.status,
        updatedValues.priority,
        updatedValues.dueDate,
        updatedValues.assigneeId,
      ]
    );

    // Point 3: Audit Log with Before/After state
    await logTaskAction(client, {
      organizationId,
      taskId,
      actorId,
      action: "updated",
      changes: {
        before: {
          title: existingTask.title,
          description: existingTask.description,
          status: existingTask.status,
          priority: existingTask.priority,
          dueDate: existingTask.due_date,
          assigneeId: existingTask.assignee_id,
        },
        after: updatedValues,
      },
    });

    // Point 6: Trigger reassignment notification
    if (updatedValues.assigneeId && updatedValues.assigneeId !== existingTask.assignee_id && updatedValues.assigneeId !== actorId) {
      await createNotification({
        organization_id: organizationId,
        user_id: updatedValues.assigneeId,
        type: "TASK_ASSIGNED",
        data: { taskId, title: updatedValues.title, actorName: "Someone" },
      }).catch(err => console.error("Notification failed", err));
    }

    // Trigger status change notification
    if (updatedValues.status !== existingTask.status && existingTask.creator_id !== actorId) {
       await createNotification({
        organization_id: organizationId,
        user_id: existingTask.creator_id,
        type: "TASK_STATUS_CHANGED",
        data: { taskId, title: updatedValues.title, status: updatedValues.status },
      }).catch(err => console.error("Notification failed", err));
    }


    const updatedTask = await fetchTask(client, { taskId });
    return sanitizeTask(updatedTask);
  });
}


export async function deleteTask({ taskId, actorId, role }) {
  return withTransaction(async (client) => {
    const task = await fetchTask(client, { taskId });

    if (!task || task.deleted_at) {
      throw new NotFoundError("Task not found");
    }

    if (role === "member" && task.creator_id !== actorId) {
      throw new ForbiddenError("Members can only delete tasks they created");
    }

    await client.query(
      `UPDATE tasks
       SET deleted_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [taskId]
    );

    await logTaskAction(client, {
      organizationId: task.organization_id,
      taskId,
      actorId,
      action: "deleted",
      changes: { 
        before: { title: task.title },
        after: { deletedAt: new Date().toISOString() } 
      },
    });

    return { success: true };
  });
}

export async function restoreTask({ taskId, actorId }) {
  return withTransaction(async (client) => {
    const task = await fetchTask(client, { taskId });

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    await client.query(
      `UPDATE tasks
       SET deleted_at = NULL, updated_at = NOW()
       WHERE id = $1`,
      [taskId]
    );

    await logTaskAction(client, {
      organizationId: task.organization_id,
      taskId,
      actorId,
      action: "restored",
      changes: {
        before: { deletedAt: task.deleted_at },
        after: { deletedAt: null }
      },
    });

    return { success: true };
  });
}

export async function listTaskAudit({ taskId, userId, role }) {
  await getTaskById({ taskId, userId, role });

  return withTransaction(async (client) => {
    const result = await tenantQuery(
      client,
      `SELECT l.id, l.action, l.changes, l.created_at, u.name AS actor_name
       FROM task_audit_logs l
       LEFT JOIN users u ON u.id = l.actor_id
       WHERE l.task_id = $1
       ORDER BY l.created_at DESC`,
      [taskId]
    );

    return result.rows.map((log) => ({
      id: log.id,
      action: log.action,
      changes: log.changes,
      actorName: log.actor_name || "Unknown user",
      createdAt: log.created_at,
    }));
  });
}

export async function listTaskComments({ taskId, userId, role }) {
  await getTaskById({ taskId, userId, role });

  return withTransaction(async (client) => {
    const result = await tenantQuery(
      client,
      `SELECT c.id, c.body, c.created_at, u.name AS author_name
       FROM task_comments c
       JOIN users u ON u.id = c.author_id
       WHERE c.task_id = $1
       ORDER BY c.created_at DESC`,
      [taskId]
    );

    return result.rows.map((comment) => ({
      id: comment.id,
      body: comment.body,
      authorName: comment.author_name,
      createdAt: comment.created_at,
    }));
  });
}

export async function addTaskComment({
  taskId,
  userId,
  role,
  body,
}) {
  const task = await getTaskById({ taskId, userId, role });

  return withTransaction(async (client) => {
    const result = await client.query(
      `INSERT INTO task_comments (organization_id, task_id, author_id, body)
       VALUES ($1, $2, $3, $4)
       RETURNING id, body, created_at`,
      [task.organizationId, taskId, userId, body]
    );

    await logTaskAction(client, {
      organizationId: task.organizationId,
      taskId,
      actorId: userId,
      action: "commented",
      changes: { 
        before: null,
        after: { body } 
      },
    });

    return {
      id: result.rows[0].id,
      body: result.rows[0].body,
      createdAt: result.rows[0].created_at,
    };
  });
}

export async function deleteTaskComment({ taskId, commentId, userId, role }) {
  // Verify the task is accessible
  const task = await getTaskById({ taskId, userId, role });

  return withTransaction(async (client) => {
    const commentResult = await client.query(
      `SELECT id, author_id FROM task_comments WHERE id = $1 AND task_id = $2`,
      [commentId, taskId]
    );

    const comment = commentResult.rows[0];

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    // Members can only delete their own comments; admins can delete any
    if (role === "member" && comment.author_id !== userId) {
      throw new ForbiddenError("You can only delete your own comments");
    }

    await client.query(`DELETE FROM task_comments WHERE id = $1`, [commentId]);

    await logTaskAction(client, {
      organizationId: task.organizationId,
      taskId,
      actorId: userId,
      action: "deleted comment",
      changes: { before: { commentId }, after: null },
    });

    return { success: true };
  });
}


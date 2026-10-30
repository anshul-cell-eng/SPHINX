import { Router } from "express";
import { z } from "zod";
import { ApiResponseHelper } from "../lib/api-response.js";
import { memoryStore, type TaskRecord } from "../lib/memory-store.js";
import { authenticate } from "../middleware/auth.middleware.js";

export const tasksRouter = Router();

tasksRouter.use(authenticate);

const createTaskSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(2),
  description: z.string().optional().default(""),
  status: z.enum(["BACKLOG", "IN_PROGRESS", "IN_REVIEW", "DONE"]).default("BACKLOG"),
  priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]).default("HIGH"),
  dueDate: z.string().min(1),
  estimatedHours: z.number().positive().default(8),
});

// GET /api/v1/tasks
tasksRouter.get("/", (req, res) => {
  const workspaceId = req.user!.workspaceId;
  const { projectId } = req.query;

  let tasks = memoryStore.tasks.filter((t) => t.workspaceId === workspaceId);
  if (projectId) {
    tasks = tasks.filter((t) => t.projectId === projectId);
  }

  ApiResponseHelper.success(res, "Tasks retrieved", tasks);
});

// POST /api/v1/tasks
tasksRouter.post("/", (req, res) => {
  const parse = createTaskSchema.safeParse(req.body);
  if (!parse.success) {
    ApiResponseHelper.error(res, "Validation error", "VALIDATION_ERROR", 400, parse.error.issues);
    return;
  }

  const workspaceId = req.user!.workspaceId;
  const newTask: TaskRecord = {
    id: `tsk-${Date.now()}`,
    workspaceId,
    ...parse.data,
    assignee: req.user!.email,
    loggedHours: 0,
  };

  memoryStore.tasks.push(newTask);

  // Recalculate project progress
  const projectTasks = memoryStore.tasks.filter((t) => t.projectId === newTask.projectId);
  const doneCount = projectTasks.filter((t) => t.status === "DONE").length;
  const progress = Math.round((doneCount / projectTasks.length) * 100);

  const proj = memoryStore.projects.find((p) => p.id === newTask.projectId);
  if (proj) {
    proj.tasksCount = projectTasks.length;
    proj.completedTasksCount = doneCount;
    proj.progress = progress;
  }

  ApiResponseHelper.success(res, "Task created", newTask, 201);
});

// PATCH /api/v1/tasks/:id/status
tasksRouter.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const workspaceId = req.user!.workspaceId;

  if (!["BACKLOG", "IN_PROGRESS", "IN_REVIEW", "DONE"].includes(status)) {
    ApiResponseHelper.error(res, "Invalid status", "BAD_REQUEST", 400);
    return;
  }

  const task = memoryStore.tasks.find((t) => t.id === id);
  if (!task || task.workspaceId !== workspaceId) {
    ApiResponseHelper.error(res, "Task not found", "NOT_FOUND", 404);
    return;
  }

  task.status = status;

  // Recalculate project progress
  const projectTasks = memoryStore.tasks.filter((t) => t.projectId === task.projectId);
  const doneCount = projectTasks.filter((t) => t.status === "DONE").length;
  const progress = Math.round((doneCount / projectTasks.length) * 100);

  const proj = memoryStore.projects.find((p) => p.id === task.projectId);
  if (proj) {
    proj.completedTasksCount = doneCount;
    proj.progress = progress;
    if (progress === 100) proj.status = "COMPLETED";
  }

  ApiResponseHelper.success(res, "Task status updated", task);
});

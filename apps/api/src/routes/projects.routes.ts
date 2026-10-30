import { Router } from "express";
import { z } from "zod";
import { ApiResponseHelper } from "../lib/api-response.js";
import { memoryStore, type ProjectRecord } from "../lib/memory-store.js";
import { persistEntity, removeEntity } from "../lib/persistence.js";
import { authenticate } from "../middleware/auth.middleware.js";

export const projectsRouter = Router();

projectsRouter.use(authenticate);

const createProjectSchema = z.object({
  title: z.string().min(2),
  clientId: z.string().min(1),
  clientName: z.string().min(1),
  description: z.string().optional().default(""),
  budget: z.number().positive(),
  deadline: z.string().min(1),
  priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]).default("HIGH"),
  tags: z.array(z.string()).optional().default(["React", "SaaS"]),
});

// GET /api/v1/projects
projectsRouter.get("/", (req, res) => {
  const workspaceId = req.user!.workspaceId;
  const projects = memoryStore.projects.filter((p) => p.workspaceId === workspaceId);
  ApiResponseHelper.success(res, "Projects retrieved", projects);
});

// GET /api/v1/projects/:id
projectsRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const workspaceId = req.user!.workspaceId;

  const project = memoryStore.projects.find((p) => p.id === id);
  if (!project) {
    ApiResponseHelper.error(res, "Project not found", "NOT_FOUND", 404);
    return;
  }

  if (project.workspaceId !== workspaceId) {
    ApiResponseHelper.error(res, "Forbidden", "FORBIDDEN", 403);
    return;
  }

  ApiResponseHelper.success(res, "Project retrieved", project);
});

// POST /api/v1/projects
projectsRouter.post("/", async (req, res) => {
  const parse = createProjectSchema.safeParse(req.body);
  if (!parse.success) {
    ApiResponseHelper.error(res, "Validation error", "VALIDATION_ERROR", 400, parse.error.issues);
    return;
  }

  const workspaceId = req.user!.workspaceId;
  const newProject: ProjectRecord = {
    id: `proj-${Date.now()}`,
    workspaceId,
    ...parse.data,
    status: "IN_PROGRESS",
    spent: 0,
    progress: 0,
    tasksCount: 0,
    completedTasksCount: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };

  memoryStore.projects.unshift(newProject);
  await persistEntity("project", newProject);
  ApiResponseHelper.success(res, "Project created successfully", newProject, 201);
});

// PATCH /api/v1/projects/:id
projectsRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const workspaceId = req.user!.workspaceId;

  const index = memoryStore.projects.findIndex((p) => p.id === id);
  if (index === -1) {
    ApiResponseHelper.error(res, "Project not found", "NOT_FOUND", 404);
    return;
  }

  if (memoryStore.projects[index].workspaceId !== workspaceId) {
    ApiResponseHelper.error(res, "Forbidden", "FORBIDDEN", 403);
    return;
  }

  memoryStore.projects[index] = { ...memoryStore.projects[index], ...req.body };
  await persistEntity("project", memoryStore.projects[index]);
  ApiResponseHelper.success(res, "Project updated", memoryStore.projects[index]);
});

// DELETE /api/v1/projects/:id
projectsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const workspaceId = req.user!.workspaceId;

  const project = memoryStore.projects.find((p) => p.id === id);
  if (!project || project.workspaceId !== workspaceId) {
    ApiResponseHelper.error(res, "Forbidden or not found", "FORBIDDEN", 403);
    return;
  }

  memoryStore.projects = memoryStore.projects.filter((p) => p.id !== id);
  memoryStore.tasks = memoryStore.tasks.filter((t) => t.projectId !== id);
  await removeEntity("project", id);
  ApiResponseHelper.success(res, "Project deleted", { id });
});

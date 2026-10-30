import { useState } from "react";
import { useFreelanceStore, freelanceStore } from "../lib/freelance-store";
import type { TaskStatus } from "../types/freelanceos";
import {
  FolderKanban,
  Plus,
  Clock,
  Calendar,
  Layers,
  X,
  User,
} from "lucide-react";

const KANBAN_COLUMNS: { id: TaskStatus; label: string; badge: string }[] = [
  { id: "BACKLOG", label: "Backlog", badge: "bg-[#22231F] text-[#A5A397] border border-[#2E302B]" },
  { id: "IN_PROGRESS", label: "In Progress", badge: "bg-[#B86A43]/15 text-[#B86A43] border border-[#B86A43]/30" },
  { id: "IN_REVIEW", label: "In Review", badge: "bg-[#E6A15C]/15 text-[#E6A15C] border border-[#E6A15C]/30" },
  { id: "DONE", label: "Completed", badge: "bg-[#4E8752]/15 text-[#4E8752] border border-[#4E8752]/30" },
];

export function ProjectsPage() {
  const state = useFreelanceStore();
  const [activeProjectFilter, setActiveProjectFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"KANBAN" | "GRID">("KANBAN");
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // New task form state
  const [taskForm, setTaskForm] = useState({
    projectId: state.projects[0]?.id || "",
    title: "",
    description: "",
    priority: "HIGH" as const,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    estimatedHours: 8,
  });

  // New project form state
  const [projectForm, setProjectForm] = useState({
    title: "",
    clientId: state.clients[0]?.id || "",
    description: "",
    budget: 85000,
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    priority: "HIGH" as const,
    tags: "React, WebGL, Design",
  });

  const filteredTasks = state.tasks.filter((t) =>
    activeProjectFilter === "ALL" ? true : t.projectId === activeProjectFilter
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    freelanceStore.addTask({
      projectId: taskForm.projectId,
      title: taskForm.title,
      description: taskForm.description,
      status: "BACKLOG",
      priority: taskForm.priority,
      assignee: state.profile.name,
      dueDate: taskForm.dueDate,
      estimatedHours: Number(taskForm.estimatedHours),
    });
    setIsNewTaskModalOpen(false);
    setTaskForm({
      projectId: state.projects[0]?.id || "",
      title: "",
      description: "",
      priority: "HIGH",
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      estimatedHours: 8,
    });
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const client = state.clients.find((c) => c.id === projectForm.clientId) || state.clients[0];
    freelanceStore.addProject({
      title: projectForm.title,
      clientId: client.id,
      clientName: client.company,
      description: projectForm.description,
      status: "IN_PROGRESS",
      priority: projectForm.priority,
      budget: Number(projectForm.budget),
      deadline: projectForm.deadline,
      tags: projectForm.tags.split(",").map((t) => t.trim()),
    });
    setIsNewProjectModalOpen(false);
    setProjectForm({
      title: "",
      clientId: state.clients[0]?.id || "",
      description: "",
      budget: 85000,
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      priority: "HIGH",
      tags: "React, WebGL, Design",
    });
  };

  const cycleStatus = (taskId: string, current: TaskStatus) => {
    const sequence: TaskStatus[] = ["BACKLOG", "IN_PROGRESS", "IN_REVIEW", "DONE"];
    const nextIdx = (sequence.indexOf(current) + 1) % sequence.length;
    freelanceStore.updateTaskStatus(taskId, sequence[nextIdx]);
  };

  const currencySymbol = state.currency === "INR" ? "₹" : state.currency === "USD" ? "$" : "€";

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2E302B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F2EFE7] font-sans">
            Project Deliverables & Kanban Sprints
          </h1>
          <p className="text-xs text-[#A5A397] mt-0.5">
            Structured delivery pipelines, milestone checkpoints, and real-time execution across client accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#2E302B] bg-[#191A17] hover:bg-[#22231F] text-[#F2EFE7] text-xs font-medium transition-colors"
          >
            <FolderKanban className="h-3.5 w-3.5 text-[#B86A43]" />
            <span>New Project</span>
          </button>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] text-xs font-medium shadow-subtle border border-[#C87C55]/30 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Project selector tabs & view toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Project horizontal filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveProjectFilter("ALL")}
            className={`px-3 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors ${
              activeProjectFilter === "ALL"
                ? "bg-[#22231F] text-[#F2EFE7] font-semibold border border-[#2E302B]"
                : "bg-[#191A17] border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7]"
            }`}
          >
            All Projects ({state.projects.length})
          </button>
          {state.projects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => setActiveProjectFilter(proj.id)}
              className={`px-3 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors ${
                activeProjectFilter === proj.id
                  ? "bg-[#22231F] text-[#F2EFE7] font-semibold border border-[#2E302B]"
                  : "bg-[#191A17] border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7]"
              }`}
            >
              {proj.title} ({proj.progress}%)
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 rounded border border-[#2E302B] bg-[#191A17] p-0.5 text-xs font-mono">
          <button
            onClick={() => setViewMode("KANBAN")}
            className={`px-2.5 py-0.5 rounded transition-colors ${
              viewMode === "KANBAN"
                ? "bg-[#22231F] text-[#F2EFE7] font-bold border border-[#2E302B]"
                : "text-[#A5A397] hover:text-[#F2EFE7]"
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode("GRID")}
            className={`px-2.5 py-0.5 rounded transition-colors ${
              viewMode === "GRID"
                ? "bg-[#22231F] text-[#F2EFE7] font-bold border border-[#2E302B]"
                : "text-[#A5A397] hover:text-[#F2EFE7]"
            }`}
          >
            Project List
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* KANBAN BOARD VIEW                                              */}
      {/* ============================================================== */}
      {viewMode === "KANBAN" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {KANBAN_COLUMNS.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="rounded-md border border-[#2E302B] bg-[#191A17] p-3.5 flex flex-col min-h-[480px] shadow-subtle"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#2E302B] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-[#F2EFE7] tracking-wider uppercase">
                      {col.label}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${col.badge}`}>
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsNewTaskModalOpen(true)}
                    className="p-1 rounded text-[#77766D] hover:text-[#F2EFE7] hover:bg-[#22231F]"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Task Cards Stack */}
                <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
                  {columnTasks.map((task) => {
                    const project = state.projects.find((p) => p.id === task.projectId);

                    return (
                      <div
                        key={task.id}
                        className="rounded border border-[#2E302B] bg-[#22231F] p-3 hover:border-[#3D3F38] transition-all cursor-pointer group"
                        onClick={() => cycleStatus(task.id, task.status)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#191A17] text-[#A5A397] border border-[#2E302B] truncate max-w-[130px]">
                            {project?.title || "Sprint"}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                              task.priority === "URGENT"
                                ? "text-[#C95A53] bg-[#C95A53]/10 border border-[#C95A53]/30"
                                : task.priority === "HIGH"
                                ? "text-[#E6A15C] bg-[#E6A15C]/10 border border-[#E6A15C]/30"
                                : "text-[#77766D] bg-[#191A17] border border-[#2E302B]"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold text-[#F2EFE7] leading-snug group-hover:text-[#B86A43] transition-colors">
                          {task.title}
                        </h4>
                        <p className="text-[11px] text-[#A5A397] line-clamp-2 mt-1">
                          {task.description}
                        </p>

                        <div className="mt-3 pt-2 border-t border-[#2E302B] flex items-center justify-between text-[10px] font-mono text-[#77766D]">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{task.estimatedHours}h est</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-md border border-[#2E302B] bg-[#191A17] p-5 shadow-card space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#F2EFE7]">{proj.title}</h3>
                  <p className="text-xs text-[#A5A397]">{proj.clientName}</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#F2EFE7]">
                  {currencySymbol}{proj.budget.toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-[#A5A397] line-clamp-2">
                {proj.description}
              </p>

              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A5A397] mb-1">
                  <span>Sprint Completion</span>
                  <span className="text-[#F2EFE7]">{proj.progress}%</span>
                </div>
                <div className="w-full bg-[#111210] rounded-sm h-1.5 overflow-hidden">
                  <div
                    className="bg-[#B86A43] h-1.5 rounded-sm"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.tags.map((tg, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#22231F] border border-[#2E302B] text-[#A5A397]"
                  >
                    {tg}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-[#2E302B] flex items-center justify-between text-[11px] font-mono text-[#77766D]">
                <span>{proj.completedTasksCount} / {proj.tasksCount} tasks</span>
                <span>Deadline: {proj.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* NEW TASK MODAL                                                 */}
      {/* ============================================================== */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-md border border-[#2E302B] bg-[#191A17] p-5 shadow-elevated space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#2E302B]">
              <h3 className="text-sm font-bold text-[#F2EFE7]">Add Kanban Deliverable</h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="p-1 rounded border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#A5A397] mb-1">
                  Target Project Sprint
                </label>
                <select
                  value={taskForm.projectId}
                  onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
                  className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                >
                  {state.projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#191A17]">
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A5A397] mb-1">
                  Deliverable Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement WebGL Shader Material"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A5A397] mb-1">
                  Scope Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Technical acceptance criteria and deliverables..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  >
                    <option value="LOW" className="bg-[#191A17]">Low</option>
                    <option value="MEDIUM" className="bg-[#191A17]">Medium</option>
                    <option value="HIGH" className="bg-[#191A17]">High</option>
                    <option value="URGENT" className="bg-[#191A17]">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">Hours Est.</label>
                  <input
                    type="number"
                    value={taskForm.estimatedHours}
                    onChange={(e) => setTaskForm({ ...taskForm, estimatedHours: Number(e.target.value) })}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">Target Date</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#2E302B] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[#2E302B] text-xs font-medium text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] text-xs font-medium border border-[#C87C55]/30 shadow-subtle transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* NEW PROJECT MODAL                                              */}
      {/* ============================================================== */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-md border border-[#2E302B] bg-[#191A17] p-5 shadow-elevated space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#2E302B]">
              <h3 className="text-sm font-bold text-[#F2EFE7]">Initialize Project Pipeline</h3>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="p-1 rounded border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#A5A397] mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design System & WebGL Component Library"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">Client Entity</label>
                  <select
                    value={projectForm.clientId}
                    onChange={(e) => setProjectForm({ ...projectForm, clientId: e.target.value })}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  >
                    {state.clients.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#191A17]">
                        {c.company}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">Contract Budget ({currencySymbol})</label>
                  <input
                    type="number"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm({ ...projectForm, budget: Number(e.target.value) })}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A5A397] mb-1">Description & Scope</label>
                <textarea
                  rows={2}
                  placeholder="Key deliverables, sprint objectives..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">Target Delivery</label>
                  <input
                    type="date"
                    value={projectForm.deadline}
                    onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#2E302B] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[#2E302B] text-xs font-medium text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] text-xs font-medium border border-[#C87C55]/30 shadow-subtle transition-colors"
                >
                  Launch Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

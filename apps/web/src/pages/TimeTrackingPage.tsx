import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFreelanceStore, freelanceStore } from "../lib/freelance-store";
import {
  Clock,
  Play,
  Pause,
  Square,
  Plus,
  Receipt,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  X,
  Check,
} from "lucide-react";

export function TimeTrackingPage() {
  const navigate = useNavigate();
  const state = useFreelanceStore();
  const [selectedProjectId, setSelectedProjectId] = useState(state.projects[0]?.id || "");
  const [taskDescription, setTaskDescription] = useState("Production UI Architecture Sprint");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedEntriesForInvoice, setSelectedEntriesForInvoice] = useState<string[]>([]);

  // Manual entry form
  const [manualHours, setManualHours] = useState(3.5);
  const [manualDescription, setManualDescription] = useState("Performance optimization & WebGL cleanup");
  const [manualDate, setManualDate] = useState(new Date().toISOString().split("T")[0]);

  const activeTimer = state.activeTimer;

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ""}${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleToggleTimer = () => {
    if (activeTimer.isRunning) {
      freelanceStore.pauseTimer();
    } else {
      freelanceStore.startTimer(activeTimer.projectId || selectedProjectId, activeTimer.taskTitle || taskDescription);
    }
  };

  const handleStopTimer = () => {
    freelanceStore.stopTimer();
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = state.projects.find((p) => p.id === selectedProjectId) || state.projects[0];
    freelanceStore.addManualTimeEntry({
      projectId: proj.id,
      projectName: proj.title,
      taskTitle: manualDescription,
      description: manualDescription,
      startTime: new Date().toISOString(),
      durationSeconds: Math.round(manualHours * 3600),
      isBillable: true,
      hourlyRate: state.profile.hourlyRate,
      date: manualDate,
    });
    setIsManualModalOpen(false);
  };

  const toggleSelectEntry = (id: string) => {
    if (selectedEntriesForInvoice.includes(id)) {
      setSelectedEntriesForInvoice(selectedEntriesForInvoice.filter((i) => i !== id));
    } else {
      setSelectedEntriesForInvoice([...selectedEntriesForInvoice, id]);
    }
  };

  const handleConvertToInvoice = () => {
    if (!selectedEntriesForInvoice.length) return;
    const inv = freelanceStore.convertTimeEntriesToInvoice(selectedEntriesForInvoice, state.clients[0]?.id);
    if (inv) {
      navigate("/app/invoices");
    }
  };

  // Metrics
  const totalSecondsToday = state.timeEntries
    .filter((e) => e.date === new Date().toISOString().split("T")[0])
    .reduce((sum, e) => sum + e.durationSeconds, 0);

  const totalBillableEarnings = state.timeEntries
    .filter((e) => e.isBillable)
    .reduce((sum, e) => sum + Math.round((e.durationSeconds / 3600) * e.hourlyRate), 0);

  const currencySymbol = state.currency === "INR" ? "₹" : state.currency === "USD" ? "$" : "€";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2E302B]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F2EFE7] font-sans">
            Time Tracking & Billable Engine
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A397] mt-1">
            Precision stopwatch, automated billable hours calculation, and instant 1-click invoice conversion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Manual Entry</span>
          </button>

          {selectedEntriesForInvoice.length > 0 && (
            <button
              onClick={handleConvertToInvoice}
              className="btn-copper text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <Receipt className="h-4 w-4" />
              <span>Generate Invoice ({selectedEntriesForInvoice.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* ACTIVE STOPWATCH HERO CARD                                     */}
      {/* ============================================================== */}
      <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-6 sm:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Timer Digits & Controls */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#A5A397]">
              <span className={`h-2 w-2 rounded-full ${activeTimer.isRunning ? "bg-[#B86A43] animate-pulse" : "bg-[#77766D]"}`} />
              <span className="text-[#F2EFE7] font-semibold">{activeTimer.isRunning ? "LIVE SESSION ACTIVE" : "STOPWATCH IDLE"}</span>
            </div>

            <div className="text-5xl sm:text-6xl font-mono font-bold tracking-tight text-[#F2EFE7]">
              {formatTimer(activeTimer.elapsedSeconds)}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={handleToggleTimer}
                className={`px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  activeTimer.isRunning
                    ? "bg-[#22231F] text-[#E6A15C] border border-[#E6A15C]/40 hover:bg-[#2E302B]"
                    : "btn-copper"
                }`}
              >
                {activeTimer.isRunning ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause Session</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    <span>{activeTimer.elapsedSeconds > 0 ? "Resume Timer" : "Start Stopwatch"}</span>
                  </>
                )}
              </button>

              {activeTimer.elapsedSeconds > 0 && (
                <button
                  onClick={handleStopTimer}
                  className="px-4 py-2.5 rounded-lg border border-[#C95A53]/30 bg-[#C95A53]/10 text-[#C95A53] hover:bg-[#C95A53]/20 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Square className="h-3.5 w-3.5 fill-[#C95A53]" />
                  <span>Stop & Save</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Session Assignment Selector */}
          <div className="lg:col-span-5 rounded-lg border border-[#2E302B] bg-[#22231F] p-4 space-y-3">
            <span className="text-[10px] font-mono text-[#77766D] uppercase tracking-wider block">
              Session Metadata
            </span>

            <div>
              <label className="block text-xs font-medium text-[#A5A397] mb-1">
                Assign Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full rounded-lg border border-[#2E302B] bg-[#191A17] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none font-mono"
              >
                {state.projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.clientName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A5A397] mb-1">
                Task Description
              </label>
              <input
                type="text"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Active deliverable details"
                className="w-full rounded-lg border border-[#2E302B] bg-[#191A17] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-xs font-mono text-[#A5A397]">
              <span>Billable Rate:</span>
              <span className="text-[#F2EFE7] font-semibold">{currencySymbol}{state.profile.hourlyRate}/hr</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-4">
          <span className="text-[10px] font-mono text-[#77766D] uppercase">Logged Today</span>
          <p className="text-2xl font-bold font-mono text-[#F2EFE7] mt-1">
            {formatTimer(totalSecondsToday)}
          </p>
          <span className="text-[11px] text-[#A5A397] font-mono">5h 24m target reached</span>
        </div>

        <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-4">
          <span className="text-[10px] font-mono text-[#77766D] uppercase">Billable Output</span>
          <p className="text-2xl font-bold font-mono text-[#4E8752] mt-1">
            {currencySymbol}{totalBillableEarnings.toLocaleString()}
          </p>
          <span className="text-[11px] text-[#4E8752] font-mono">100% billable ratio</span>
        </div>

        <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-4">
          <span className="text-[10px] font-mono text-[#77766D] uppercase">Unbilled Entries</span>
          <p className="text-2xl font-bold font-mono text-[#E6A15C] mt-1">
            {state.timeEntries.filter((e) => !e.isBilled).length} Sessions
          </p>
          <span className="text-[11px] text-[#A5A397] font-mono">Available for invoice batching</span>
        </div>
      </div>

      {/* Logged Sessions Table */}
      <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2E302B]">
          <h3 className="text-sm font-semibold text-[#F2EFE7]">Session Log</h3>
          <span className="text-xs text-[#77766D] font-mono">
            Select items to bundle into a client invoice
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#2E302B] bg-[#22231F] text-[#A5A397] font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3 w-10">Select</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Project</th>
                <th className="py-2.5 px-3">Task Description</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Billable Amount</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E302B] text-[#A5A397] font-mono">
              {state.timeEntries.map((entry) => {
                const isSelected = selectedEntriesForInvoice.includes(entry.id);
                const hrs = (entry.durationSeconds / 3600).toFixed(2);
                const amount = Math.round(Number(hrs) * entry.hourlyRate);

                return (
                  <tr key={entry.id} className="hover:bg-[#22231F]/50 transition-colors">
                    <td className="py-3 px-3">
                      {!entry.isBilled && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectEntry(entry.id)}
                          className="h-3.5 w-3.5 rounded border-[#2E302B] bg-[#22231F] text-[#B86A43] focus:ring-0"
                        />
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#77766D]">{entry.date}</td>
                    <td className="py-3 px-3 font-sans text-[#F2EFE7] font-medium">
                      {entry.projectName}
                    </td>
                    <td className="py-3 px-3 font-sans text-[#A5A397]">{entry.taskTitle}</td>
                    <td className="py-3 px-3 font-semibold text-[#F2EFE7]">
                      {formatTimer(entry.durationSeconds)} ({hrs}h)
                    </td>
                    <td className="py-3 px-3 text-[#F2EFE7] font-semibold">
                      {currencySymbol}{amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {entry.isBilled ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium border border-[#4E8752]/30 bg-[#4E8752]/10 text-[#4E8752]">
                          BILLED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium border border-[#E6A15C]/30 bg-[#E6A15C]/10 text-[#E6A15C]">
                          UNBILLED
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#2E302B] bg-[#191A17] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E302B]">
              <h2 className="text-sm font-semibold text-[#F2EFE7]">Record Manual Session</h2>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 rounded-lg border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddManual} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#A5A397] mb-1">Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                >
                  {state.projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A5A397] mb-1">
                  Deliverable Description
                </label>
                <input
                  type="text"
                  required
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">
                    Hours Logged
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={manualHours}
                    onChange={(e) => setManualHours(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">Date</label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#2E302B] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-copper text-xs px-4 py-1.5"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
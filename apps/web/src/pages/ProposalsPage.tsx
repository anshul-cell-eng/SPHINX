import { useState } from "react";
import { useFreelanceStore, freelanceStore } from "../lib/freelance-store";
import type { Proposal } from "../types/freelanceos";
import {
  FileSignature,
  Plus,
  Eye,
  Check,
  X,
} from "lucide-react";

export function ProposalsPage() {
  const state = useFreelanceStore();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isNewProposalModalOpen, setIsNewProposalModalOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: "",
    clientId: state.clients[0]?.id || "",
    amount: 95000,
    validUntil: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    scope: "Design, build, test and deploy production ready full-stack web application.",
    terms: "50% deposit upon contract signature, 50% upon final acceptance.",
  });

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const client = state.clients.find((c) => c.id === form.clientId) || state.clients[0];
    freelanceStore.addProposal({
      title: form.title,
      clientId: client.id,
      clientName: client.company,
      clientEmail: client.email,
      status: "SENT",
      amount: Number(form.amount),
      validUntil: form.validUntil,
      scope: form.scope,
      deliverables: [
        { id: "del-1", title: "Architecture & Design Sprint", description: "Wireframes, high fidelity prototypes", amount: Math.round(form.amount * 0.4) },
        { id: "del-2", title: "Frontend Implementation", description: "React, Three.js, responsive layouts", amount: Math.round(form.amount * 0.6) },
      ],
      terms: form.terms,
      sentAt: new Date().toISOString().split("T")[0],
    });
    setIsNewProposalModalOpen(false);
    setForm({
      title: "",
      clientId: state.clients[0]?.id || "",
      amount: 95000,
      validUntil: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      scope: "Design, build, test and deploy production ready full-stack web application.",
      terms: "50% deposit upon contract signature, 50% upon final acceptance.",
    });
  };

  const currencySymbol = state.currency === "INR" ? "₹" : state.currency === "USD" ? "$" : "€";

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2E302B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F2EFE7] font-sans">
            Client Proposals & Scopes of Work
          </h1>
          <p className="text-xs text-[#A5A397] mt-0.5">
            Commercial quote drafting, milestone schedules, and client acceptance workflows.
          </p>
        </div>

        <button
          onClick={() => setIsNewProposalModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] text-xs font-medium shadow-subtle border border-[#C87C55]/30 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Proposal</span>
        </button>
      </div>

      {/* Proposals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.proposals.map((prop) => (
          <div
            key={prop.id}
            className="rounded-md border border-[#2E302B] bg-[#191A17] p-5 shadow-card hover:border-[#3D3F38] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-mono font-bold text-[#B86A43]">
                  {prop.proposalNumber}
                </span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase ${
                    prop.status === "ACCEPTED"
                      ? "text-[#4E8752] border-[#4E8752]/30 bg-[#4E8752]/10"
                      : prop.status === "SENT"
                      ? "text-[#E6A15C] border-[#E6A15C]/30 bg-[#E6A15C]/10"
                      : prop.status === "REJECTED"
                      ? "text-[#C95A53] border-[#C95A53]/30 bg-[#C95A53]/10"
                      : "text-[#77766D] border-[#2E302B] bg-[#111210]"
                  }`}
                >
                  {prop.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#F2EFE7] mb-0.5">{prop.title}</h3>
              <p className="text-xs text-[#A5A397] mb-2">{prop.clientName}</p>
              <p className="text-xs text-[#A5A397] line-clamp-2 leading-relaxed">
                {prop.scope}
              </p>

              {/* Deliverables count */}
              <div className="mt-3 pt-2.5 border-t border-[#2E302B] flex items-center justify-between text-[10px] font-mono text-[#77766D]">
                <span>{prop.deliverables.length} Deliverable Milestones</span>
                <span>Valid: {prop.validUntil}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2E302B] flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-[#77766D] block uppercase">Scope Value</span>
                <span className="text-sm font-mono font-bold text-[#F2EFE7]">
                  {currencySymbol}{prop.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSelectedProposal(prop)}
                  className="p-1.5 rounded border border-[#2E302B] bg-[#22231F] hover:border-[#3D3F38] text-[#A5A397] hover:text-[#F2EFE7] transition-colors"
                  title="View Proposal Preview"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>

                {prop.status === "SENT" && (
                  <button
                    onClick={() => freelanceStore.approveProposal(prop.id)}
                    className="px-2.5 py-1 rounded bg-[#4E8752]/10 border border-[#4E8752]/30 text-[#4E8752] text-xs font-semibold hover:bg-[#4E8752]/20 transition-colors"
                    title="Simulate Client Acceptance"
                  >
                    Accept
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* PROPOSAL PREVIEW MODAL                                         */}
      {/* ============================================================== */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-md border border-[#2E302B] bg-[#191A17] p-6 shadow-elevated space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E302B]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#22231F] text-[#B86A43] border border-[#2E302B]">
                  <FileSignature className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#F2EFE7] font-mono">
                    {selectedProposal.proposalNumber}
                  </h2>
                  <p className="text-[11px] text-[#A5A397]">Scope of Work & Commercial Terms</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProposal(null)}
                className="p-1 rounded border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#F2EFE7] mb-1">{selectedProposal.title}</h3>
              <p className="text-xs text-[#A5A397]">
                Prepared for: <span className="text-[#F2EFE7] font-semibold">{selectedProposal.clientName}</span> ({selectedProposal.clientEmail})
              </p>
            </div>

            <div className="p-4 rounded border border-[#2E302B] bg-[#22231F] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#77766D]">SCOPE SUMMARY</span>
              <p className="text-xs text-[#F2EFE7] leading-relaxed">
                {selectedProposal.scope}
              </p>
            </div>

            {/* Deliverables breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#77766D]">DELIVERABLE PHASES</span>
              <div className="space-y-2">
                {selectedProposal.deliverables.map((del) => (
                  <div
                    key={del.id}
                    className="p-3 rounded border border-[#2E302B] bg-[#22231F] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-[#F2EFE7]">{del.title}</h4>
                      <p className="text-[11px] text-[#A5A397]">{del.description}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#F2EFE7]">
                      {currencySymbol}{del.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded border border-[#2E302B] bg-[#111210] text-[11px] text-[#A5A397]">
              <span className="font-semibold text-[#F2EFE7] block mb-0.5">Commercial Terms:</span>
              {selectedProposal.terms}
            </div>

            <div className="pt-3 border-t border-[#2E302B] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#77766D] font-mono block">TOTAL PROPOSED</span>
                <span className="text-base font-bold font-mono text-[#4E8752]">
                  {currencySymbol}{selectedProposal.amount.toLocaleString()}
                </span>
              </div>

              {selectedProposal.status === "SENT" && (
                <button
                  onClick={() => {
                    freelanceStore.approveProposal(selectedProposal.id);
                    setSelectedProposal(null);
                  }}
                  className="px-4 py-2 rounded bg-[#4E8752] hover:bg-[#5E9C64] text-[#F2EFE7] text-xs font-medium transition-colors"
                >
                  Approve & Execute Agreement
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* NEW PROPOSAL MODAL                                             */}
      {/* ============================================================== */}
      {isNewProposalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-md border border-[#2E302B] bg-[#191A17] p-6 shadow-elevated space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E302B]">
              <h2 className="text-base font-bold text-[#F2EFE7]">Draft Client Proposal</h2>
              <button
                onClick={() => setIsNewProposalModalOpen(false)}
                className="p-1 rounded border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#A5A397] mb-1">Proposal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design System & Frontend Architecture SOW"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">Target Client</label>
                  <select
                    value={form.clientId}
                    onChange={(e) => setForm({ ...form, clientId: e.target.value })}
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
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">Total Fee ({currencySymbol})</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A5A397] mb-1">Scope of Work</label>
                <textarea
                  rows={3}
                  value={form.scope}
                  onChange={(e) => setForm({ ...form, scope: e.target.value })}
                  className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A5A397] mb-1">Commercial Terms</label>
                <input
                  type="text"
                  value={form.terms}
                  onChange={(e) => setForm({ ...form, terms: e.target.value })}
                  className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#2E302B] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProposalModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[#2E302B] text-xs font-medium text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] text-xs font-medium border border-[#C87C55]/30 shadow-subtle transition-colors"
                >
                  Dispatch Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

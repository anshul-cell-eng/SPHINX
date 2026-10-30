import { useState } from "react";
import { Link } from "react-router-dom";
import { useFreelanceStore, freelanceStore } from "../lib/freelance-store";
import confetti from "canvas-confetti";
import {
  Globe,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck2,
  FileText,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  ExternalLink,
  Lock,
  User,
} from "lucide-react";

export function ClientPortalPage() {
  const state = useFreelanceStore();
  const [activeClientId, setActiveClientId] = useState(
    state.activeClientId || state.clients[0]?.id || "cli-1"
  );
  const [activeTab, setActiveTab] = useState<"PROJECTS" | "INVOICES" | "PROPOSALS" | "CONTRACTS">("PROJECTS");
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);

  const currentClient = state.clients.find((c) => c.id === activeClientId) || state.clients[0];
  const clientProjects = state.projects.filter((p) => p.clientId === currentClient.id);
  const clientInvoices = state.invoices.filter((i) => i.clientId === currentClient.id);
  const clientProposals = state.proposals.filter((p) => p.clientId === currentClient.id);
  const clientContracts = state.contracts.filter((c) => c.clientId === currentClient.id);

  const handlePayInvoice = (invoiceId: string) => {
    setPayingInvoiceId(invoiceId);
    setTimeout(() => {
      freelanceStore.processPayment(invoiceId, "UPI");
      setPayingInvoiceId(null);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }, 1000);
  };

  const currencySymbol = state.currency === "INR" ? "₹" : state.currency === "USD" ? "$" : "€";

  return (
    <div className="min-h-screen bg-[#111210] text-[#F2EFE7] font-sans select-none">
      {/* Top Client Portal Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[#2E302B] bg-[#111210]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#191A17] border border-[#2E302B]">
              <span className="font-mono font-bold text-xs text-[#B86A43]">F</span>
            </div>
            <div>
              <span className="font-mono font-bold tracking-wider text-xs text-[#F2EFE7]">
                CLIENT<span className="text-[#B86A43]">PORTAL</span>
              </span>
              <p className="text-[9px] font-mono text-[#77766D] uppercase">
                FREELANCEOS
              </p>
            </div>
          </Link>

          <span className="text-[#2E302B]">|</span>

          {/* Client Identity Switcher */}
          <div className="flex items-center gap-2">
            <select
              value={activeClientId}
              onChange={(e) => setActiveClientId(e.target.value)}
              className="rounded-lg border border-[#2E302B] bg-[#191A17] px-2.5 py-1 text-xs text-[#F2EFE7] font-medium focus:border-[#B86A43] focus:outline-none"
            >
              {state.clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#191A17]">
                  {c.company} ({c.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Switcher back to Freelancer Mode */}
        <div className="flex items-center gap-3">
          <Link
            to="/app"
            className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
          >
            <User className="h-3.5 w-3.5" />
            <span>Freelancer Mode</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentClient.avatar}
                alt={currentClient.name}
                className="h-14 w-14 rounded-xl object-cover border border-[#2E302B]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#F2EFE7] tracking-tight">
                    {currentClient.company}
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#22231F] text-[#A3A68A] border border-[#2E302B]">
                    CLIENT ACCOUNT
                  </span>
                </div>
                <p className="text-xs text-[#A5A397] mt-1">
                  Primary Contact: <span className="text-[#F2EFE7]">{currentClient.name}</span> ({currentClient.email})
                </p>
                <p className="text-xs text-[#77766D] font-mono mt-0.5">
                  Contractor: {state.profile.company} ({state.profile.name})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="rounded-lg border border-[#2E302B] bg-[#22231F] p-3 text-right">
                <span className="text-[#77766D] block uppercase text-[10px]">Total Invoiced</span>
                <span className="text-sm font-bold text-[#F2EFE7]">
                  {currencySymbol}{currentClient.totalBilled.toLocaleString()}
                </span>
              </div>
              <div className="rounded-lg border border-[#2E302B] bg-[#22231F] p-3 text-right">
                <span className="text-[#77766D] block uppercase text-[10px]">Active Sprints</span>
                <span className="text-sm font-bold text-[#B86A43]">
                  {clientProjects.length} Projects
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#2E302B] pb-3 text-xs font-mono">
          {(["PROJECTS", "INVOICES", "PROPOSALS", "CONTRACTS"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-[#22231F] text-[#F2EFE7] font-semibold border border-[#2E302B]"
                  : "text-[#77766D] hover:text-[#F2EFE7]"
              }`}
            >
              {tab} (
              {tab === "PROJECTS"
                ? clientProjects.length
                : tab === "INVOICES"
                ? clientInvoices.length
                : tab === "PROPOSALS"
                ? clientProposals.length
                : clientContracts.length}
              )
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: PROJECTS & MILESTONE DELIVERABLES                       */}
        {/* ============================================================== */}
        {activeTab === "PROJECTS" && (
          <div className="space-y-4">
            {clientProjects.map((proj) => {
              const projTasks = state.tasks.filter((t) => t.projectId === proj.id);

              return (
                <div
                  key={proj.id}
                  className="rounded-xl border border-[#2E302B] bg-[#191A17] p-5 space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2E302B]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-base font-semibold text-[#F2EFE7]">{proj.title}</h2>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#2E302B] text-[#A5A397] bg-[#22231F]">
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#A5A397] max-w-xl">{proj.description}</p>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-xs text-[#77766D]">Completion</span>
                      <p className="text-lg font-bold text-[#F2EFE7]">{proj.progress}%</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#22231F] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#B86A43] h-1.5 rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>

                  {/* Sprint Checklist Items */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#77766D] uppercase tracking-wider block">
                      Sprint Deliverables
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {projTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 rounded-lg border border-[#2E302B] bg-[#22231F] flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded border ${
                                task.status === "DONE"
                                  ? "border-[#4E8752]/40 bg-[#4E8752]/15 text-[#4E8752]"
                                  : "border-[#2E302B] bg-[#191A17] text-[#77766D]"
                              }`}
                            >
                              {task.status === "DONE" ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#F2EFE7]">{task.title}</p>
                              <p className="text-[10px] text-[#77766D]">Target: {task.dueDate}</p>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                              task.status === "DONE"
                                ? "text-[#4E8752] bg-[#4E8752]/10"
                                : "text-[#E6A15C] bg-[#E6A15C]/10"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: INVOICES & INSTANT CHECKOUT                             */}
        {/* ============================================================== */}
        {activeTab === "INVOICES" && (
          <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[#F2EFE7]">Billing & Invoices</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-[#2E302B] bg-[#22231F] text-[#A5A397] uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Issue Date</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E302B] text-[#A5A397]">
                  {clientInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="py-3 px-3 font-semibold text-[#F2EFE7]">{inv.invoiceNumber}</td>
                      <td className="py-3 px-3 text-[#77766D]">{inv.issueDate}</td>
                      <td className="py-3 px-3 text-[#77766D]">{inv.dueDate}</td>
                      <td className="py-3 px-3 font-semibold text-[#F2EFE7]">
                        {currencySymbol}{inv.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                            inv.status === "PAID"
                              ? "text-[#4E8752] border-[#4E8752]/30 bg-[#4E8752]/10"
                              : "text-[#E6A15C] border-[#E6A15C]/30 bg-[#E6A15C]/10"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {inv.status === "UNPAID" ? (
                          <button
                            onClick={() => handlePayInvoice(inv.id)}
                            disabled={payingInvoiceId === inv.id}
                            className="btn-copper text-xs px-3 py-1 inline-flex items-center gap-1.5"
                          >
                            {payingInvoiceId === inv.id ? (
                              <span>Verifying UPI...</span>
                            ) : (
                              <>
                                <CreditCard className="h-3 w-3" />
                                <span>Pay via Razorpay UPI</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-[#4E8752] text-xs font-medium">
                            ✓ Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: PROPOSALS REVIEW & ACCEPTANCE                           */}
        {/* ============================================================== */}
        {activeTab === "PROPOSALS" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientProposals.map((prop) => (
              <div
                key={prop.id}
                className="rounded-xl border border-[#2E302B] bg-[#191A17] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-[#B86A43]">
                      {prop.proposalNumber}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        prop.status === "ACCEPTED"
                          ? "text-[#4E8752] border-[#4E8752]/30 bg-[#4E8752]/10"
                          : "text-[#E6A15C] border-[#E6A15C]/30 bg-[#E6A15C]/10"
                      }`}
                    >
                      {prop.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#F2EFE7] mb-1">{prop.title}</h3>
                  <p className="text-xs text-[#A5A397] leading-relaxed mb-3">{prop.scope}</p>

                  <div className="p-3 rounded-lg border border-[#2E302B] bg-[#22231F] space-y-0.5 text-xs">
                    <p className="text-[#77766D]">Consideration:</p>
                    <p className="text-base font-semibold font-mono text-[#F2EFE7]">
                      {currencySymbol}{prop.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2E302B] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#77766D]">Valid: {prop.validUntil}</span>
                  {prop.status === "SENT" ? (
                    <button
                      onClick={() => freelanceStore.approveProposal(prop.id)}
                      className="btn-copper text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" />
                      <span>Accept Proposal</span>
                    </button>
                  ) : (
                    <span className="text-[#4E8752] text-xs font-mono">
                      ✓ Accepted by Client
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CONTRACTS & DIGITAL AUDIT TRAIL                         */}
        {/* ============================================================== */}
        {activeTab === "CONTRACTS" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientContracts.map((cnt) => (
              <div
                key={cnt.id}
                className="rounded-xl border border-[#2E302B] bg-[#191A17] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-[#B86A43]">
                      {cnt.contractNumber}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#4E8752]/30 text-[#4E8752] bg-[#4E8752]/10">
                      {cnt.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#F2EFE7] mb-2">{cnt.title}</h3>
                  <div className="p-3 rounded-lg border border-[#2E302B] bg-[#22231F] text-xs font-mono space-y-1 text-[#A5A397]">
                    <p>Client Signer: {cnt.clientSignatureName || currentClient.name}</p>
                    <p>Effective: {cnt.effectiveDate}</p>
                    {cnt.signatureHash && (
                      <p className="text-[#4E8752] truncate">
                        Seal: {cnt.signatureHash.slice(0, 24)}...
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2E302B] flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-[#F2EFE7]">
                    {currencySymbol}{cnt.amount.toLocaleString()}
                  </span>
                  <span className="text-[#4E8752] text-xs font-mono flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Legally Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
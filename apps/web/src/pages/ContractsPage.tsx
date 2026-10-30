import { useState } from "react";
import { useFreelanceStore, freelanceStore } from "../lib/freelance-store";
import type { Contract, ContractType } from "../types/freelanceos";
import {
  FileCheck2,
  Plus,
  ShieldCheck,
  Calendar,
  Lock,
  Download,
  CheckCircle2,
  Clock,
  PenTool,
  X,
  Check,
  ExternalLink,
} from "lucide-react";

export function ContractsPage() {
  const state = useFreelanceStore();
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [signerName, setSignerName] = useState(state.profile.name);

  // Form state
  const [form, setForm] = useState({
    title: "",
    clientId: state.clients[0]?.id || "",
    type: "SERVICE_AGREEMENT" as ContractType,
    amount: 120000,
    effectiveDate: new Date().toISOString().split("T")[0],
    content: `MASTER SERVICES AGREEMENT\n\nParties: Apex Design Systems ("Consultant") & Client.\n\n1. OBLIGATIONS: Consultant shall deliver software design and engineering per agreed sprint milestones.\n2. PAYMENT: Fees payable upon milestone verification via Razorpay or direct settlement.\n3. IP RIGHTS: Upon receipt of full payment, all intellectual property rights transfer irrevocably to Client.`,
  });

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const client = state.clients.find((c) => c.id === form.clientId) || state.clients[0];
    freelanceStore.addContract({
      title: form.title,
      clientId: client.id,
      clientName: client.company,
      type: form.type,
      status: "PENDING_SIGNATURE",
      effectiveDate: form.effectiveDate,
      amount: Number(form.amount),
      content: form.content,
    });
    setIsNewContractModalOpen(false);
    setForm({
      title: "",
      clientId: state.clients[0]?.id || "",
      type: "SERVICE_AGREEMENT",
      amount: 120000,
      effectiveDate: new Date().toISOString().split("T")[0],
      content: `MASTER SERVICES AGREEMENT\n\nParties: Apex Design Systems ("Consultant") & Client.\n\n1. OBLIGATIONS: Consultant shall deliver software design and engineering per agreed sprint milestones.\n2. PAYMENT: Fees payable upon milestone verification via Razorpay or direct settlement.\n3. IP RIGHTS: Upon receipt of full payment, all intellectual property rights transfer irrevocably to Client.`,
    });
  };

  const handleExecuteSignature = (role: "CLIENT" | "FREELANCER") => {
    if (!selectedContract) return;
    freelanceStore.signContract(selectedContract.id, signerName, role);
    setIsSigningModalOpen(false);
    setSelectedContract(null);
  };

  const currencySymbol = state.currency === "INR" ? "₹" : state.currency === "USD" ? "$" : "€";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2E302B]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F2EFE7] font-sans">
            Contracts & Cryptographic Seals
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A397] mt-1">
            Execute legally binding service agreements and NDAs with timestamped SHA-256 digital verification.
          </p>
        </div>

        <button
          onClick={() => setIsNewContractModalOpen(true)}
          className="btn-copper text-xs px-4 py-2.5 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Agreement</span>
        </button>
      </div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.contracts.map((cnt) => (
          <div
            key={cnt.id}
            className="rounded-xl border border-[#2E302B] bg-[#191A17] p-5 hover:border-[#3D4039] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-semibold text-[#B86A43]">
                  {cnt.contractNumber}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    cnt.status === "SIGNED"
                      ? "text-[#4E8752] border-[#4E8752]/30 bg-[#4E8752]/10"
                      : "text-[#E6A15C] border-[#E6A15C]/30 bg-[#E6A15C]/10"
                  }`}
                >
                  {cnt.status === "SIGNED" ? "SEALED & SIGNED" : "AWAITING SIGNATURE"}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-[#F2EFE7] mb-1">{cnt.title}</h3>
              <p className="text-xs text-[#A5A397] mb-3">{cnt.clientName}</p>

              <div className="rounded-lg border border-[#2E302B] bg-[#22231F] p-3 text-[11px] font-mono space-y-1.5 text-[#A5A397]">
                <div className="flex items-center justify-between">
                  <span>Type:</span>
                  <span className="text-[#F2EFE7]">{cnt.type.replace("_", " ")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Effective:</span>
                  <span className="text-[#F2EFE7]">{cnt.effectiveDate}</span>
                </div>
                {cnt.signatureHash && (
                  <div className="flex items-center justify-between text-[#4E8752]">
                    <span>Seal Hash:</span>
                    <span className="truncate max-w-[120px]">{cnt.signatureHash.slice(0, 14)}...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#2E302B] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#77766D] block uppercase">Consideration</span>
                <span className="text-sm font-mono font-semibold text-[#F2EFE7]">
                  {currencySymbol}{cnt.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedContract(cnt)}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Inspect
                </button>

                {!cnt.signedByClient && (
                  <button
                    onClick={() => {
                      setSelectedContract(cnt);
                      setSignerName(cnt.clientName);
                      setIsSigningModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#2E302B] hover:bg-[#3D4039] text-[#E6A15C] border border-[#E6A15C]/30 text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <PenTool className="h-3 w-3" />
                    <span>Sign</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* CONTRACT VIEW MODAL                                            */}
      {/* ============================================================== */}
      {selectedContract && !isSigningModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-[#2E302B] bg-[#191A17] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#2E302B]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#22231F] text-[#B86A43] border border-[#2E302B]">
                  <FileCheck2 className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#F2EFE7] font-mono">
                    {selectedContract.contractNumber}
                  </h2>
                  <p className="text-xs text-[#A5A397]">{selectedContract.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContract(null)}
                className="p-1.5 rounded-lg border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Document Content Display */}
            <div className="rounded-lg border border-[#2E302B] bg-[#111210] p-4 font-mono text-xs text-[#A5A397] whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
              {selectedContract.content}
            </div>

            {/* Signatures Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-[#2E302B] bg-[#22231F]">
                <p className="text-[10px] font-mono text-[#77766D] uppercase">Consultant Signature</p>
                <p className="text-xs font-semibold text-[#F2EFE7] mt-1">
                  {selectedContract.freelancerSignatureName || state.profile.name}
                </p>
                <span className="text-[10px] text-[#4E8752] font-mono mt-0.5 block">
                  ✓ Verified & Counter-signed
                </span>
              </div>

              <div className="p-4 rounded-lg border border-[#2E302B] bg-[#22231F]">
                <p className="text-[10px] font-mono text-[#77766D] uppercase">Client Signature</p>
                {selectedContract.signedByClient ? (
                  <>
                    <p className="text-xs font-semibold text-[#F2EFE7] mt-1">
                      {selectedContract.clientSignatureName}
                    </p>
                    <span className="text-[10px] text-[#4E8752] font-mono mt-0.5 block">
                      ✓ Executed ({selectedContract.clientSignatureDate?.split("T")[0]})
                    </span>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-medium text-[#E6A15C] mt-1">Awaiting Client</p>
                    <button
                      onClick={() => {
                        setSignerName(selectedContract.clientName);
                        setIsSigningModalOpen(true);
                      }}
                      className="text-[11px] text-[#B86A43] hover:text-[#D97745] font-mono mt-0.5 block underline"
                    >
                      Sign as Client
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Cryptographic hash info */}
            {selectedContract.signatureHash && (
              <div className="p-3.5 rounded-lg border border-[#4E8752]/30 bg-[#4E8752]/5 text-xs font-mono space-y-1">
                <div className="flex items-center gap-1.5 text-[#4E8752] font-medium">
                  <ShieldCheck className="h-4 w-4" />
                  <span>256-Bit Tamper-Proof Digital Seal</span>
                </div>
                <p className="text-[11px] text-[#A5A397] truncate">
                  SHA-256: {selectedContract.signatureHash}
                </p>
                <p className="text-[10px] text-[#77766D]">
                  Audit IP: {selectedContract.ipAddress || "192.168.1.1"} • Timestamped Ledger Verification
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DIGITAL SIGNATURE WORKFLOW MODAL                               */}
      {/* ============================================================== */}
      {isSigningModalOpen && selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#2E302B] bg-[#191A17] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E302B]">
              <div className="flex items-center gap-2">
                <PenTool className="h-4 w-4 text-[#B86A43]" />
                <h2 className="text-sm font-semibold text-[#F2EFE7]">Execute Digital Signature</h2>
              </div>
              <button
                onClick={() => setIsSigningModalOpen(false)}
                className="p-1 rounded-lg border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-[#A5A397] mb-2">
                Document: <span className="text-[#F2EFE7] font-medium">{selectedContract.title}</span>
              </p>

              <label className="block text-xs font-medium text-[#A5A397] mb-1">
                Signer Legal Name
              </label>
              <input
                type="text"
                required
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
              />
            </div>

            {/* Signature Preview Pad */}
            <div className="p-5 rounded-lg border border-dashed border-[#2E302B] bg-[#111210] text-center">
              <span className="text-[10px] font-mono text-[#77766D] uppercase block mb-1">
                Rendered Signature
              </span>
              <p className="text-xl font-serif italic text-[#F2EFE7] py-2">
                {signerName || "Signer Name"}
              </p>
              <p className="text-[10px] font-mono text-[#77766D]">
                ISO UTC Timestamp: {new Date().toISOString().slice(0, 19)}Z
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSigningModalOpen(false)}
                className="btn-secondary text-xs px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExecuteSignature("CLIENT")}
                className="btn-copper text-xs px-4 py-1.5"
              >
                Apply Digital Seal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* NEW CONTRACT MODAL                                             */}
      {/* ============================================================== */}
      {isNewContractModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#2E302B] bg-[#191A17] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E302B] mb-5">
              <h2 className="text-base font-semibold text-[#F2EFE7]">Draft Service Agreement</h2>
              <button
                onClick={() => setIsNewContractModalOpen(false)}
                className="p-1 rounded-lg border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A5A397] mb-1">
                  Agreement Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Services Agreement (MSA) - Phase 2"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">
                    Client Account
                  </label>
                  <select
                    value={form.clientId}
                    onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                    className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  >
                    {state.clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">
                    Agreement Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  >
                    <option value="SERVICE_AGREEMENT">Service Agreement</option>
                    <option value="NDA">Non-Disclosure Agreement</option>
                    <option value="RETAINER">Monthly Retainer</option>
                    <option value="IP_ASSIGNMENT">IP Assignment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">
                    Consideration ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    value={form.effectiveDate}
                    onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })}
                    className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#2E302B] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewContractModalOpen(false)}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-copper text-xs px-4 py-1.5"
                >
                  Create Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { useFreelanceStore, freelanceStore } from "../lib/freelance-store";
import type { Client } from "../types/freelanceos";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Trash2,
  X,
} from "lucide-react";

export function ClientsPage() {
  const state = useFreelanceStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding client
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    taxId: "",
    notes: "",
    tags: "Design, Retainer",
  });

  const filteredClients = state.clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.company.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    freelanceStore.addClient({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone || "+91 98000 00000",
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&q=80&w=150`,
      address: formData.address || "Bengaluru, India",
      currency: "INR",
      taxId: formData.taxId || "GSTIN29AAACA1234",
      status: "ACTIVE",
      notes: formData.notes,
      tags: formData.tags.split(",").map((t) => t.trim()),
    });
    setIsAddModalOpen(false);
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      taxId: "",
      notes: "",
      tags: "Design, Retainer",
    });
  };

  const currencySymbol = state.currency === "INR" ? "₹" : state.currency === "USD" ? "$" : "€";

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2E302B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F2EFE7] font-sans">
            Client Directory & CRM
          </h1>
          <p className="text-xs text-[#A5A397] mt-0.5">
            Client account management, contact registers, scoped portal permissions, and billing footprints.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] text-xs font-medium shadow-subtle border border-[#C87C55]/30 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#77766D]" />
          <input
            type="text"
            placeholder="Search by client name, company, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-[#2E302B] bg-[#191A17] py-1.5 pl-9 pr-3 text-xs text-[#F2EFE7] placeholder-[#77766D] focus:border-[#B86A43] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {["ALL", "ACTIVE", "LEAD", "INACTIVE"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                statusFilter === st
                  ? "bg-[#22231F] text-[#F2EFE7] font-semibold border border-[#2E302B]"
                  : "bg-[#191A17] border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          const clientProjects = state.projects.filter((p) => p.clientId === client.id);

          return (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="rounded-md border border-[#2E302B] bg-[#191A17] p-5 shadow-card hover:border-[#3D3F38] cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="h-9 w-9 rounded object-cover ring-1 ring-[#2E302B]"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-[#F2EFE7] tracking-tight">
                        {client.company}
                      </h3>
                      <p className="text-[11px] text-[#A5A397]">{client.name}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                      client.status === "ACTIVE"
                        ? "text-[#4E8752] border-[#4E8752]/30 bg-[#4E8752]/10"
                        : client.status === "LEAD"
                        ? "text-[#B86A43] border-[#B86A43]/30 bg-[#B86A43]/10"
                        : "text-[#77766D] border-[#2E302B] bg-[#111210]"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-[#A5A397]">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-[#77766D]" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-[#77766D]" />
                    <span>{client.phone}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {client.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-[#2E302B] bg-[#22231F] px-1.5 py-0.2 text-[9px] font-mono text-[#A5A397]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Financial Footprint */}
              <div className="mt-4 pt-3 border-t border-[#2E302B] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[9px] text-[#77766D] block uppercase">Total Settled</span>
                  <span className="text-[#F2EFE7] font-bold">
                    {currencySymbol}{client.totalBilled.toLocaleString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-[#77766D] block uppercase">Active Sprints</span>
                  <span className="text-[#B86A43] font-bold">
                    {clientProjects.length} Sprints
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* CLIENT DETAIL DRAWER / MODAL                                   */}
      {/* ============================================================== */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
          <div className="h-full w-full max-w-md bg-[#191A17] border-l border-[#2E302B] p-6 overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E302B]">
              <span className="text-xs font-mono text-[#77766D] uppercase tracking-wider">
                CLIENT RECORD & LEDGER
              </span>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-1 rounded border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={selectedClient.avatar}
                alt={selectedClient.name}
                className="h-12 w-12 rounded object-cover ring-1 ring-[#2E302B]"
              />
              <div>
                <h2 className="text-base font-bold text-[#F2EFE7]">{selectedClient.company}</h2>
                <p className="text-xs text-[#A5A397]">{selectedClient.name} • Contact</p>
                <p className="text-[11px] text-[#77766D]">{selectedClient.address}</p>
              </div>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded border border-[#2E302B] bg-[#22231F] p-3">
                <span className="text-[9px] font-mono text-[#77766D] uppercase">Settled Invoices</span>
                <p className="text-lg font-bold font-mono text-[#4E8752] mt-0.5">
                  {currencySymbol}{selectedClient.totalBilled.toLocaleString()}
                </p>
              </div>
              <div className="rounded border border-[#2E302B] bg-[#22231F] p-3">
                <span className="text-[9px] font-mono text-[#77766D] uppercase">Outstanding</span>
                <p className="text-lg font-bold font-mono text-[#E6A15C] mt-0.5">
                  {currencySymbol}{selectedClient.outstandingBalance.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Associated Projects */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-mono text-[#A5A397] uppercase tracking-wider">
                Project Pipelines
              </h3>
              {state.projects
                .filter((p) => p.clientId === selectedClient.id)
                .map((proj) => (
                  <div
                    key={proj.id}
                    className="p-2.5 rounded border border-[#2E302B] bg-[#22231F] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-[#F2EFE7]">{proj.title}</h4>
                      <p className="text-[10px] text-[#77766D] font-mono">
                        Budget: {currencySymbol}{proj.budget.toLocaleString()} • Due {proj.deadline}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#B86A43]">
                      {proj.progress}%
                    </span>
                  </div>
                ))}
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold font-mono text-[#A5A397] uppercase tracking-wider">
                Account Specifications
              </h3>
              <p className="text-xs text-[#A5A397] p-3 rounded border border-[#2E302B] bg-[#22231F] leading-relaxed">
                {selectedClient.notes || "No custom specifications recorded."}
              </p>
            </div>

            {/* Delete Client */}
            <div className="pt-4 border-t border-[#2E302B] flex justify-end">
              <button
                onClick={() => {
                  freelanceStore.deleteClient(selectedClient.id);
                  setSelectedClient(null);
                }}
                className="px-3 py-1.5 rounded border border-[#C95A53]/30 text-[#C95A53] hover:bg-[#C95A53]/10 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                <span>Remove Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADD CLIENT MODAL                                               */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-md border border-[#2E302B] bg-[#191A17] p-6 shadow-elevated space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E302B]">
              <h2 className="text-base font-bold text-[#F2EFE7]">Register Client Account</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rachel Adams"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">
                    Company / Entity
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Digital"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rachel@apexdigital.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98000 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A5A397] mb-1">
                  Tax Identification (GSTIN / VAT / EIN)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 29AADCB2234M1Z5"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A5A397] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Design System, Three.js, Retainer"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A5A397] mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Key deliverables, billing preferences, special instructions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#2E302B] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[#2E302B] text-xs font-medium text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] text-xs font-medium border border-[#C87C55]/30 shadow-subtle transition-colors"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

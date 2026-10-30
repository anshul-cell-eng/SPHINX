import { useState } from "react";
import { useFreelanceStore, freelanceStore } from "../lib/freelance-store";
import type { Invoice, InvoiceItem } from "../types/freelanceos";
import {
  Receipt,
  Plus,
  Trash2,
  Printer,
  CreditCard,
  Eye,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";

export function InvoicesPage() {
  const state = useFreelanceStore();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);

  // New Invoice form state
  const [clientId, setClientId] = useState(state.clients[0]?.id || "");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]
  );
  const [taxRate, setTaxRate] = useState(18); // GST
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("Payment due within 15 days via Razorpay UPI or Netbanking.");
  const [lineItems, setLineItems] = useState<Omit<InvoiceItem, "id">[]>([
    { description: "Sprint Deliverables & Code Handoff", quantity: 1, rate: 45000, amount: 45000 },
  ]);

  const filteredInvoices = state.invoices.filter((inv) =>
    statusFilter === "ALL" ? true : inv.status === statusFilter
  );

  const calculateSubtotal = () =>
    lineItems.reduce((acc, item) => acc + item.quantity * item.rate, 0);

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { description: "Additional Scope Item", quantity: 1, rate: 15000, amount: 15000 }]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const handleUpdateLineItem = (index: number, field: keyof Omit<InvoiceItem, "id">, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "quantity" || field === "rate") {
      updated[index].amount = updated[index].quantity * updated[index].rate;
    }
    setLineItems(updated);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const client = state.clients.find((c) => c.id === clientId) || state.clients[0];
    const subtotal = calculateSubtotal();
    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const total = subtotal + taxAmount - discount;

    const newInv = freelanceStore.addInvoice({
      clientId: client.id,
      clientName: client.company,
      clientEmail: client.email,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate,
      status: "UNPAID",
      items: lineItems.map((item, idx) => ({ ...item, id: `itm-${Date.now()}-${idx}` })),
      subtotal,
      taxRate,
      taxAmount,
      discount,
      total,
      currency: "INR",
      notes,
    });

    setIsNewInvoiceModalOpen(false);
    setSelectedInvoice(newInv);
  };

  const currencySymbol = state.currency === "INR" ? "₹" : state.currency === "USD" ? "$" : "€";

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2E302B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F2EFE7] font-sans">
            Invoicing & Revenue Engine
          </h1>
          <p className="text-xs text-[#A5A397] mt-0.5">
            GST-compliant accounting ledger, Razorpay UPI reconciliation, and payment settlement tracking.
          </p>
        </div>

        <button
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] text-xs font-medium shadow-subtle border border-[#C87C55]/30 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {["ALL", "UNPAID", "PAID", "OVERDUE"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
              statusFilter === st
                ? "bg-[#22231F] text-[#F2EFE7] font-semibold border border-[#2E302B]"
                : "bg-[#191A17] border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7]"
            }`}
          >
            {st} ({st === "ALL" ? state.invoices.length : state.invoices.filter((i) => i.status === st).length})
          </button>
        ))}
      </div>

      {/* Invoices Table View */}
      <div className="rounded-md border border-[#2E302B] bg-[#191A17] overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#2E302B] bg-[#22231F] text-[#A5A397] font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-5">Invoice #</th>
                <th className="py-3 px-5">Client</th>
                <th className="py-3 px-5">Issue Date</th>
                <th className="py-3 px-5">Due Date</th>
                <th className="py-3 px-5">Total Amount</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E302B] text-[#F2EFE7]">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-[#22231F] transition-colors"
                >
                  <td className="py-3.5 px-5 font-mono font-bold text-[#F2EFE7]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-5">
                    <p className="font-semibold text-[#F2EFE7]">{inv.clientName}</p>
                    <p className="text-[10px] text-[#A5A397]">{inv.clientEmail}</p>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-[#A5A397]">{inv.issueDate}</td>
                  <td className="py-3.5 px-5 font-mono text-[#A5A397]">{inv.dueDate}</td>
                  <td className="py-3.5 px-5 font-mono font-bold text-[#F2EFE7] text-sm">
                    {currencySymbol}{inv.total.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        inv.status === "PAID"
                          ? "text-[#4E8752] border-[#4E8752]/30 bg-[#4E8752]/10"
                          : inv.status === "UNPAID"
                          ? "text-[#E6A15C] border-[#E6A15C]/30 bg-[#E6A15C]/10"
                          : "text-[#C95A53] border-[#C95A53]/30 bg-[#C95A53]/10"
                      }`}
                    >
                      {inv.status === "PAID" && <CheckCircle2 className="h-3 w-3" />}
                      {inv.status === "UNPAID" && <Clock className="h-3 w-3" />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 rounded border border-[#2E302B] hover:border-[#3D3F38] text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F]"
                        title="View & Print"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      {inv.status === "UNPAID" && (
                        <button
                          onClick={() => {
                            freelanceStore.processPayment(inv.id, "UPI");
                          }}
                          className="px-2.5 py-1 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] font-medium text-[11px] border border-[#C87C55]/30 transition-colors flex items-center gap-1"
                        >
                          <CreditCard className="h-3 w-3" />
                          <span>Pay (UPI)</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* INVOICE PREVIEW & PRINT READY MODAL                            */}
      {/* ============================================================== */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-md border border-[#2E302B] bg-[#191A17] p-6 sm:p-7 shadow-elevated space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E302B]">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-[#B86A43]" />
                <h2 className="text-sm font-bold text-[#F2EFE7] font-mono">
                  {selectedInvoice.invoiceNumber}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded border border-[#2E302B] text-xs font-medium text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F] flex items-center gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1 rounded border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Formatted Invoice Document Card */}
            <div className="rounded border border-[#2E302B] bg-[#111210] p-6 space-y-6">
              {/* Top Biller & Recipient Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-5 border-b border-[#2E302B]">
                <div>
                  <h3 className="text-base font-bold text-[#F2EFE7]">
                    {state.profile.company}
                  </h3>
                  <p className="text-xs text-[#A5A397]">{state.profile.name}</p>
                  <p className="text-xs text-[#A5A397]">{state.profile.address}</p>
                  <p className="text-xs text-[#77766D] font-mono mt-1">
                    GSTIN: {state.profile.taxId} • {state.profile.email}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-lg font-bold font-mono text-[#B86A43]">
                    TAX INVOICE
                  </span>
                  <p className="text-xs font-mono text-[#F2EFE7] mt-1">
                    Invoice: {selectedInvoice.invoiceNumber}
                  </p>
                  <p className="text-xs font-mono text-[#A5A397]">
                    Date: {selectedInvoice.issueDate}
                  </p>
                  <p className="text-xs font-mono text-[#A5A397]">
                    Due: {selectedInvoice.dueDate}
                  </p>
                </div>
              </div>

              {/* Billed To */}
              <div>
                <p className="text-[10px] font-mono uppercase text-[#77766D]">BILLED TO:</p>
                <h4 className="text-sm font-semibold text-[#F2EFE7] mt-0.5">{selectedInvoice.clientName}</h4>
                <p className="text-xs text-[#A5A397]">{selectedInvoice.clientEmail}</p>
              </div>

              {/* Line Items Table */}
              <div className="rounded border border-[#2E302B] overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#22231F] text-[#A5A397] border-b border-[#2E302B]">
                    <tr>
                      <th className="py-2.5 px-4">Description</th>
                      <th className="py-2.5 px-4 text-center">Qty</th>
                      <th className="py-2.5 px-4 text-right">Rate</th>
                      <th className="py-2.5 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2E302B]">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="py-2.5 px-4 text-[#F2EFE7] font-sans text-xs">
                          {item.description}
                        </td>
                        <td className="py-2.5 px-4 text-center text-[#A5A397]">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[#A5A397]">
                          {currencySymbol}{item.rate.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[#F2EFE7] font-bold">
                          {currencySymbol}{item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Summary */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-[#2E302B]">
                <div className="text-xs text-[#A5A397] max-w-sm">
                  <p className="font-semibold text-[#F2EFE7] mb-1">Settlement Details:</p>
                  <p className="text-[11px] leading-relaxed">
                    UPI ID: <span className="font-mono text-[#B86A43]">{state.profile.upiId}</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Bank: {state.profile.bankName} • A/C: {state.profile.bankAccount} • IFSC: {state.profile.bankIfsc}
                  </p>
                  <p className="text-[10px] text-[#77766D] mt-2 font-mono">{selectedInvoice.notes}</p>
                </div>

                <div className="w-64 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-[#A5A397]">
                    <span>Subtotal:</span>
                    <span>{currencySymbol}{selectedInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#A5A397]">
                    <span>GST (18%):</span>
                    <span>{currencySymbol}{selectedInvoice.taxAmount.toLocaleString()}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex items-center justify-between text-[#4E8752]">
                      <span>Discount:</span>
                      <span>-{currencySymbol}{selectedInvoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm font-bold text-[#F2EFE7] pt-2 border-t border-[#2E302B]">
                    <span>Total Due:</span>
                    <span className="text-[#4E8752] font-mono">
                      {currencySymbol}{selectedInvoice.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Pay Action */}
            <div className="flex justify-end gap-3 pt-2">
              {selectedInvoice.status === "UNPAID" && (
                <button
                  onClick={() => {
                    freelanceStore.processPayment(selectedInvoice.id, "UPI");
                    setSelectedInvoice(null);
                  }}
                  className="px-5 py-2 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] text-xs font-medium border border-[#C87C55]/30 shadow-subtle transition-colors flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Settle via Razorpay UPI ({currencySymbol}{selectedInvoice.total.toLocaleString()})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* NEW INVOICE MODAL                                              */}
      {/* ============================================================== */}
      {isNewInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-md border border-[#2E302B] bg-[#191A17] p-6 shadow-elevated space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E302B]">
              <h2 className="text-base font-bold text-[#F2EFE7]">Generate Invoice</h2>
              <button
                onClick={() => setIsNewInvoiceModalOpen(false)}
                className="p-1 rounded border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">
                    Client Account
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  >
                    {state.clients.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#191A17]">
                        {c.company} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#A5A397]">
                  <span>Deliverables & Line Items</span>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-[#B86A43] hover:text-[#D97745] flex items-center gap-1 font-sans text-xs"
                  >
                    <Plus className="h-3 w-3" /> Add Item
                  </button>
                </div>

                {lineItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => handleUpdateLineItem(idx, "description", e.target.value)}
                      className="flex-1 rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleUpdateLineItem(idx, "quantity", Number(e.target.value))}
                      className="w-16 rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none text-center"
                    />
                    <input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => handleUpdateLineItem(idx, "rate", Number(e.target.value))}
                      className="w-24 rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none text-right font-mono"
                    />
                    <span className="w-24 text-right text-xs font-mono font-bold text-[#F2EFE7]">
                      {currencySymbol}{item.amount.toLocaleString()}
                    </span>
                    {lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLineItem(idx)}
                        className="p-1 text-[#77766D] hover:text-[#C95A53]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">
                    GST / Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A5A397] mb-1">
                    Discount Amount ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full rounded border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#2E302B] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceModalOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-[#2E302B] text-xs font-medium text-[#A5A397] hover:text-[#F2EFE7] bg-[#22231F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#B86A43] hover:bg-[#D97745] text-[#F2EFE7] text-xs font-medium border border-[#C87C55]/30 shadow-subtle transition-colors"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

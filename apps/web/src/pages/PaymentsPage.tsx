import { useState } from "react";
import { useFreelanceStore, freelanceStore } from "../lib/freelance-store";
import type { PaymentTransaction, Invoice } from "../types/freelanceos";
import confetti from "canvas-confetti";
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Download,
  Search,
  Sparkles,
  Copy,
  Check,
  X,
  Smartphone,
} from "lucide-react";

export function PaymentsPage() {
  const state = useFreelanceStore();
  const [selectedInvoiceToPay, setSelectedInvoiceToPay] = useState<Invoice | null>(null);
  const [activePaymentMethod, setActivePaymentMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<PaymentTransaction | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const pendingInvoices = state.invoices.filter((i) => i.status === "UNPAID");

  const handleSimulatePayment = () => {
    if (!selectedInvoiceToPay) return;
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `order_${Math.random().toString(36).substring(2, 12)}`;
      const paymentId = `pay_${Math.random().toString(36).substring(2, 12)}`;
      const signature = `sig_${Math.random().toString(36).substring(2, 16)}`;

      const completed = freelanceStore.processPayment(selectedInvoiceToPay.id, activePaymentMethod, {
        orderId,
        paymentId,
        signature,
      });

      setIsProcessing(false);
      setSelectedInvoiceToPay(null);
      if (completed) {
        setPaymentSuccessData(completed);
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    }, 1200);
  };

  const copyTxHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const currencySymbol = state.currency === "INR" ? "₹" : state.currency === "USD" ? "$" : "€";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2E302B]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F2EFE7] font-sans">
            Payments & Settlement Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A397] mt-1">
            Real-time server-verified transactions, UPI QR settlement flows, and tamper-proof ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#4E8752]/30 bg-[#4E8752]/10 text-[#4E8752]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4E8752] animate-pulse" />
            Razorpay Test Engine Active
          </span>
        </div>
      </div>

      {/* Outstanding Invoices Alert if any */}
      {pendingInvoices.length > 0 && (
        <div className="rounded-xl border border-[#E6A15C]/30 bg-[#191A17] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-[#E6A15C] font-semibold text-xs sm:text-sm">
              <Clock className="h-4 w-4" />
              <span>{pendingInvoices.length} Invoices Awaiting Settlement</span>
            </div>
            <span className="text-[11px] font-mono text-[#77766D]">
              Click checkout to simulate automated webhook verification
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 rounded-lg border border-[#2E302B] bg-[#22231F] flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-mono font-semibold text-[#F2EFE7]">{inv.invoiceNumber}</p>
                  <p className="text-xs text-[#A5A397]">{inv.clientName}</p>
                  <p className="text-sm font-mono font-bold text-[#F2EFE7] mt-1">
                    {currencySymbol}{inv.total.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedInvoiceToPay(inv)}
                  className="btn-copper text-xs px-3.5 py-1.5 flex items-center gap-1.5"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Checkout</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verified Transactions Ledger */}
      <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2E302B]">
          <div>
            <h3 className="text-sm font-semibold text-[#F2EFE7] font-sans">
              Verified Transaction Ledger
            </h3>
            <p className="text-xs text-[#A5A397]">
              Cryptographically verified payments confirmed via server-side webhook authentication
            </p>
          </div>
          <span className="text-xs font-mono text-[#77766D]">
            {state.payments.length} Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#2E302B] bg-[#22231F] text-[#A5A397] font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Verified At</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E302B] text-[#A5A397] font-mono">
              {state.payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#22231F]/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#F2EFE7]">
                    <div className="flex items-center gap-1.5">
                      <span>{p.paymentId}</span>
                      <button
                        onClick={() => copyTxHash(p.transactionHash)}
                        className="text-[#77766D] hover:text-[#F2EFE7]"
                        title="Copy Hash"
                      >
                        {copiedHash === p.transactionHash ? (
                          <Check className="h-3 w-3 text-[#4E8752]" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <span className="text-[10px] text-[#77766D] block truncate max-w-[130px]">
                      {p.transactionHash}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#B86A43]">{p.invoiceNumber}</td>
                  <td className="py-3 px-3 font-sans text-[#F2EFE7]">{p.clientName}</td>
                  <td className="py-3 px-3 font-bold text-[#F2EFE7] text-xs">
                    {currencySymbol}{p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#22231F] border border-[#2E302B] text-[#A5A397] text-[10px]">
                      {p.method}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#77766D] text-[11px]">
                    {p.verifiedAt.replace("T", " ").slice(0, 19)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border border-[#4E8752]/30 bg-[#4E8752]/10 text-[#4E8752]">
                      <CheckCircle2 className="h-2.5 w-2.5" /> VERIFIED
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => alert(`Receipt downloaded for ${p.paymentId}`)}
                      className="p-1 rounded border border-[#2E302B] hover:border-[#3D4039] text-[#77766D] hover:text-[#F2EFE7]"
                      title="Download PDF Receipt"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RAZORPAY & UPI TEST-MODE CHECKOUT MODAL                        */}
      {/* ============================================================== */}
      {selectedInvoiceToPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#2E302B] bg-[#191A17] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E302B]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22231F] text-[#B86A43] border border-[#2E302B]">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#F2EFE7] font-mono">
                    Razorpay Secure Checkout
                  </h2>
                  <p className="text-[10px] text-[#77766D]">Simulated Sandbox</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceToPay(null)}
                className="p-1 rounded-lg border border-[#2E302B] text-[#A5A397] hover:text-[#F2EFE7]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Total and Invoice Summary */}
            <div className="rounded-lg border border-[#2E302B] bg-[#22231F] p-3.5 flex items-center justify-between font-mono">
              <div>
                <span className="text-[10px] text-[#77766D] uppercase">Invoice</span>
                <p className="text-xs font-semibold text-[#F2EFE7] mt-0.5">{selectedInvoiceToPay.invoiceNumber}</p>
                <p className="text-[10px] text-[#A5A397]">{selectedInvoiceToPay.clientName}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#77766D] uppercase">Settlement</span>
                <p className="text-lg font-bold text-[#F2EFE7]">
                  {currencySymbol}{selectedInvoiceToPay.total.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-[#77766D] uppercase">Payment Method</span>
              <div className="grid grid-cols-3 gap-2">
                {(["UPI", "CARD", "NETBANKING"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setActivePaymentMethod(method)}
                    className={`py-1.5 px-3 rounded-lg border text-xs font-mono font-medium transition-all ${
                      activePaymentMethod === method
                        ? "border-[#B86A43] bg-[#B86A43]/15 text-[#B86A43]"
                        : "border-[#2E302B] bg-[#22231F] text-[#A5A397] hover:text-[#F2EFE7]"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Method UI */}
            {activePaymentMethod === "UPI" && (
              <div className="rounded-lg border border-[#2E302B] bg-[#22231F] p-4 text-center space-y-2">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-lg bg-[#F2EFE7] p-2">
                  <div className="h-full w-full border border-black/20 flex flex-col items-center justify-center text-black">
                    <QrCode className="h-14 w-14 text-black" />
                    <span className="text-[8px] font-mono font-bold mt-1">UPI SCAN</span>
                  </div>
                </div>
                <p className="text-xs font-mono text-[#A5A397]">
                  Scan with any UPI application (GPay, PhonePe, Paytm, CRED)
                </p>
                <p className="text-[10px] text-[#77766D] font-mono">
                  Virtual VPA: {state.profile.upiId}
                </p>
              </div>
            )}

            {activePaymentMethod === "CARD" && (
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[#A5A397] mb-1">Card Number (Sandbox)</label>
                  <input
                    type="text"
                    disabled
                    value="4111 •••• •••• 1111"
                    className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-[#F2EFE7] font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#A5A397] mb-1">Expiry</label>
                    <input
                      type="text"
                      disabled
                      value="12/28"
                      className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-[#F2EFE7] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A5A397] mb-1">CVV</label>
                    <input
                      type="text"
                      disabled
                      value="888"
                      className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-[#F2EFE7] font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {activePaymentMethod === "NETBANKING" && (
              <div className="space-y-1.5 text-xs">
                <span className="text-[#A5A397] block mb-1">Select Bank</span>
                <select className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-[#F2EFE7]">
                  <option>HDFC Bank (Sandbox Instant)</option>
                  <option>ICICI Bank (Sandbox Instant)</option>
                  <option>State Bank of India</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}

            {/* Submit Verification Button */}
            <div className="pt-2">
              <button
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full btn-copper text-xs sm:text-sm py-2.5 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="h-4 w-4 border-2 border-[#111210] border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Webhook Signature...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Authorize & Verify {currencySymbol}{selectedInvoiceToPay.total.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PAYMENT SUCCESS CONFIRMATION MODAL                             */}
      {/* ============================================================== */}
      {paymentSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#4E8752]/40 bg-[#191A17] p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#4E8752]/15 text-[#4E8752] border border-[#4E8752]/30">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <h2 className="text-lg font-bold text-[#F2EFE7] font-sans">
              Payment Confirmed & Verified
            </h2>

            <p className="text-xs text-[#A5A397]">
              ₹{paymentSuccessData.amount.toLocaleString()} received from {paymentSuccessData.clientName} for {paymentSuccessData.invoiceNumber}.
            </p>

            <div className="p-3.5 rounded-lg border border-[#2E302B] bg-[#22231F] text-xs font-mono text-left space-y-1 text-[#A5A397]">
              <div className="flex justify-between">
                <span>Payment ID:</span>
                <span className="text-[#F2EFE7] font-semibold">{paymentSuccessData.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span>Razorpay Order:</span>
                <span className="text-[#A5A397]">{paymentSuccessData.razorpayOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Audit Hash:</span>
                <span className="text-[#4E8752] truncate max-w-[150px]">{paymentSuccessData.transactionHash}</span>
              </div>
            </div>

            <button
              onClick={() => setPaymentSuccessData(null)}
              className="w-full btn-secondary text-xs py-2"
            >
              Close Confirmation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { useFreelanceStore, freelanceStore } from "../lib/freelance-store";
import {
  Settings,
  User,
  Building,
  CreditCard,
  Bell,
  Shield,
  Save,
  Check,
  Sparkles,
} from "lucide-react";

export function SettingsPage() {
  const state = useFreelanceStore();
  const [profile, setProfile] = useState(state.profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    freelanceStore.updateProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#2E302B]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F2EFE7] font-sans">
            Workspace Settings & Integrations
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A397] mt-1">
            Configure your professional identity, business tax IDs, Razorpay API keys, and settlement credentials.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#4E8752]/10 border border-[#4E8752]/30 text-[#4E8752] text-xs font-mono animate-in fade-in">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Freelancer Profile */}
        <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2E302B]">
            <User className="h-4 w-4 text-[#B86A43]" />
            <h2 className="text-sm font-semibold text-[#F2EFE7]">Freelancer Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-[#A5A397] mb-1">Full Legal Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A5A397] mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-[#A5A397] mb-1">Professional Title</label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A5A397] mb-1">Standard Hourly Rate (₹)</label>
              <input
                type="number"
                value={profile.hourlyRate}
                onChange={(e) => setProfile({ ...profile, hourlyRate: Number(e.target.value) })}
                className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Business & Tax Credentials */}
        <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2E302B]">
            <Building className="h-4 w-4 text-[#A3A68A]" />
            <h2 className="text-sm font-semibold text-[#F2EFE7]">Studio & Tax Registration</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-[#A5A397] mb-1">Business Name</label>
              <input
                type="text"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A5A397] mb-1">GSTIN / Tax ID</label>
              <input
                type="text"
                value={profile.taxId}
                onChange={(e) => setProfile({ ...profile, taxId: e.target.value })}
                className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5A397] mb-1">Registered Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Razorpay & UPI Credentials */}
        <div className="rounded-xl border border-[#2E302B] bg-[#191A17] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2E302B]">
            <CreditCard className="h-4 w-4 text-[#E6A15C]" />
            <h2 className="text-sm font-semibold text-[#F2EFE7]">Payment Settlement Gateways</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-[#A5A397] mb-1">Razorpay Key ID (Test / Live)</label>
              <input
                type="text"
                value={profile.razorpayKeyId}
                onChange={(e) => setProfile({ ...profile, razorpayKeyId: e.target.value })}
                className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A5A397] mb-1">Razorpay Key Secret</label>
              <input
                type="password"
                value={profile.razorpayKeySecret}
                onChange={(e) => setProfile({ ...profile, razorpayKeySecret: e.target.value })}
                className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-[#A5A397] mb-1">Primary UPI ID / VPA</label>
              <input
                type="text"
                value={profile.upiId}
                onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A5A397] mb-1">Bank Account Identifier</label>
              <input
                type="text"
                value={profile.bankAccount}
                onChange={(e) => setProfile({ ...profile, bankAccount: e.target.value })}
                className="w-full rounded-lg border border-[#2E302B] bg-[#22231F] p-2 text-xs text-[#F2EFE7] focus:border-[#B86A43] focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="btn-copper text-xs px-5 py-2.5 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
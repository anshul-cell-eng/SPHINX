import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { freelanceStore } from "../lib/freelance-store";
import { ArrowRight, Lock, Mail, User, Globe, ShieldCheck } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"FREELANCER" | "CLIENT">("FREELANCER");
  const [email, setEmail] = useState("alex@freelanceos.studio");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === "FREELANCER") {
        freelanceStore.setRole("FREELANCER");
        navigate("/app");
      } else {
        freelanceStore.setRole("CLIENT", "cli-1");
        navigate("/portal");
      }
    }, 400);
  };

  const handleQuickLogin = (selectedRole: "FREELANCER" | "CLIENT") => {
    if (selectedRole === "FREELANCER") {
      freelanceStore.setRole("FREELANCER");
      navigate("/app");
    } else {
      freelanceStore.setRole("CLIENT", "cli-1");
      navigate("/portal");
    }
  };

  return (
    <div className="min-h-screen bg-[#111210] text-[#F2EFE7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Monogram */}
        <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-[#191A17] border border-[#2E302B] text-[#B86A43] shadow-subtle group-hover:border-[#B86A43] transition-colors">
            <span className="font-mono font-bold text-base">F</span>
          </div>
          <span className="font-sans font-semibold tracking-wider text-base text-[#F2EFE7]">
            FREELANCEOS
          </span>
        </Link>

        <h2 className="text-2xl font-bold tracking-tight text-[#F2EFE7] font-sans">
          Workspace Authentication
        </h2>
        <p className="mt-1.5 text-xs text-[#A5A397]">
          Sign in to manage client deliverables, generate invoices, or review proposals.
        </p>

        {/* Role Switcher */}
        <div className="mt-5 flex rounded-md border border-[#2E302B] bg-[#191A17] p-1 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => {
              setRole("FREELANCER");
              setEmail("alex@freelanceos.studio");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition-all ${
              role === "FREELANCER"
                ? "bg-[#22231F] text-[#F2EFE7] border border-[#2E302B] font-semibold"
                : "text-[#A5A397] hover:text-[#F2EFE7]"
            }`}
          >
            <User className="h-3.5 w-3.5 text-[#B86A43]" />
            <span>Freelancer</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("CLIENT");
              setEmail("sarah@novastudios.design");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition-all ${
              role === "CLIENT"
                ? "bg-[#22231F] text-[#F2EFE7] border border-[#2E302B] font-semibold"
                : "text-[#A5A397] hover:text-[#F2EFE7]"
            }`}
          >
            <Globe className="h-3.5 w-3.5 text-[#4E8752]" />
            <span>Client Portal</span>
          </button>
        </div>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="rounded-md border border-[#2E302B] bg-[#191A17] p-6 sm:p-7 shadow-card">
          {/* Quick Demo Access Bar */}
          <div className="mb-5 pb-4 border-b border-[#2E302B]">
            <p className="text-[10px] font-mono text-[#A5A397] uppercase tracking-wider mb-2">
              Instant 1-Click Sandbox Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("FREELANCER")}
                className="p-2 rounded border border-[#2E302B] bg-[#22231F] hover:border-[#3D3F38] text-[#F2EFE7] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#B86A43]" />
                <span>Alex (Freelancer)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("CLIENT")}
                className="p-2 rounded border border-[#2E302B] bg-[#22231F] hover:border-[#3D3F38] text-[#F2EFE7] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#4E8752]" />
                <span>Sarah (Client)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#A5A397] mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#77766D]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border border-[#2E302B] bg-[#22231F] py-2 pl-9 pr-3 text-xs sm:text-sm text-[#F2EFE7] placeholder-[#77766D] focus:border-[#B86A43] focus:outline-none focus:ring-1 focus:ring-[#B86A43]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#A5A397]">
                  Password
                </label>
                <span className="text-[11px] text-[#B86A43] hover:text-[#D97745] cursor-pointer">
                  Reset password
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#77766D]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded border border-[#2E302B] bg-[#22231F] py-2 pl-9 pr-3 text-xs sm:text-sm text-[#F2EFE7] placeholder-[#77766D] focus:border-[#B86A43] focus:outline-none focus:ring-1 focus:ring-[#B86A43]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded bg-[#B86A43] hover:bg-[#D97745] py-2.5 text-xs sm:text-sm font-medium text-[#F2EFE7] border border-[#C87C55]/30 shadow-subtle transition-colors"
              >
                <span>{loading ? "Verifying..." : `Authenticate as ${role === "FREELANCER" ? "Freelancer" : "Client"}`}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          <div className="mt-5 pt-4 border-t border-[#2E302B] flex items-center justify-center gap-1.5 text-[10px] text-[#77766D] font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-[#4E8752]" />
            <span>SESSION PROTECTED VIA 256-BIT JWT TOKEN</span>
          </div>
        </div>
      </div>
    </div>
  );
}

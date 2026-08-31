import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import TeamSwitcher from "@/components/TeamSwitcher";
import RoleGate from "@/components/RoleGate";
import BalanceCard from "./components/BalanceCard";
import NextGameCard from "./components/NextGameCard";
import GameHistoryCard from "./components/GameHistoryCard";
import { mockBalance, mockNextGame, mockGameHistory } from "@/mocks/dashboardMocks";

function ProfileDropdown({ name, onLogout }: { name: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Profile menu"
        className="w-9 h-9 rounded-full bg-[#111111] hover:bg-[#333333] flex items-center justify-center transition-colors active:scale-95"
      >
        <span className="text-white text-xs font-semibold tracking-wide">
          {initials || "?"}
        </span>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-48 rounded-[8px] bg-white border border-[#EAEAEA] z-50 overflow-hidden"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <div className="px-4 py-3 border-b border-[#EAEAEA]">
            <p className="text-[#111111] text-sm font-medium truncate">{name || "Account"}</p>
          </div>
          <div className="py-1">
            <button
              type="button"
              className="w-full text-left px-4 py-2.5 text-sm text-[#111111] hover:bg-[#F7F6F3] transition-colors"
            >
              Profile
            </button>
            <button
              type="button"
              className="w-full text-left px-4 py-2.5 text-sm text-[#111111] hover:bg-[#F7F6F3] transition-colors"
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() => { onLogout(); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-[#9F2F2D] hover:bg-[#FDEBEC] transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { auth, logout } = useAuth();
  const { teamId: _teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const fullName = auth.user?.fullName ?? "";
  const activeTeamId = auth.workspace?.activeMembership.teamId;

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col">
      <header className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-[#EAEAEA] sticky top-0 z-40">
        <TeamSwitcher />
        <div className="flex items-center gap-3">
          <RoleGate minRole="CAPTAIN">
            <button
              type="button"
              onClick={() => activeTeamId && navigate(`/${activeTeamId}/manage`)}
              className="text-[#111111] text-sm font-medium px-3 py-1.5 rounded-[8px] hover:bg-[#F7F6F3] transition-colors"
            >
              Manage Team
            </button>
          </RoleGate>
          <ProfileDropdown name={fullName} onLogout={logout} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-10 w-full max-w-lg mx-auto space-y-3">
        <div className="fade-in-up" style={{ animationDelay: "0ms" }}>
          <BalanceCard balance={mockBalance} />
        </div>
        <div className="fade-in-up" style={{ animationDelay: "80ms" }}>
          <NextGameCard game={mockNextGame} />
        </div>
        <div className="fade-in-up" style={{ animationDelay: "160ms" }}>
          <GameHistoryCard games={mockGameHistory} />
        </div>
      </main>
    </div>
  );
}
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import TeamSwitcher from "@/components/TeamSwitcher";
import BalanceCard from "./components/BalanceCard";
import NextGameCard from "./components/NextGameCard";
import GameHistoryCard from "./components/GameHistoryCard";
import TabBar, { type TabId } from "./components/TabBar";
import { mockBalance, mockNextGame, mockGameHistory } from "@/mocks/dashboardMocks";

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-9 h-9 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
      <span className="text-green-400 text-sm font-bold">{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-white/30">
      <p className="text-lg font-medium">{label}</p>
      <p className="text-sm mt-1">Coming soon</p>
    </div>
  );
}

export default function DashboardPage() {
  const { auth, logout } = useAuth();
  const { teamId: _teamId } = useParams<{ teamId: string }>();
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const role = auth.workspace?.activeMembership.role ?? "PLAYER";
  const isCaptain = role === "CAPTAIN";
  const fullName = auth.user?.fullName ?? "";

  return (
    <div className="min-h-screen bg-[#0d1f14] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#0d1f14]/95 border-b border-white/8 sticky top-0 z-40 backdrop-blur-sm">
        <TeamSwitcher />
        <div className="flex items-center gap-2.5">
          <span className="text-white font-semibold text-sm hidden sm:block">{fullName}</span>
          <button type="button" onClick={logout} title="Sign out" className="focus:outline-none">
            <Avatar name={fullName || "?"} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className={`flex-1 overflow-y-auto px-4 py-4 space-y-3 ${isCaptain ? "pb-24" : "pb-6"}`}>
        {/* User full name (mobile) */}
        <div className="sm:hidden">
          <h1 className="text-white text-xl font-bold">{fullName}</h1>
        </div>

        {activeTab === "home" && (
          <>
            <BalanceCard balance={mockBalance} />
            <NextGameCard game={mockNextGame} />
            <GameHistoryCard games={mockGameHistory} />
          </>
        )}
        {activeTab === "games" && <PlaceholderTab label="Games" />}
        {activeTab === "finance" && <PlaceholderTab label="Finance" />}
        {activeTab === "team" && <PlaceholderTab label="Team" />}
      </main>

      {/* Footer tab bar — Captain only */}
      {isCaptain && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#0d1f14]/95 border-t border-white/8 backdrop-blur-sm z-40">
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </nav>
      )}
    </div>
  );
}

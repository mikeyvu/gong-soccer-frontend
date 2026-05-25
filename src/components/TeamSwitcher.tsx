import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";

function RoleBadge({ role }: { role: Role }) {
  const styles =
    role === "CAPTAIN"
      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      : "bg-white/10 text-white/60 border-white/20";
  const label = role === "CAPTAIN" ? "Captain" : role === "PLAYER" ? "Player" : "Spectator";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${styles}`}>
      {label}
    </span>
  );
}

export default function TeamSwitcher() {
  const { auth, switchTeam } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const workspace = auth.workspace;
  if (!workspace) return null;

  const { memberships, activeMembership } = workspace;
  const multi = memberships.length > 1;

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleSelect(teamId: string) {
    switchTeam(teamId);
    navigate(`/${teamId}/dashboard`);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => multi && setOpen((o) => !o)}
        className={`flex items-center gap-2 ${multi ? "cursor-pointer" : "cursor-default"}`}
      >
        {/* Team avatar */}
        <div className="w-7 h-7 rounded-lg bg-green-500/30 border border-green-500/40 flex items-center justify-center flex-shrink-0">
          <span className="text-green-400 text-xs font-bold">
            {activeMembership.teamName.charAt(0)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-white font-semibold text-sm leading-tight">
            {activeMembership.teamName}
          </span>
          <RoleBadge role={activeMembership.role} />
        </div>

        {multi && (
          <ChevronDown
            className={`w-4 h-4 text-white/50 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-[#1a2e1f] border border-white/15 shadow-2xl z-50 overflow-hidden">
          <p className="text-white/40 text-xs font-medium px-3 pt-3 pb-1 uppercase tracking-wider">
            Your Teams
          </p>
          {memberships.map((m) => {
            const isActive = m.teamId === activeMembership.teamId;
            return (
              <button
                key={m.teamId}
                type="button"
                onClick={() => handleSelect(m.teamId)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 text-xs font-bold">
                    {m.teamName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{m.teamName}</p>
                  <p className="text-white/40 text-xs">/{m.teamId}/dashboard</p>
                </div>
                {isActive && <Check className="w-4 h-4 text-green-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

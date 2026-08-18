import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";

function RoleBadge({ role }: { role: Role }) {
  const styles =
    role === "CAPTAIN"
      ? "bg-[#FBF3DB] text-[#956400]"
      : "bg-[#F7F6F3] text-[#787774]";
  const label = role === "CAPTAIN" ? "Captain" : role === "PLAYER" ? "Player" : "Spectator";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles}`}>
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
        <div className="w-7 h-7 rounded-[6px] bg-[#EDF3EC] border border-[#C8E0C5] flex items-center justify-center flex-shrink-0">
          <span className="text-[#346538] text-xs font-bold">
            {activeMembership.teamName.charAt(0)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[#111111] font-semibold text-sm leading-tight">
            {activeMembership.teamName}
          </span>
          <RoleBadge role={activeMembership.role} />
        </div>

        {multi && (
          <ChevronDown
            className={`w-4 h-4 text-[#AAAAAA] transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-64 rounded-[8px] bg-white border border-[#EAEAEA] z-50 overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <p className="text-[#AAAAAA] text-xs font-medium px-3 pt-3 pb-1 uppercase tracking-[0.05em]">
            Your Teams
          </p>
          {memberships.map((m) => {
            const isActive = m.teamId === activeMembership.teamId;
            return (
              <button
                key={m.teamId}
                type="button"
                onClick={() => handleSelect(m.teamId)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#F7F6F3] transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-[6px] bg-[#EDF3EC] border border-[#C8E0C5] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#346538] text-xs font-bold">
                    {m.teamName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#111111] text-sm font-medium truncate">{m.teamName}</p>
                  <p className="text-[#AAAAAA] text-xs">/{m.teamId}/dashboard</p>
                </div>
                {isActive && <Check className="w-4 h-4 text-[#346538] flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

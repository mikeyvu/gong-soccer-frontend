import type { Game } from "@/types";
import { formatGameDateTime } from "@/lib/formatters";

function StatusBadge({ status }: { status: Game["status"] }) {
  const styles = {
    upcoming: "bg-[#E1F3FE] text-[#1F6C9F]",
    past:     "bg-[#F7F6F3] text-[#787774]",
    cancelled:"bg-[#FDEBEC] text-[#9F2F2D]",
  }[status];
  const label = { upcoming: "Upcoming", past: "Past", cancelled: "Cancelled" }[status];
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium uppercase tracking-[0.05em] ${styles}`}>
      {label}
    </span>
  );
}

function ParticipantChip({ game }: { game: Game }) {
  if (game.participantStatus === "waitingList") {
    return (
      <span className="text-xs px-2.5 py-1 rounded-full bg-[#FBF3DB] text-[#956400] font-medium uppercase tracking-[0.05em]">
        Wait{game.participantSlot != null ? ` #${game.participantSlot}` : ""}
      </span>
    );
  }
  if (game.participantStatus === "registered") {
    return (
      <span className="text-xs px-2.5 py-1 rounded-full bg-[#EDF3EC] text-[#346538] font-medium uppercase tracking-[0.05em]">
        #{game.participantSlot ?? "—"} · Registered
      </span>
    );
  }
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-[#FDEBEC] text-[#9F2F2D] font-medium uppercase tracking-[0.05em]">
      Cancelled
    </span>
  );
}

function ActionButton({ game }: { game: Game }) {
  if (game.status !== "upcoming") return null;
  if (game.participantStatus === "cancelled") {
    return (
      <button
        type="button"
        className="px-4 py-2 rounded-[6px] bg-[#111111] hover:bg-[#333333] text-white text-sm font-medium transition-colors active:scale-[0.98]"
      >
        Register
      </button>
    );
  }
  return (
    <button
      type="button"
      className="px-4 py-2 rounded-[6px] bg-[#FDEBEC] hover:bg-[#FAD9D9] text-[#9F2F2D] text-sm font-medium transition-colors active:scale-[0.98]"
    >
      Cancel
    </button>
  );
}

export default function NextGameCard({ game }: { game: Game }) {
  return (
    <div className="rounded-[12px] bg-white border border-[#EAEAEA] p-6">
      <div className="flex items-start justify-between mb-4">
        <p className="text-[#787774] text-xs font-medium uppercase tracking-[0.05em]">Next Game</p>
        <StatusBadge status={game.status} />
      </div>

      <h3 className="text-[#111111] text-lg font-semibold" style={{ letterSpacing: "-0.01em" }}>
        {game.title}
      </h3>
      <p className="text-[#787774] text-sm mt-0.5">{formatGameDateTime(game.dateTime)}</p>

      <div className="flex items-center gap-1.5 mt-2">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0" aria-hidden="true">
          <path
            d="M6 1a3.5 3.5 0 0 1 3.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 0 1 6 1Z"
            stroke="#AAAAAA"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="6" cy="4.5" r="1" fill="#AAAAAA" />
        </svg>
        <p className="text-[#AAAAAA] text-xs">{game.venue}</p>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#EAEAEA]">
        <ParticipantChip game={game} />
        <ActionButton game={game} />
      </div>
    </div>
  );
}
import { MapPin } from "lucide-react";
import type { Game } from "@/types";
import { formatGameDateTime } from "@/lib/formatters";

function StatusBadge({ status }: { status: Game["status"] }) {
  const styles = {
    upcoming: "bg-green-500/20 text-green-400 border-green-500/30",
    past: "bg-white/10 text-white/50 border-white/15",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  }[status];
  const label = { upcoming: "Upcoming", past: "Past", cancelled: "Cancelled" }[status];
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${styles}`}>
      {label}
    </span>
  );
}

function ParticipantChip({ game }: { game: Game }) {
  if (game.participantStatus === "waitingList") {
    return (
      <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 font-medium">
        Waiting List{game.participantSlot != null ? ` #${game.participantSlot}` : ""}
      </span>
    );
  }
  if (game.participantStatus === "registered") {
    return (
      <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 font-medium">
        #{game.participantSlot ?? "—"} · Registered
      </span>
    );
  }
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/40 font-medium">
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
        className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-white text-sm font-semibold transition active:scale-95"
      >
        Register
      </button>
    );
  }
  return (
    <button
      type="button"
      className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-semibold transition active:scale-95"
    >
      Cancel
    </button>
  );
}

export default function NextGameCard({ game }: { game: Game }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Next Game</p>
        <StatusBadge status={game.status} />
      </div>

      <h3 className="text-white text-lg font-semibold">{game.title}</h3>
      <p className="text-white/60 text-sm mt-0.5">{formatGameDateTime(game.dateTime)}</p>

      <div className="flex items-center gap-1.5 mt-2">
        <MapPin className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
        <p className="text-white/40 text-xs">{game.venue}</p>
      </div>

      <div className="flex items-center justify-between mt-5">
        <ParticipantChip game={game} />
        <ActionButton game={game} />
      </div>
    </div>
  );
}

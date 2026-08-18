import type { GameHistoryEntry } from "@/types";
import { formatShortDate } from "@/lib/formatters";

function ResultBadge({ result }: { result: string }) {
  const styles =
    result === "Won"
      ? "bg-[#EDF3EC] text-[#346538]"
      : result === "Lost"
      ? "bg-[#FDEBEC] text-[#9F2F2D]"
      : "bg-[#FBF3DB] text-[#956400]";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase tracking-[0.04em] ${styles}`}>
      {result}
    </span>
  );
}

export default function GameHistoryCard({ games }: { games: GameHistoryEntry[] }) {
  return (
    <div className="rounded-[12px] bg-white border border-[#EAEAEA] p-6">
      <p className="text-[#787774] text-xs font-medium uppercase tracking-[0.05em] mb-2">
        Game History
      </p>

      {games.length === 0 ? (
        <p className="text-[#AAAAAA] text-sm text-center py-6">No games yet</p>
      ) : (
        <div>
          {games.map((g, i) => (
            <div
              key={g.id}
              className={`flex items-center gap-3 py-3 ${i < games.length - 1 ? "border-b border-[#EAEAEA]" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[#111111] text-sm font-medium truncate">{g.title}</p>
                <p className="text-[#AAAAAA] text-xs truncate mt-0.5">{g.venue}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <ResultBadge result={g.result} />
                <p className="text-[#AAAAAA] text-xs">{formatShortDate(g.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

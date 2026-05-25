import type { GameHistoryEntry } from "@/types";
import { formatShortDate } from "@/lib/formatters";

function ResultDot({ result }: { result: string }) {
  const color =
    result === "Won"
      ? "bg-green-400"
      : result === "Lost"
      ? "bg-red-400"
      : "bg-orange-400";
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />;
}

export default function GameHistoryCard({ games }: { games: GameHistoryEntry[] }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
      <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-4">
        Game History
      </p>

      {games.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-4">No games yet</p>
      ) : (
        <div className="space-y-3">
          {games.map((g) => (
            <div key={g.id} className="flex items-center gap-3">
              <ResultDot result={g.result} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{g.title}</p>
                <p className="text-white/40 text-xs truncate">{g.venue}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white/50 text-xs">{formatShortDate(g.date)}</p>
                <p
                  className={`text-xs font-medium ${
                    g.result === "Won"
                      ? "text-green-400"
                      : g.result === "Lost"
                      ? "text-red-400"
                      : "text-orange-400"
                  }`}
                >
                  {g.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

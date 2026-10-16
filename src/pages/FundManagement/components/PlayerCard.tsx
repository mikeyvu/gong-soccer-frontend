import { useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import { resolveAssetUrl } from "@/lib/utils";
import type { TeamPlayer } from "@/types";

export default function PlayerCard({ player }: { player: TeamPlayer }) {
  const [imgFailed, setImgFailed] = useState(false);

  // TODO: fall back to username once the backend has one; email for now
  const name = player.fullName || player.email;
  const initials = (player.fullName
    ? player.fullName.split(" ").filter(Boolean).map((n) => n[0]).join("")
    : player.email.charAt(0)
  )
    .slice(0, 2)
    .toUpperCase();

  const showImg = player.avatarUrl && !imgFailed;

  return (
    <div className="rounded-[12px] bg-white border border-[#EAEAEA] p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center flex-shrink-0 overflow-hidden">
        {showImg ? (
          <img
            src={resolveAssetUrl(player.avatarUrl!)}
            alt=""
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-xs font-semibold tracking-wide">{initials || "?"}</span>
        )}
      </div>
      <p className="flex-1 min-w-0 text-[#111111] text-sm font-medium truncate">{name}</p>
      <div className="text-right flex-shrink-0">
        <p className="text-[#787774] text-[11px] font-medium uppercase tracking-[0.05em]">Contributed</p>
        <p className="text-[#111111] text-base font-bold">{formatCurrency(player.balance, "USD")}</p>
      </div>
    </div>
  );
}

import { Plus } from "lucide-react";
import type { FinanceBalance } from "@/types";
import { formatCurrency } from "@/lib/formatters";

export default function BalanceCard({ balance }: { balance: FinanceBalance }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-green-900/40 to-green-950/60 border border-green-800/40 p-5">
      <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">
        Team Balance
      </p>
      <p className="text-white text-4xl font-bold tracking-tight">
        {formatCurrency(balance.amount, balance.currency)}
      </p>
      <p className="text-white/40 text-sm mt-1">{balance.description}</p>

      <div className="flex justify-end mt-5">
        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Top Up
        </button>
      </div>
    </div>
  );
}

import type { FinanceBalance } from "@/types";
import { formatCurrency } from "@/lib/formatters";

export default function BalanceCard({ balance }: { balance: FinanceBalance }) {
  return (
    <div className="rounded-[12px] bg-white border border-[#EAEAEA] p-6">
      <p className="text-[#787774] text-xs font-medium uppercase tracking-[0.05em] mb-4">
        Balance
      </p>
      <p
        className="text-[#111111] text-4xl font-bold"
        style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
      >
        {formatCurrency(balance.amount, balance.currency)}
      </p>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-[#111111] hover:bg-[#333333] text-white text-sm font-medium transition-colors active:scale-[0.98]"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Top Up
        </button>
      </div>
    </div>
  );
}
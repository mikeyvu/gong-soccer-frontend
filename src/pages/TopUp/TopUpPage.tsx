import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createTopUp, getTopUps } from "@/services/topUpService";
import { formatCurrency, formatShortDate } from "@/lib/formatters";
import type { TopUpRequest, TopUpStatus } from "@/types";

// Digits with an optional decimal point and at most 2 decimal places.
const AMOUNT_PATTERN = /^\d*(\.\d{0,2})?$/;

const STATUS_BADGE: Record<TopUpStatus, { label: string; className: string }> = {
  PENDING: { label: "Awaiting approval", className: "bg-[#FBF3DB] text-[#956400]" },
  APPROVED: { label: "Approved", className: "bg-[#EDF3EC] text-[#346538]" },
  REJECTED: { label: "Rejected", className: "bg-[#FDEBEC] text-[#9F2F2D]" },
};

export default function TopUpPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [history, setHistory] = useState<TopUpRequest[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getTopUps()
      .then((data) => { if (!cancelled) setHistory(data); })
      .catch(() => { if (!cancelled) setHistory([]); })
      .finally(() => { if (!cancelled) setHistoryLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const parsedAmount = parseFloat(amount);
  const canSubmit = !submitting && parsedAmount > 0;

  function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (AMOUNT_PATTERN.test(value)) {
      setAmount(value);
      setError("");
      setSuccess("");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const request = await createTopUp(parsedAmount);
      setHistory((prev) => [request, ...prev]);
      setAmount("");
      setSuccess("Top-up request submitted — awaiting approval.");
    } catch {
      setError("Failed to submit top-up. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col">
      <header className="flex items-center px-5 py-3.5 bg-white border-b border-[#EAEAEA] sticky top-0 z-40">
        <button
          type="button"
          onClick={() => navigate(`/${teamId}/dashboard`)}
          className="flex items-center gap-1.5 text-[#111111] text-sm font-medium px-3 py-1.5 -ml-3 rounded-[8px] hover:bg-[#F7F6F3] transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M8 2L3.5 6.5 8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Homepage
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-10 w-full max-w-lg mx-auto space-y-3">
        <form
          onSubmit={handleSubmit}
          className="fade-in-up rounded-[12px] bg-white border border-[#EAEAEA] p-6"
          style={{ animationDelay: "0ms" }}
        >
          <label
            htmlFor="top-up-amount"
            className="block text-[#787774] text-xs font-medium uppercase tracking-[0.05em] mb-4"
          >
            Top Up Amount
          </label>
          <div className="flex items-center gap-2 rounded-[8px] border border-[#EAEAEA] px-3 focus-within:border-[#111111] transition-colors">
            <span className="text-[#787774] text-lg">$</span>
            <input
              id="top-up-amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              className="flex-1 py-3 bg-transparent text-[#111111] text-lg outline-none placeholder:text-[#C4C4C2]"
            />
          </div>

          {error && <p className="text-[#9F2F2D] text-sm mt-3">{error}</p>}
          {success && <p className="text-[#346538] text-sm mt-3">{success}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full mt-6 px-4 py-2.5 rounded-[6px] bg-[#111111] hover:bg-[#333333] text-white text-sm font-medium transition-colors active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </form>

        <section
          className="fade-in-up rounded-[12px] bg-white border border-[#EAEAEA] p-6"
          style={{ animationDelay: "80ms" }}
        >
          <p className="text-[#787774] text-xs font-medium uppercase tracking-[0.05em] mb-4">
            Transaction History
          </p>
          {historyLoading ? (
            <div className="space-y-3">
              <div className="h-10 bg-[#F0F0EF] rounded-[6px] animate-pulse" />
              <div className="h-10 bg-[#F0F0EF] rounded-[6px] animate-pulse" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-[#787774] text-sm">No transactions yet.</p>
          ) : (
            <ul className="divide-y divide-[#EAEAEA]">
              {history.map((tx) => {
                const badge = STATUS_BADGE[tx.status];
                return (
                  <li key={tx.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-[#111111] text-sm font-medium">
                        {formatCurrency(tx.amount, "USD")}
                      </p>
                      <p className="text-[#787774] text-xs mt-0.5">{formatShortDate(tx.createdAt)}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-[6px] ${badge.className}`}>
                      {badge.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

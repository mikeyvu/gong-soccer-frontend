import { formatCurrency, formatShortDate } from "@/lib/formatters";
import type { CaptainTopUpRequest } from "@/types";

export type ReviewAction = "approve" | "reject";

export default function PendingRequestsCard({
  requests,
  loading,
  loadError,
  pageLoading,
  page,
  totalPages,
  totalElements,
  onPageChange,
  busy,
  rowError,
  onReview,
}: {
  requests: CaptainTopUpRequest[];
  loading?: boolean;
  loadError?: boolean;
  pageLoading?: boolean;
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  busy: { id: number; action: ReviewAction } | null;
  rowError: { id: number; message: string } | null;
  onReview: (id: number, action: ReviewAction) => void;
}) {
  return (
    <section className="rounded-[12px] bg-white border border-[#EAEAEA] p-6">
      <p className="text-[#787774] text-xs font-medium uppercase tracking-[0.05em] mb-4">
        Pending Requests{!loading && totalElements > 0 && ` (${totalElements})`}
      </p>
      {loading ? (
        <div className="space-y-3">
          <div className="h-10 bg-[#F0F0EF] rounded-[6px] animate-pulse" />
          <div className="h-10 bg-[#F0F0EF] rounded-[6px] animate-pulse" />
        </div>
      ) : loadError ? (
        <p className="text-[#9F2F2D] text-sm">Couldn't load requests. Please try again.</p>
      ) : requests.length === 0 ? (
        <p className="text-[#787774] text-sm">No pending requests.</p>
      ) : (
        <>
          <ul className={`divide-y divide-[#EAEAEA] transition-opacity ${pageLoading ? "opacity-60" : ""}`}>
            {requests.map((req) => {
              const rowBusy = busy?.id === req.id;
              return (
                <li key={req.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[#111111] text-sm font-medium">
                        {formatCurrency(req.amount, "USD")}
                      </p>
                      <p className="text-[#787774] text-xs mt-0.5 truncate">
                        {req.userEmail} · {formatShortDate(req.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        disabled={rowBusy}
                        onClick={() => onReview(req.id, "reject")}
                        className="px-3 py-1.5 rounded-[6px] border border-[#EAEAEA] hover:bg-[#FDEBEC] text-[#9F2F2D] text-xs font-medium transition-colors active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
                      >
                        {rowBusy && busy?.action === "reject" ? "Rejecting…" : "Reject"}
                      </button>
                      <button
                        type="button"
                        disabled={rowBusy}
                        onClick={() => onReview(req.id, "approve")}
                        className="px-3 py-1.5 rounded-[6px] bg-[#111111] hover:bg-[#333333] text-white text-xs font-medium transition-colors active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
                      >
                        {rowBusy && busy?.action === "approve" ? "Approving…" : "Approve"}
                      </button>
                    </div>
                  </div>
                  {rowError?.id === req.id && (
                    <p className="text-[#9F2F2D] text-xs mt-2">{rowError.message}</p>
                  )}
                </li>
              );
            })}
          </ul>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#EAEAEA]">
              <button
                type="button"
                disabled={page === 0 || pageLoading}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-1.5 rounded-[6px] border border-[#EAEAEA] hover:bg-[#F7F6F3] text-[#111111] text-xs font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                ‹ Prev
              </button>
              <span className="text-[#787774] text-xs">
                Page {page + 1} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages - 1 || pageLoading}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-1.5 rounded-[6px] border border-[#EAEAEA] hover:bg-[#F7F6F3] text-[#111111] text-xs font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                Next ›
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

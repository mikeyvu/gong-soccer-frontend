import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { getPendingTopUps, approveTopUp, rejectTopUp } from "@/services/topUpService";
import { getTeamPlayers, getTeamFundBalance } from "@/services/teamService";
import type { CaptainTopUpRequest, TeamPlayer } from "@/types";
import TeamFundCard from "@/pages/ManageTeam/components/TeamFundCard";
import PendingRequestsCard, { type ReviewAction } from "./components/PendingRequestsCard";
import PlayerCard from "./components/PlayerCard";

export default function FundManagementPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [fundBalance, setFundBalance] = useState<number | null>(null);
  const [fundLoading, setFundLoading] = useState(true);
  const [fundError, setFundError] = useState(false);

  const [requests, setRequests] = useState<CaptainTopUpRequest[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  // Only the latest page request may update state, so a slow earlier response can't overwrite it
  const requestSeq = useRef(0);
  const [busy, setBusy] = useState<{ id: number; action: ReviewAction } | null>(null);
  const [rowError, setRowError] = useState<{ id: number; message: string } | null>(null);

  const [players, setPlayers] = useState<TeamPlayer[]>([]);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [playersError, setPlayersError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getTeamFundBalance()
      .then((data) => { if (!cancelled) setFundBalance(data.fundBalance); })
      .catch(() => { if (!cancelled) setFundError(true); })
      .finally(() => { if (!cancelled) setFundLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const loadPage = useCallback(async (target: number) => {
    const seq = ++requestSeq.current;
    try {
      let data = await getPendingTopUps(target);
      // Past the end (e.g. the last item on the last page was just reviewed): step back to the last page
      if (data.content.length === 0 && target > 0 && data.totalPages > 0) {
        data = await getPendingTopUps(data.totalPages - 1);
      }
      if (seq !== requestSeq.current) return;
      setRequests(data.content);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setLoadError(false);
    } catch {
      if (seq === requestSeq.current) setLoadError(true);
    } finally {
      if (seq === requestSeq.current) {
        setLoading(false);
        setPageLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const seq = requestSeq;
    loadPage(0);
    // Invalidate any in-flight request on unmount
    return () => { seq.current++; };
  }, [loadPage]);

  function handlePageChange(target: number) {
    setPageLoading(true);
    setRowError(null);
    loadPage(target);
  }

  useEffect(() => {
    let cancelled = false;
    getTeamPlayers()
      .then((data) => { if (!cancelled) setPlayers(data); })
      .catch(() => { if (!cancelled) setPlayersError(true); })
      .finally(() => { if (!cancelled) setPlayersLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleReview(id: number, action: ReviewAction) {
    setBusy({ id, action });
    setRowError(null);
    try {
      if (action === "approve") {
        const approved = await approveTopUp(id);
        // Approval credits both the team fund and the player's balance, so reflect it without refetching
        setFundBalance((prev) => (prev === null ? prev : prev + approved.amount));
        setPlayers((prev) =>
          prev.map((p) => (p.userId === approved.userId ? { ...p, balance: p.balance + approved.amount } : p))
        );
      } else {
        await rejectTopUp(id);
      }
      // Reload the page so the next request moves up and the totals stay right
      setPageLoading(true);
      await loadPage(page);
    } catch (err) {
      // 409: already reviewed elsewhere, so it's no longer pending
      if (isAxiosError(err) && err.response?.status === 409) {
        setPageLoading(true);
        await loadPage(page);
      } else {
        setRowError({ id, message: `Failed to ${action}. Please try again.` });
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col">
      <header className="flex items-center gap-2 px-5 py-3.5 bg-white border-b border-[#EAEAEA] sticky top-0 z-40">
        <button
          type="button"
          onClick={() => navigate(`/${teamId}/manage`)}
          className="flex items-center gap-1.5 text-[#111111] text-sm font-medium px-3 py-1.5 -ml-3 rounded-[8px] hover:bg-[#F7F6F3] transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M8 2L3.5 6.5 8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Manage Team
        </button>
        <h1 className="ml-auto text-[#111111] text-sm font-semibold">Fund Management</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-10 w-full max-w-lg mx-auto space-y-3">
        <div className="fade-in-up" style={{ animationDelay: "0ms" }}>
          <TeamFundCard amount={fundBalance} loading={fundLoading} error={fundError} />
        </div>

        <div className="fade-in-up" style={{ animationDelay: "40ms" }}>
          <PendingRequestsCard
            requests={requests}
            loading={loading}
            loadError={loadError}
            pageLoading={pageLoading}
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            busy={busy}
            rowError={rowError}
            onReview={handleReview}
          />
        </div>

        <section className="fade-in-up pt-3" style={{ animationDelay: "80ms" }}>
          <p className="text-[#787774] text-xs font-medium uppercase tracking-[0.05em] mb-3 px-1">
            Players{!playersLoading && players.length > 0 && ` (${players.length})`}
          </p>
          {playersLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[74px] rounded-[12px] bg-white border border-[#EAEAEA] animate-pulse" />
              ))}
            </div>
          ) : playersError ? (
            <div className="rounded-[12px] bg-white border border-[#EAEAEA] p-4">
              <p className="text-[#787774] text-sm">Player list unavailable right now</p>
            </div>
          ) : players.length === 0 ? (
            <div className="rounded-[12px] bg-white border border-[#EAEAEA] p-4">
              <p className="text-[#787774] text-sm">No players yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {players.map((player, i) => (
                <div key={player.userId} className="fade-in-up" style={{ animationDelay: `${120 + i * 40}ms` }}>
                  <PlayerCard player={player} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

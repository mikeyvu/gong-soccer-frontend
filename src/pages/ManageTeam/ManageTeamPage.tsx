import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTeamFundBalance } from "@/services/teamService";
import TeamFundCard from "./components/TeamFundCard";

export default function ManageTeamPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [fundBalance, setFundBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getTeamFundBalance()
      .then((data) => { if (!cancelled) setFundBalance(data.fundBalance); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col">
      <header className="flex items-center gap-2 px-5 py-3.5 bg-white border-b border-[#EAEAEA] sticky top-0 z-40">
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
        <h1 className="ml-auto text-[#111111] text-sm font-semibold">Manage Team</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-10 w-full max-w-lg mx-auto space-y-3">
        <div className="fade-in-up" style={{ animationDelay: "0ms" }}>
          <TeamFundCard
            amount={fundBalance}
            loading={loading}
            error={error}
            onManage={() => navigate(`/${teamId}/manage/fund`)}
          />
        </div>
      </main>
    </div>
  );
}

import api from "../shared/services/api";
import type { TeamFundBalance, TeamPlayer } from "@/types";

// TODO: endpoint is planned — the backend has TeamEntity.fundBalance but doesn't expose it yet.
// Captain-scoped and single-team for now (team comes from the token); move to /teams/{teamId}/fund-balance when users can belong to more than one team.
export const getTeamFundBalance = async (): Promise<TeamFundBalance> => {
    const res = await api.get<TeamFundBalance>("/captain/team/fund-balance");
    return res.data;
};

// TODO: endpoint is planned — no backend endpoint lists team members yet.
// Captain-scoped and single-team for now; move to /teams/{teamId}/players when users can belong to more than one team.
export const getTeamPlayers = async (): Promise<TeamPlayer[]> => {
    const res = await api.get<TeamPlayer[]>("/captain/team/players");
    return res.data;
};

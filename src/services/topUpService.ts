import api from "../shared/services/api";
import type { TopUpRequest } from "@/types";

// TODO: single-team for now — move to /teams/{teamId}/top-ups when users can belong to more than one team.

export const createTopUp = async (amount: number): Promise<TopUpRequest> => {
    const res = await api.post<TopUpRequest>("/user/top-ups", { amount });
    return res.data;
};

export const getTopUps = async (): Promise<TopUpRequest[]> => {
    const res = await api.get<TopUpRequest[]>("/user/top-ups");
    return res.data;
};

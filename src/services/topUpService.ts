import api from "../shared/services/api";
import type { TopUpRequest, CaptainTopUpRequest, PageResponse } from "@/types";

// TODO: single-team for now — move to /teams/{teamId}/top-ups when users can belong to more than one team.

export const createTopUp = async (amount: number): Promise<TopUpRequest> => {
    const res = await api.post<TopUpRequest>("/user/top-ups", { amount });
    return res.data;
};

export const getTopUps = async (): Promise<TopUpRequest[]> => {
    const res = await api.get<TopUpRequest[]>("/user/top-ups");
    return res.data;
};

// Captain side: review all players' requests
export const getPendingTopUps = async (page: number, size = 5): Promise<PageResponse<CaptainTopUpRequest>> => {
    const res = await api.get<PageResponse<CaptainTopUpRequest>>("/captain/top-ups", {
        params: { status: "PENDING", page, size },
    });
    return res.data;
};

export const approveTopUp = async (id: number): Promise<CaptainTopUpRequest> => {
    const res = await api.post<CaptainTopUpRequest>(`/captain/top-ups/${id}/approve`);
    return res.data;
};

export const rejectTopUp = async (id: number): Promise<CaptainTopUpRequest> => {
    const res = await api.post<CaptainTopUpRequest>(`/captain/top-ups/${id}/reject`);
    return res.data;
};

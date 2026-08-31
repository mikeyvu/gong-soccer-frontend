import api from "../shared/services/api";
import type { UserProfile, UserBalance } from "@/types";

interface CompleteProfileData {
    fullName: string;
    phone?: string;
    dateOfBirth?: string;
}

export const completeProfile = async (data: CompleteProfileData, avatar?: File): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    if (data.phone) formData.append("phone", data.phone);
    if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);
    if (avatar) formData.append("avatar", avatar);
    const res = await api.post<UserProfile>("/user/profile", formData);
    return res.data;
};

export const getUserBalance = async (): Promise<UserBalance> => {
    const res = await api.get<UserBalance>("/user/balance");
    return res.data;
};


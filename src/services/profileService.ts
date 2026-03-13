import api from "../shared/services/api";

interface CompleteProfileData {
    fullName: string;
    phone?: string;
    age?: number;
}

export const completeProfile = async (data: CompleteProfileData) => {
    const res = await api.post("/profile", data);
    return res.data;
};


import api from "../shared/services/api";

interface SignUpData {
    email: string;
    password: string;
}

interface verifyEmailData {
    email: string;
    code: string;
}

export const signUp = async (data: SignUpData) => {
    const res = await api.post("/auth/signup", data);
    return res.data;
};

export const verifyEmail = async(data: verifyEmailData) => {
    const res = await api.post("/auth/verify-email", data);
    return res.data;
};
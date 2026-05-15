import api from "../shared/services/api";

interface SignUpData {
    email: string;
    password: string;
}

interface VerifyEmailData {
    email: string;
    verificationCode: string;
}

interface LoginData {
    email: string;
    password: string;
}

export const signUp = async (data: SignUpData) => {
    const res = await api.post("/auth/signup", data);
    return res.data;
};

export const verifyEmail = async(data: VerifyEmailData) => {
    const res = await api.post("/auth/verify", data);
    return res.data;
};

export const login = async(data: LoginData) => {
    const res = await api.post("/auth/login", data);
    return res.data;
};

export const resendVerification = async (email: string) => {
    const res = await api.post("/auth/resend-verification", { email });
    return res.data;
};
import api from "../utils/api";

export const getRefresh = async () => {
    const { data } = await api.get("/auth/refresh");

    return data;
};


export const getProfile = async () => {
    const { data } = await api.get("/auth/me");

    return data;
};
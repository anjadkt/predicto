import api from "../utils/api";

export const getRefresh = async () => {
    const { data } = await api.get("/auth/refresh");

    return data.response;
};


export const getProfile = async () => {
    const { data } = await api.get("/auth/me");

    return data.response;
};

export const logoutUser = async () => {
    await api.get("/auth/logout");
};
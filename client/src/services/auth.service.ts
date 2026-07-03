import api from "../utils/api";

export const getRefresh = async () => {
    const { data } = await api.get("/auth/refresh");

    return data.response;
};

export const loginUser = async (
    payload: {
        number: string,
        password: string
    }
) => {
    const { data } = await api.post("/auth/login", payload);

    return data.response;
}

export const getProfile = async () => {
    const { data } = await api.get("/auth/me");

    return data.response;
};

export const logoutUser = async () => {
    await api.get("/auth/logout");
};

export const registerUser = async (payload: {
    name: string,
    number: string,
    password: string,
    avatar: string
}) => {
    const { data } = await api.post("/auth/register", payload);

    return data.response;
}
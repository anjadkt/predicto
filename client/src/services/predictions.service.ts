import api from "../utils/api";


export const getPredictions = async () => {
  
    const { data } = await api.get("/predictions");

    return data.response;
};
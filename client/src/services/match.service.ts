import api from "../utils/api"

export const getMatches = async () => {

  const { data } = await api.get("/matches");

  return data.response ;
}

export const getMatchPredictors = async (matchId:string) => {

  const { data } = await api.get(`/predictions/match/${matchId}`);

  return data.response ;
}
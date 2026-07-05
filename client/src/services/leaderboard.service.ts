import api from "../utils/api"


export const getLeaderboardData = async () => {

  const { data } = await api.get("/leaderboard");

  return data.response ;
}
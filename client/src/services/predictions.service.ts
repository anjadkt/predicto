import api from "../utils/api";


export const getPredictions = async () => {
  
    const { data } = await api.get("/predictions");

    return data.response;
};


export const createPrediction = async (predictionId:string, payload:{
    matchId: string,
    predictedScores: {
        homeTeam: number,
        awayTeam: number
    }
}[]
) => {

    const {data} = await api.post(`/predictions/${predictionId}/predict`,{predictions : payload});

    return data.response ;
}

export const updatePrediction = async (predictionId:string, payload:{
    matchId: string,
    predictedScores: {
        homeTeam: number,
        awayTeam: number
    }
}[]) => {

    const {data} = await api.patch(`/predictions/${predictionId}/predict`,{predictions : payload});

    return data.response ;
}


export const getNewMatches = async () => {
    
    const { data } = await api.get("/matches/new");

    return data.response ;
}

export const addPrediction = async ( payload : { matchId : string , apiMatchId : number}[]) => {

    const { data } = await api.post("/predictions",{matches : payload});

    return data.response ;
}
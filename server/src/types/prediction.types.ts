export type PredictionPayload = {
    matches: {
        _id: string,
        apiMatchId: string
    }[],
    closesAt: string
}


export type PredictedPayload = {
    matchId: string,
    predictedScores: {
        homeTeam: number,
        awayTeam: number
    }
}[]
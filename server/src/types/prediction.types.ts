export type PredictionPayload = {
    matches: {
        matchId: string,
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
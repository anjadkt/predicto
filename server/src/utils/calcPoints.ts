import { MatchScore } from "../types/matchs.types"

export const calculatePoints = (
    predictedScores: { homeTeam: number, awayTeam: number },
    score: MatchScore
) => {

    const matchScore = score.duration === "PENALTY_SHOOTOUT" ? score.extraTime : score.fullTime;

    return (
        predictedScores.homeTeam === matchScore.home &&
        predictedScores.awayTeam === matchScore.away
    ) ? 1 : 0;


}
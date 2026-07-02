import { MatchScore } from "../types/matchs.types"

export const calculatePoints = (
    predictedScores: { homeTeam: number, awayTeam: number },
    score: MatchScore
) => {

    const calcExtraTime = () => {
        return {
            home: (score.regularTime.home ?? 0) + (score.extraTime?.home ?? 0),
            away: (score.regularTime.away ?? 0) + (score.extraTime?.away ?? 0)
        }
    }

    const matchScore =
        score.duration === "PENALTY_SHOOTOUT"
            ? calcExtraTime()
            : score.fullTime;

    console.log("final score calculated")

    return (
        predictedScores.homeTeam === matchScore.home &&
        predictedScores.awayTeam === matchScore.away
    ) ? 1 : 0;


}
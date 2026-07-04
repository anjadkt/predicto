import { MatchScore } from "../types/matchs.types";

export const calculateChance = (
    predictedScores: { homeTeam: number; awayTeam: number },
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

    return (
        matchScore.home !== null &&
        matchScore.away !== null &&
        matchScore.home <= predictedScores.homeTeam &&
        matchScore.away <= predictedScores.awayTeam
    ) ? 1 : 0;
};
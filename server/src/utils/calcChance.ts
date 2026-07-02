import { MatchScore } from "../types/matchs.types";

export const calculateChance = (
    predictedScores: { homeTeam: number; awayTeam: number },
    score: MatchScore
) => {
    const matchScore =
        score.duration === "PENALTY_SHOOTOUT"
            ? score.extraTime
            : score.fullTime;

    return (
        matchScore.home !== null &&
        matchScore.away !== null &&
        matchScore.home <= predictedScores.homeTeam &&
        matchScore.away <= predictedScores.awayTeam
    ) ? 1 : 0;
};
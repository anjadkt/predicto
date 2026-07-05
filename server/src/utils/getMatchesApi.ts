import { updateForecast } from "../services/match.service";
import { api } from "./api";
import { formatIsoDate } from "./formatDate";

const MATCH_DATE_UPTO = 3 * 24 * 60 * 60 * 1000
const MATCH_DATE_FROM = 1 * 24 * 60 * 60 * 1000;

export const getMatchesFromApi = async (matchIds: any) => {

    const dateFrom = formatIsoDate(new Date(new Date().getTime() - MATCH_DATE_FROM));
    const dateTo = formatIsoDate(new Date(new Date().getTime() + MATCH_DATE_UPTO));

    const url = `/v4/competitions/WC/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;

    const { data } = await api.get(url);

    const matchesNewData = [];

    for (const match of data.matches) {

        const TERMINAL_STATUSES = [
            "FINISHED",
            "POSTPONED",
            "SUSPENDED",
            "CANCELLED",
        ];

        const MATCH_STATUSES = new Set([
            "SCHEDULED",
            "TIMED",
            "IN_PLAY",
            "PAUSED",
            "FINISHED",
            "POSTPONED",
            "SUSPENDED",
            "CANCELLED",
            "LIVE",
        ]);

        const existingMatch = matchIds.get(match.id);

        if(!MATCH_STATUSES.has(match.status)) continue ; 

        const becameFinished =
            existingMatch?.status &&
            !TERMINAL_STATUSES.includes(existingMatch.status) &&
            match.status === "FINISHED";

        const scoreChanged =
            existingMatch?.score?.fullTime?.home !== match.score.fullTime.home ||
            existingMatch?.score?.fullTime?.away !== match.score.fullTime.away;

        const isLive = ["IN_PLAY", "PAUSED", "LIVE"].includes(match.status);

        if (existingMatch) {

            const matchData = {
                matchId: existingMatch._id,
                score: match.score,
                apiMatchId: match.id,
            };

            if (becameFinished) {
                await updateForecast(matchData, "FINISHED");
            } else if (isLive && scoreChanged) {
                await updateForecast(matchData, "LIVE");
            }
        }

        if (
            !existingMatch ||
            existingMatch.status !== match.status ||
            scoreChanged
        ) {
            matchesNewData.push(match);
        }
    }

    return matchesNewData;
};
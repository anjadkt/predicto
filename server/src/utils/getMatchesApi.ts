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

    const matchesNewData = data.matches.filter((match: any) => {

        const TERMINAL_STATUSES = [
            "FINISHED",
            "POSTPONED",
            "SUSPENDED",
            "CANCELLED",
        ];

        const existingMatch = matchIds.get(match.id);

        if (existingMatch?.status && !TERMINAL_STATUSES.includes(existingMatch.status) && match.status === "FINISHED") {
            updateForecast({ matchId: existingMatch._id, score: match.score, apiMatchId: match.id });
        }

        if (!existingMatch) {
            return !TERMINAL_STATUSES.includes(match.status);
        }

        return existingMatch.status !== match.status || ["IN_PLAY", "PAUSED", "LIVE"].includes(existingMatch.status || "");
    });

    return matchesNewData;
};
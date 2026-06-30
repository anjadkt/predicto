import { api } from "./api";
import { formatIsoDate } from "./formatDate";

const MATCH_DATE_UPTO = 2 * 24 * 60 * 60 * 1000

export const getMatchesFromApi = async (matchIds: Map<number, { _id: string, status: string }>) => {

    const competition = "WC"
    const dateFrom = formatIsoDate(new Date())
    const dateTo = formatIsoDate(new Date(new Date().getTime() + MATCH_DATE_UPTO));

    const url = `/v4/competitions/${competition}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;

    const { data } = await api.get(url);

    const matchesNewData = data.matches.filter((match: any) => {

        if (!matchIds.has(match.id)) {
            return true;
        }

        const existingMatch = matchIds.get(match.id);
        if (!existingMatch) return true;
        return existingMatch.status !== match.status || ["IN_PLAY", "PAUSED", "LIVE"].includes(existingMatch.status);
    });

    return matchesNewData;
};
type MatchStatus = "SCHEDULED" | "TIMED" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "SUSPENDED" | "CANCELLED" | "LIVE"

export type MatchQuery = {
    competition: string;
    dateFrom: string;
    dateTo: string;
    status: MatchStatus

}


export type MatchData = {
    apiMatchId: number;
    istDate: string;
    date: string;
    time: string;
    homeTeam: {
        id: number;
        name: string;
        shortName: string;
        tla: string;
        crest: string;
    };
    awayTeam: {
        id: number;
        name: string;
        shortName: string;
        tla: string;
        crest: string;
    };
    score: {
        winner: string | null;
        fullTime: {
            home: null | number;
            away: null | number;
        },
        halfTime: {
            home: null | number;
            away: null | number;
        }
    },
    status: MatchStatus,
}
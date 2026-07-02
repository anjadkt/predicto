type MatchStatus = "SCHEDULED" | "TIMED" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "SUSPENDED" | "CANCELLED" | "LIVE"

export type MatchQuery = {
    dateFrom: string;
    dateTo: string;
    status: MatchStatus

}

export type MatchScore = {
    winner: string | null,
    duration: "REGULAR" | "EXTRA_TIME" | "PENALTY_SHOOTOUT",
    fullTime: {
        home: null | number,
        away: null | number
    },
    halfTime: {
        home: null | number,
        away: null | number
    },
    regularTime: {
        home: null | number,
        away: null | number
    },
    extraTime: {
        home: null | number,
        away: null | number
    },
    penalties: {
        home: null | number,
        away: null | number
    }
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
    score: MatchScore,
    status: MatchStatus,
}
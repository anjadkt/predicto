export type  Team  = {
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export type  PredictionMatch = {
  matchId: string;
  apiMatchId: number;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
}

export type PredictionStatus = "LIVE" | "COMPLETED";

export type  LivePrediction = {
  _id: string;
  matches: PredictionMatch[];
  closesAt: string;
  status: PredictionStatus;
}


export type PredictionResultStatus = "RIGHT" | "WRONG" | "MAYBE";

export type MatchWinner =
  | "HOME_TEAM"
  | "AWAY_TEAM"
  | "DRAW"
  | null;

export type MatchDuration =
  | "REGULAR"
  | "EXTRA_TIME"
  | "PENALTY_SHOOTOUT";

export type ScoreTime = {
  home: number | null;
  away: number | null;
}

export type MatchScore = {
  _id: string;
  winner: MatchWinner;
  duration: MatchDuration;
  fullTime: ScoreTime;
  halfTime: ScoreTime;
  regularTime: ScoreTime;
  extraTime: ScoreTime;
  penalties: ScoreTime;
}

type MatchStatus = "SCHEDULED" | "TIMED" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "SUSPENDED" | "CANCELLED" | "LIVE"

export type Match = {
  _id: string;
  homeTeam: Team;
  awayTeam: Team;
  score: MatchScore;
  utcDate : string;
  time:string;
  status : MatchStatus
}

export type PredictedScores = {
  homeTeam: number;
  awayTeam: number;
}

export type PredictionResult = {
  points?: number;
  status: PredictionResultStatus;
}

export type UserMatchPrediction = {
  _id: string;
  matchId: Match;
  predictedScores: PredictedScores;
  results: PredictionResult;
}

export type UserPrediction = {
  _id: string;
  predictionId: {
    _id : string,
    closesAt : string
  };
  predictorId: string;
  totalPoints: number;
  isEvaluated: boolean;
  predictions: UserMatchPrediction[];
  createdAt: string;
}


export type ModalPayload = {
  isUpdate : boolean;
  matches : {
    matchId : string,
    predictedScores : {
      homeTeam : number;
      awayTeam : number
    },
    homeTeam : Team,
    awayTeam : Team
  }[],
  predictionId : string;
}
  

export type CreateMatch = {
  _id: string;
  apiMatchId: number;
  awayTeam: Team;
  date: string;
  homeTeam: Team;
  status: string;
  time: string;
  utcDate: string;
}
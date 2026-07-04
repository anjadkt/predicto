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

export type Match = {
  _id: string;
  homeTeam: Team;
  awayTeam: Team;
  score: MatchScore;
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
  predictionId: string;
  predictorId: string;
  totalPoints: number;
  isEvaluated: boolean;
  predictions: UserMatchPrediction[];
  createdAt: string;
}
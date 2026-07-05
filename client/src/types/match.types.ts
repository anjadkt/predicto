export type PredictionStatus = "RIGHT" | "WRONG" | "MAYBE";

export type Predictor = {
  _id: string;
  name: string;
  avatar : string;
}

export type MatchPrediction = {
  homeTeam: number;
  awayTeam: number;
}

export type PredictorResult = {
  predictor: Predictor;
  points: number;
  prediction: MatchPrediction;
}

export type MatchPredictionResults = {
  count: number;
  predictions: PredictorResult[];
  status: PredictionStatus;
}


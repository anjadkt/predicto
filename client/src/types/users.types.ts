export type PredictorUser = {
  _id: string;
  name: string;
  avatar?: string;
  number: string;
  isVerified: boolean;
  role: "predictor";
  totalPoints: number;
}

export type PredictorsResponse = {
  verified: PredictorUser[];
  unverified: PredictorUser[];
}
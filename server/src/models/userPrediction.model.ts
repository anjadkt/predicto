import { model, Schema, Types } from "mongoose";


const predictSchema = new Schema({
    matchId: {
        type: Types.ObjectId,
        ref: "Match",
        required: true
    },
    predictedScores: {
        homeTeam: {
            type: Number,
            required: true,
            default: null
        },
        awayTeam: {
            type: Number,
            required: true,
            default: null
        }
    }
})

const userPredictionSchema = new Schema({
    predictionId: {
        type: Types.ObjectId,
        ref: "Prediction",
        required: true
    },

    predictorId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    predictions: [predictSchema],

    correctPredictions: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

userPredictionSchema.index(
    {
        predictionId: 1,
        predictorId: 1
    },
    {
        unique: true
    }
);

export const UserPrediction = model("UserPrediction", userPredictionSchema);
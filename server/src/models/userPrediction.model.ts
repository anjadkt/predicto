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
            required: true
        },
        awayTeam: {
            type: Number,
            required: true
        }
    },
    results: {
        points: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["MAYBE", "WRONG", "RIGHT"],
            default: "MAYBE"
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

    totalPoints: {
        type: Number,
        default: 0
    },

    predictions: [predictSchema]

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
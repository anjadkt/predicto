import { Schema, model, Types } from "mongoose";
import { teamSchema } from "./match.model";


const matchPredictionSchema = new Schema({
    matchId: {
        type: Types.ObjectId,
        ref: "Match"
    },
    apiMatchId: {
        type: Number,
        required: true
    },
    awayTeam: teamSchema,
    homeTeam: teamSchema,
    date: String,
    time: String,
    utcDate: Date
})

const preductionSchema = new Schema({

    matches: [matchPredictionSchema],

    closesAt: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["LIVE", "COMPLETED"],
        default: "LIVE"
    }

}, { timestamps: true });


export const Prediction = model("Prediction", preductionSchema);
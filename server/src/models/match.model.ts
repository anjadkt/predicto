import { model, Schema, Types } from "mongoose";


export const teamSchema = new Schema({
    id: Number,
    name: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        required: true
    },
    tla: {
        type: String,
        required: true
    },
    crest: {
        type: String,
        required: true
    },
});

const scoreSchema = new Schema({
    winner: {
        type: String,
        enum: ["HOME_TEAM", "AWAY_TEAM", null],
        default: null
    },
    duration: {
        type: String,
        enum: ["REGULAR", "EXTRA_TIME", "PENALTY_SHOOTOUT"],
        default: "REGULAR"
    },
    fullTime: {
        home: {
            type: Number,
            default: null
        },
        away: {
            type: Number,
            default: null
        }
    },
    halfTime: {
        home: {
            type: Number,
            default: null
        },
        away: {
            type: Number,
            default: null
        }
    },
    regularTime: {
        home: {
            type: Number,
            default: null
        },
        away: {
            type: Number,
            default: null
        }
    },
    extraTime: {
        home: {
            type: Number,
            default: null
        },
        away: {
            type: Number,
            default: null
        }
    },
    penalties: {
        home: {
            type: Number,
            default: null
        },
        away: {
            type: Number,
            default: null
        }
    }
})

const matchSchema = new Schema({
    apiMatchId: {
        type: Number,
        required: true,
        unique: true
    },
    utcDate: {
        type: Date,
        required: true
    },
    istDate: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    homeTeam: teamSchema,
    awayTeam: teamSchema,
    score: scoreSchema,
    status: {
        type: String,
        required: true,
        enum: [
            "SCHEDULED",
            "TIMED",
            "IN_PLAY",
            "PAUSED",
            "FINISHED",
            "POSTPONED",
            "SUSPENDED",
            "CANCELLED",
            "LIVE"
        ],
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    predictionId: {
        type: Types.ObjectId,
        ref: "Prediction"
    }
}, {
    timestamps: true
});


export const Match = model("Match", matchSchema);
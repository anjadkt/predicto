import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    avatar: { type: String },
    number: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["predictor", "creator"], default: "predictor" },
    totalPoints: { type: Number, default: 0 },
    refreshToken: { type: String }

}, { timestamps: true });


export const User = model("User", userSchema);
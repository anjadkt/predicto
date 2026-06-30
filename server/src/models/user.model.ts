import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["predictor", "creator"], default: "predictor" },
    points: { type: Number, default: 0 },
    refreshToken: { type: String },
});


export const User = model("User", userSchema);
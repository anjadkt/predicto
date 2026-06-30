import axios from "axios";
import { env } from "../config/env";

export const api = axios.create(
    {
        baseURL: env.FOOTBALL_API_URL,
        headers: {
            "X-Auth-Token": env.FOOTBALL_API_SECRET
        }
    }
)
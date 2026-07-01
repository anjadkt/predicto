import { Match } from "../models/match.model";
import { MatchData, MatchQuery } from "../types/matchs.types";
import { formatDate, formatTime, utcToIst } from "../utils/formatDate";
import { getMatchesFromApi } from "../utils/getMatchesApi";
import AppError from "../utils/AppError";

export const sync = async () => {

    const matchesLive = await Match
        .find({ status: { $nin: ["FINISHED", "POSTPONED", "SUSPENDED", "CANCELLED"] } })
        .select("_id apiMatchId status")
        .lean();

    const matchIds = new Map();

    if (matchesLive.length > 0) {
        matchesLive.forEach((match) => {
            matchIds.set(match.apiMatchId, {
                _id: match._id,
                status: match.status
            });
        });
    }

    const matchesNew = await getMatchesFromApi(matchIds);

    for (const match of matchesNew) {

        await Match.updateOne(
            { apiMatchId: match.id },
            {
                $set: {
                    status: match.status,
                    score: match.score,
                },

                $setOnInsert: {
                    apiMatchId: match.id,
                    homeTeam: match.homeTeam,
                    awayTeam: match.awayTeam,
                    utcDate: match.utcDate,
                    istDate: utcToIst(match.utcDate),
                    date: formatDate(match.utcDate),
                    time: formatTime(match.utcDate),
                },
            },
            {
                upsert: true
            }
        );
    }
}

export const newMatches = async () => {

    const matches = await Match
        .find({ status: { $in: ["SCHEDULED", "TIMED"] } })
        .select("-__v  -score")
        .sort({ utcDate: 1 })
        .lean();

    return matches;

}

export const matches = async (limit: number) => {

    const matches = await Match.aggregate([
        {
            $match: {
                status: { $in: ["IN_PLAY", "PAUSED", "FINISHED"] }
            }
        },
        {
            $addFields: {
                statusPriority: {
                    $switch: {
                        branches: [
                            {
                                case: {
                                    $in: ["$status", ["LIVE", "IN_PLAY", "PAUSED"]]
                                },
                                then: 1
                            },
                            { case: { $eq: ["$status", "FINISHED"] }, then: 2 }
                        ],
                        default: 99,
                    },
                },
            },
        },
        {
            $sort: {
                statusPriority: 1,
                utcDate: -1,
            },
        },
        {
            $project: {
                __v: 0,
                statusPriority: 0,
            },
        },
        {
            $limit: query.limit,
        },
    ]);
    return matches;
}
import type { MatchScore } from "../types/prediction.types";

const getActualScores = ((score:MatchScore) => {

    const { duration, fullTime, regularTime, extraTime } = score;

    if (fullTime.home == null || fullTime.away == null) {
      return { home: "-", away: "-" };
    }

    if (duration === "PENALTY_SHOOTOUT") {
      if (
        regularTime.home == null ||
        regularTime.away == null ||
        extraTime.home == null ||
        extraTime.away == null
      ) {
        return { home: "-", away: "-" };
      }
      return {
        home: regularTime.home + extraTime.home,
        away: regularTime.away + extraTime.away,
      };
    }
    return fullTime;
  });

  export default getActualScores
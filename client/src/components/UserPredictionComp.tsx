import { Swords, CheckCircle2, XCircle, AlertCircle, Edit2 } from "lucide-react";
import type { UserMatchPrediction, UserPrediction } from "../types/prediction.types";

export default function UserPredictionComp({ prediction }: { prediction: UserPrediction }) {
  
  const closesAtTime = prediction.predictionId?.closesAt;
  const isUpdatable = closesAtTime ? new Date() < new Date(closesAtTime) : false;

  return (
    <div className="bg-transparent min-w-[270px] rounded-[24px] p-4 md:p-5 border border-gray-200 flex flex-col gap-4 w-full">

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
        {prediction.predictions.map((v) => (
          <MatchComp match={v} key={v._id} />
        ))}
      </div>

      {/* Update Button */}
      {isUpdatable && (
        <div className="pt-2 flex justify-center border-t border-gray-200/60 mt-1">
          <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-900  active:scale-[0.98] text-white text-sm font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all duration-200">
            <Edit2 className="w-4 h-4" />
            Update Prediction
          </button>
        </div>
      )}

    </div>
  );
}

function MatchComp({ match }: { match: UserMatchPrediction }) {
  
  const actualScores = (() => {
    const { duration, fullTime, regularTime, extraTime } = match.matchId.score;

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
  })();

  const getMatchTimelineStatus = (status: string) => {

    const s = status.toUpperCase();

    if (["SCHEDULED", "TIMED"].includes(s)) {
      return { text: "Waiting", className: "bg-slate-100 text-slate-600 border-slate-200" };
    }

    if (["IN_PLAY", "PAUSED", "LIVE"].includes(s)) {
      return { text: "Ongoing", className: "bg-red-50 text-red-600 border-red-200 animate-pulse" };
    }

    if (s === "FINISHED") {
      return { text: "Over", className: "bg-gray-100 text-gray-500 border-gray-200" };
    }

    return { text: status, className: "bg-gray-100 text-gray-500 border-gray-200" };

  };

  const currentTimeline = getMatchTimelineStatus(match.matchId.status);

  const genStatus: Record<string, React.ReactNode> = {

    MAYBE: (
      <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
        <AlertCircle className="w-3.5 h-3.5" /> Chance
      </div>
    ),
    WRONG: (
      <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
        <XCircle className="w-3.5 h-3.5" /> Wrong
      </div>
    ),
    RIGHT: (
      <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
        <CheckCircle2 className="w-3.5 h-3.5" /> Right
      </div>
    )

  };

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm p-4 w-full transition-shadow hover:shadow-md">
      
      {/* Sub-header: Match Status Line */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-md border tracking-wider ${currentTimeline.className}`}>
          {currentTimeline.text}
        </span>
        {/* Points Display */}
        <div className="text-right flex flex-col items-end">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Points Earned</span>
          <span className={` font-black ${ match.results.points ? "text-green-600 animate-bounce text-lg" : "text-gray-900 text-sm"}  leading-none`}>+{match.results.points || 0}</span>
        </div>
      </div>

      {/* Grid Match Section */}
      <div className="flex items-center justify-between gap-2 px-1 mb-2">
        
        {/* Home Team */}
        <div className="flex flex-col items-center flex-1">
          <img 
            src={match.matchId.homeTeam.crest} 
            alt={match.matchId.homeTeam.name} 
            className="w-8 h-8 object-contain mb-1.5"
          />
          <span className="font-bold text-gray-900 text-[12px] tracking-tight text-center line-clamp-1">
            {match.matchId.homeTeam.shortName}
          </span>
        </div>

        {/* Prediction Display Bubble - Darkened for visibility */}
        <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl flex items-center justify-center gap-3 shadow-sm">
          <span className="font-black text-base text-gray-900 tabular-nums">{match.predictedScores.homeTeam}</span>
          <Swords className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="font-black text-base text-gray-900 tabular-nums">{match.predictedScores.awayTeam}</span>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center flex-1">
          <img 
            src={match.matchId.awayTeam.crest} 
            alt={match.matchId.awayTeam.name} 
            className="w-8 h-8 object-contain mb-1.5"
          />
          <span className="font-bold text-gray-900 text-[12px] tracking-tight text-center line-clamp-1">
            {match.matchId.awayTeam.shortName}
          </span>
        </div>

      </div>

      {/* Actual Scores vs Results Badge */}
      <div className="pt-2 border-t border-dashed border-gray-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Live Score:</span>
          <div className="font-black text-gray-900 text-sm tracking-widest tabular-nums">
            {actualScores.home} : {actualScores.away}
          </div>
        </div>

        {/* Prediction Accuracy Badge */}
        <div>
          {genStatus[match.results.status.toUpperCase()] || null}
        </div>
      </div>

    </div>
  );
}
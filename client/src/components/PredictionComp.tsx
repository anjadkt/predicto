import type { LivePrediction, PredictionMatch  } from "../types/prediction.types";
import { Swords ,Clock, Activity  } from 'lucide-react';
import { formatPredictionCloseTime } from "../utils/FormatDate";

export default function PredictionComp(
  { prediction, handleCreate }: 
  { prediction: LivePrediction, handleCreate : (data:LivePrediction) => void}
) {

  const closesAtTime = prediction.closesAt;
  const isClosed = closesAtTime ? new Date() < new Date(closesAtTime) : false;

  const statusUpper = prediction.status.toUpperCase();
  const isLive = statusUpper === 'LIVE';
  const isCompleted = statusUpper === 'COMPLETED';

  return (
    <div className={`bg-white min-w-[270px] rounded-2xl  p-3 border border-gray-100 flex flex-col gap-3 w-full transition-all 
      ${isCompleted 
        ? "opacity-60 shadow-none pointer-events-none" 
        : "shadow-sm hover:shadow-md"
      }`}
    >
      
      {/* Header Info */}
      <div className={`flex items-center ${isLive ? "justify-between" : "justify-center"}  border-b border-gray-50/80 pb-2`}>
        {/* Status Badge */}
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[12px] font-ebold tracking-wide uppercase ${
          isLive ? 'bg-red-50 text-red-600' : isCompleted ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-black'
        }`}>
          {isLive && <Activity className="w-3 h-3 animate-pulse" />}
          {prediction.status}
        </div>
        
        {/* Closes At */}
        { isLive && (
          <div className="flex items-center gap-1 text-gray-400 text-[11px] font-medium">
            <Clock className="w-3 h-3" />
            <span>Closes: {formatPredictionCloseTime(prediction.closesAt)}</span>
          </div>)
        }
      </div>

      {/* Matches Container */}
      <div className="flex flex-wrap gap-2 items-center justify-start w-full">
        {prediction.matches.map((v, i) => (
          <MatchComp key={i} match={v} isCompleted={isCompleted} />
        ))}
      </div>

      {/* Action Button */}
      { !isCompleted && isClosed && (
        <button 
          onClick={() => handleCreate(prediction)}
          className="w-full bg-black active:scale-[0.99] text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-sm transition-all duration-150 tracking-wide mt-1">
          Predict Now
        </button>
      )}

    </div>
  );
}


function MatchComp({ match, isCompleted }: { match: PredictionMatch; isCompleted?: boolean }) {
  
  return (
    
    <div className="flex items-center justify-between bg-gray-100/80 px-2.5 py-1.5 rounded-xl border border-gray-100/60 flex-1 min-w-[140px] max-w-full ">
      
      {/* Home Team */}
      <div className="flex flex-col items-center flex-1">
        <img 
          src={match.homeTeam.crest} 
          alt={match.homeTeam.tla} 
          className={`w-6 h-6 object-contain transition-all ${isCompleted ? "grayscale opacity-70" : ""}`} 
        />
        <span className={`font-bold text-[12px] tracking-wide ${isCompleted ? "text-gray-400" : "text-gray-700"}`}>
          {match.homeTeam.shortName}
        </span>
      </div>

      {/* Time / VS */}
      <div className="flex flex-col items-center justify-center px-1 flex-shrink-0">
        <span className={`text-xs font-medium tabular-nums scale-90 ${isCompleted ? "text-gray-400" : "text-gray-700"}`}>
          {match.time}
        </span>
        <Swords className={`w-3 h-3 ${isCompleted ? "text-gray-400" : "text-gray-800"}`} />
      </div>

      {/* Away Team */}
      <div className="flex flex-col items-center flex-1">
        <img 
          src={match.awayTeam.crest} 
          alt={match.awayTeam.tla} 
          className={`w-6 h-6 object-contain transition-all ${isCompleted ? "grayscale opacity-70" : ""}`} 
        />
        <span className={`font-bold text-[12px] tracking-wide ${isCompleted ? "text-gray-400" : "text-gray-700"}`}>
          {match.awayTeam.shortName}
        </span>
      </div>

    </div>
  );
}
import type { Match } from "../types/prediction.types";
import getActualScores from "../utils/getActualScores";

export default function LiveMatch(
  { matches , activeMatchId, setActiveMatchId }: 
  { matches: Match[], activeMatchId : string | null, setActiveMatchId : (id:string) => void }
) {

  const getMatchTimelineStatus = (status: string) => {
    const s = status.toUpperCase();

    if (["IN_PLAY", "PAUSED", "LIVE"].includes(s)) {
      return { text: "LIVE", isLive: true };
    }

    if(["SCHEDULED" , "TIMED"].includes(s)){
      return { text : "COMING", isLive : false}
    }

    if (s === "FINISHED") {
      return { text: "FULL-TIME", isLive: false };
    }

    return { text: s, isLive: false };
  };

  return (
    <div className="w-full bg-slate-900 py-3 mx-2 border border-slate-800/80 shadow-inner">
      <style>{`
        @keyframes moving-underline {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-moving-line {
          animation: moving-underline 1.5s ease-in-out infinite;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto gap-3 pb-2 snap-x hide-scrollbar px-4">
        {matches.map((v) => {

          const score = getActualScores(v.score);
          const statusInfo = getMatchTimelineStatus(v.status);
          const isActive = activeMatchId === v._id;

          return (
            <div
              key={v._id}
              onClick={() => setActiveMatchId(v._id)}
              className={`
                min-w-[180px] sm:min-w-[200px] h-[64px] snap-center cursor-pointer transition-all duration-300 rounded-2xl px-3 flex flex-col justify-center border
                ${
                  isActive
                    ? "bg-gradient-to-br from-emerald-900/90 to-emerald-950 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-inset ring-emerald-500/30 scale-100"
                    : "bg-slate-800/40 border-emerald-400/30 opacity-90 scale-[0.98]"
                }
              `}
            >
              <div className="flex items-center justify-between w-full h-full">
                
                {/* Home Team */}
                <div className="flex flex-col items-center w-[45px]">
                  <img
                    src={v.homeTeam.crest}
                    alt={v.homeTeam.shortName}
                    className={`w-7 h-5 object-cover rounded-[2px] drop-shadow-sm mb-1 transition-opacity ${isActive ? "opacity-100" : "opacity-80"}`}
                  />
                  <div className={`text-[9px] font-bold tracking-wider ${isActive ? "text-emerald-400" : "text-slate-500"}`}>
                    {v.homeTeam.tla}
                  </div>
                </div>

                {/* Score & Status Centerpiece */}
                <div className="flex flex-col items-center justify-center flex-1 px-2">
                  
                  {/* Dynamic Status Text */}
                  <div className="h-4 flex items-center justify-center mb-0.5">
                    {statusInfo.isLive ? (
                      <div className="relative inline-flex flex-col items-center">
                        <span className="text-[8px] font-black uppercase tracking-widest text-red-500 drop-shadow-[0_0_2px_rgba(239,68,68,0.5)]">
                          {statusInfo.text}
                        </span>
                        <div className="absolute -bottom-[2px] left-0 w-full h-[1px] overflow-hidden bg-red-500/20 rounded-full">
                          <div className="w-1/2 h-full bg-red-500 rounded-full animate-moving-line" />
                        </div>
                      </div>
                    ) : (
                      <span className={`text-[8px] font-bold uppercase tracking-widest ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                        {statusInfo.text}
                      </span>
                    )}
                  </div>

                  {/* Scores */}
                  <div className="flex items-center justify-center gap-1.5">
                    <span className={`text-xl font-black tabular-nums tracking-tighter ${isActive ? "text-white drop-shadow-md" : "text-slate-400"}`}>
                      {score.home}
                    </span>
                    <span className={`text-xs font-bold ${isActive ? "text-emerald-500" : "text-slate-600"}`}>:</span>
                    <span className={`text-xl font-black tabular-nums tracking-tighter ${isActive ? "text-white drop-shadow-md" : "text-slate-400"}`}>
                      {score.away}
                    </span>
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center w-[45px]">
                  <img
                    src={v.awayTeam.crest}
                    alt={v.awayTeam.shortName}
                    className={`w-7 h-5 object-cover rounded-[2px] drop-shadow-sm mb-1 transition-opacity ${isActive ? "opacity-100" : "opacity-80"}`}
                  />
                  <div className={`text-[9px] font-bold tracking-wider ${isActive ? "text-emerald-400" : "text-slate-500"}`}>
                    {v.awayTeam.tla}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
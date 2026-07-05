import { useEffect, useState } from "react";
import LiveMatch from "../components/LiveMatchComp";
import type { Match } from "../types/prediction.types";
import { getMatches, getMatchPredictors } from "../services/match.service";
import PageLoading from "../components/PageLoading";
import type { MatchPredictionResults, PredictorResult } from "../types/match.types";
import { Trophy } from "lucide-react";
import UserAvatar from "../hooks/UseAvatar";

function LiveStats () {

  const [ matches , setMatches ] = useState<null | Match[] >(null);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [ predictors , setPredictors ] = useState< MatchPredictionResults[] | null>(null);
  const [isPredictorsLoading, setIsPredictorsLoading] = useState(false);


  useEffect(() => {
    if(matches?.length && activeMatchId){

      const load = async () => {
        setIsPredictorsLoading(true);
        try{
          const data = await getMatchPredictors(activeMatchId);
          setPredictors(data);
        }catch(error){
          console.log("Error while loading predictors",error)
          setPredictors([]);
        } finally {
          setIsPredictorsLoading(false);
        }
      }
      load();

    }
  },[activeMatchId,matches]);

  useEffect(() => {
    const load = async () => {
      try{
        const data = await getMatches();
        setActiveMatchId(data[0]?._id || null)
        setMatches(data);
      }catch(error){
        console.log("Error while loading matches",error);
        setMatches([]);
      }
    }
    load();
  },[]);

  if(!matches || !predictors) return <PageLoading />
  
  const totalParticipants = predictors.reduce((total, group) => total + group.count, 0);

  return(
    <div className="min-h-screen bg-slate-950 text-white">
      <LiveMatch 
        setActiveMatchId={setActiveMatchId}
        activeMatchId={activeMatchId} 
        matches={matches} 
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

        {matches.length === 0 ? (
          <EmptyState
            title="No live matches available"
            message="There are no live or finished matches to show right now."
          />
        ) : isPredictorsLoading || !predictors ? (

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center text-sm font-semibold text-slate-300">
            Loading prediction stats...
          </div>

        ) : totalParticipants === 0 ? (

          <EmptyState
            title="No predictions yet"
            message="No user has participated in this match prediction."
          />
        ) : (
          <div className="space-y-6">

            {
              predictors.map((section) =>(
                <PredictionSection
                  count={section.count}
                  users={section.predictions}
                  status={section.status}
                />
              ))
            }

          </div>
        )}
      </div>
    </div>
  )
}

function PredictionSection({
  count,
  users,
  status,
}: {
  count :number;
  users: PredictorResult[];
  status: "WRONG" | "RIGHT" | "MAYBE";
}) {

  const isPositive = status !== "WRONG";

  const predictionStatus = {
    RIGHT: {
      title: "Correct Predictions",
      className: "text-lg font-black tracking-tight text-emerald-400",
    },
    WRONG: {
      title: "Wrong Predictions",
      className: "text-lg font-black tracking-tight text-red-400",
    },
    MAYBE: {
      title: "Predictions Have Chance",
      className: "text-lg font-black tracking-tight text-amber-400",
    },
  } as const;

  const { title, className } = predictionStatus[status];

  return (

    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-black/10 sm:p-5">
      
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2 className={className}>{title}</h2>
        <div className={`rounded-full px-3 py-1 text-xs font-black ${
          isPositive
            ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/30"
            : "bg-red-400/10 text-red-300 ring-1 ring-red-400/30"
        }`}>
          {count}
        </div>
      </div>

      {users.length ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <PredictionUserCard user={user} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-6 text-center text-sm font-semibold text-slate-400">
          No wrong predictions yet.
        </div>
      )}
    </section>
  );
}

function PredictionUserCard({ user }: { user: PredictorResult }) {

  return (
    <article 
      className={`
        group relative flex items-center justify-between gap-2 rounded-xl p-2.5 pr-4 transition-all duration-200
        ${user.points > 0 
          ? "bg-slate-900/80 border border-emerald-900/30 hover:border-emerald-700/50" 
          : "bg-slate-900/40 border border-slate-800/60 hover:bg-slate-800/60"
        }
      `}
    >
      {/* Left: Avatar & Name */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="relative">
          <UserAvatar
            name={user.predictor.name}
            src={user.predictor.avatar}
            className="h-10 w-10 rounded-full border border-slate-700 object-cover shadow-sm"
          />
          {/* Small status dot indicator */}
          <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 ${user.points > 0 ? 'bg-emerald-500' : 'bg-slate-600'}`} />
        </div>
        
        <div className="flex flex-col min-w-0">
          <h3 className="truncate text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
            {user.predictor.name}
          </h3>
        </div>
      </div>

      {/* Center: The Prediction */}
      <div className="flex items-center justify-center bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80 shadow-inner">
        <span className="text-sm font-black tabular-nums text-white">{user.prediction.homeTeam}</span>
        <span className="text-xs font-bold text-slate-600 mx-1.5">-</span>
        <span className="text-sm font-black tabular-nums text-white">{user.prediction.awayTeam}</span>
      </div>

      {/* Right: Points */}
      <div className="flex items-center justify-end min-w-[65px] gap-1.5">
        <Trophy className={`h-3.5 w-3.5 ${user.points > 0 ? "text-emerald-400" : "text-slate-600"}`} />
        <div className="flex items-baseline">
          <span className={`text-base font-black tabular-nums ${user.points > 0 ? "text-emerald-400" : "text-slate-400"}`}>
            {user.points > 0 ? `+${user.points}` : user.points}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-wider ml-0.5 ${user.points > 0 ? "text-emerald-600" : "text-slate-600"}`}>
            pts
          </span>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-8 text-center">
      <h2 className="text-xl font-black text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{message}</p>
    </div>
  );
}

export default LiveStats ;

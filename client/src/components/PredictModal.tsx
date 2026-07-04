import { useState, useEffect } from "react";
import { X, Swords, CheckCircle, Check } from "lucide-react";
import type { ModalPayload } from "../types/prediction.types";
import { createPrediction, updatePrediction } from "../services/predictions.service";
import ButtonLoading from "./ButtonLoading";

export default function PredictModal({
  payload,
  onClose,
  fetchPredictions
}: {
  payload: ModalPayload | null;
  onClose: () => void;
  fetchPredictions : () => void;
}) {
  
  const [matchPredictions, setMatchPredictions] = useState(payload?.matches || []);
  const [ loading , setLoading ] = useState(false);
  const [ success , setSuccess ] = useState(false);

  useEffect(() => {
    if (payload) {
      setMatchPredictions(payload.matches);
    }
  }, [payload]);

  if (!payload) return null;

  const handleScoreChange = (matchId: string, team: "home" | "away", value: string) => {
    
    if (!/^\d*$/.test(value)) return;

    setMatchPredictions((prev) =>
      prev.map((m) => {
        if (m.matchId === matchId) {
          return {
            ...m,
            predictedScores: {
              ...m.predictedScores,
              [team === "home" ? "homeTeam" : "awayTeam"]: value,
            },
          };
        }
        return m;
      })
    );
  };

  const handleSubmit = async () => {

    const formatedPayload = matchPredictions.map(v => ({
      matchId : v.matchId, 
      predictedScores : {
        homeTeam : Number(v.predictedScores.homeTeam),
        awayTeam : Number(v.predictedScores.awayTeam)
      }
    }));
    
    try{
      setLoading(true);

      if(payload.isUpdate)await updatePrediction(payload.predictionId,formatedPayload)
      else await createPrediction(payload.predictionId,formatedPayload) ;

      setSuccess(true);

    }catch(error){
      onClose();
      console.log("Prediction Modal error",error);
    }finally{

      setTimeout(() => {
        setLoading(false);
        setSuccess(false);

        fetchPredictions();

        setTimeout(() => onClose(),300);
        
      },2000);
    }
    
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/40 backdrop-blur-sm transition-opacity">
      
      <div className="bg-white w-full max-w-xl rounded-[24px] shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {success ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 animate-in fade-in zoom-in duration-300">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-emerald-50 text-emerald-500 p-4 rounded-full border border-emerald-100 shadow-sm">
                <Check className="w-12 h-12 stroke-[3]" />
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2 text-center">
              Prediction Saved!
            </h2>
            <p className="text-sm font-medium text-gray-500 text-center max-w-[250px]">
              Your match scores have been locked in. Good luck!
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {payload.isUpdate ? "Update" : "Create"} Prediction
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 hide-scrollbar">
              {matchPredictions.map((match) => (
                <div
                  key={match.matchId}
                  className="flex items-center justify-between bg-gray-50 p-3 md:p-4 rounded-2xl border border-gray-200 shadow-sm"
                >
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-10 h-10 object-contain drop-shadow-sm" />
                    <span className="font-bold text-gray-800 text-xs text-center line-clamp-1 px-1">
                      {match.homeTeam.shortName}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 md:gap-4 px-2">
                    <input
                      type="number"
                      min="0"
                      value={match.predictedScores.homeTeam}
                      onChange={(e) => handleScoreChange(match.matchId, "home", e.target.value)}
                      className="w-12 h-12 md:w-14 md:h-14 text-center text-xl font-black text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all tabular-nums shadow-inner"
                    />
                    <Swords className="w-4 h-4 md:w-5 md:h-5 text-gray-300 flex-shrink-0" />
                    <input
                      type="number"
                      min="0"
                      value={match.predictedScores.awayTeam}
                      onChange={(e) => handleScoreChange(match.matchId, "away", e.target.value)}
                      className="w-12 h-12 md:w-14 md:h-14 text-center text-xl font-black text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all tabular-nums shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col items-center flex-1 gap-2">
                    <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-10 h-10 object-contain drop-shadow-sm" />
                    <span className="font-bold text-gray-800 text-xs text-center line-clamp-1 px-1">
                      {match.awayTeam.shortName}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 active:scale-[0.99] text-white text-sm font-bold py-3.5 md:py-4 px-6 rounded-xl shadow-md transition-all duration-200"
              >
                {
                  loading ? <ButtonLoading /> : (<>
                   <CheckCircle className="w-5 h-5" />
                   Save Predictions
                  </>)
                }
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
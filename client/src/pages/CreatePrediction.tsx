import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Calendar, Clock } from 'lucide-react';
import type { CreateMatch } from '../types/prediction.types';
import PageLoading from '../components/PageLoading';
import { addPrediction, getNewMatches } from '../services/predictions.service';
import ButtonLoading from '../components/ButtonLoading';

function CreatePrediction() {

  const [ matches, setMatches ] = useState<null| CreateMatch[]>(null)
  const [selectedMatches, setSelectedMatches] = useState<CreateMatch[]>([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [ loading , setLoading ]  = useState(false);

  const handleAddMatch = (match: CreateMatch) => {
    setSelectedMatches((prev) => [...prev, match]);
    setIsSelectorOpen(false);
  };

  const handleRemoveMatch = (matchId: string) => {
    setSelectedMatches((prev) => prev.filter((m) => m._id !== matchId));
  };

  const handleMatchCreation = async () => {
    try {
      setLoading(true);

      const payload = selectedMatches.map( v => ({matchId : v._id, apiMatchId : v.apiMatchId}));
      await addPrediction(payload);

      load();
      setSelectedMatches([]);
      
    } catch (error) {
      console.log("prediction creation error",error);
    }finally{
      setLoading(false);
    }
  }

  const load = async () => {
    try{
      const data = await getNewMatches();
      setMatches(data);
    }catch(error){
      console.log("error in match creation page", error);
    }
  }

  useEffect(() => {
    load();
  },[]);

  if(!matches)return <PageLoading />

  const availableMatches = matches.filter(
    (match) => !selectedMatches.some((selected) => selected._id === match._id)
  );

  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8 font-sans text-slate-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-white tracking-tight">Create Prediction</h1>

        {/* Selected Matches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {selectedMatches.map((match) => (
            <div 
              key={match._id} 
              className="relative bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg group hover:border-slate-700 transition-colors"
            >
              {/* Delete Button */}
              <button
                onClick={() => handleRemoveMatch(match._id)}
                className="absolute top-3 right-3 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                title="Remove match"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Match Info */}
              <div className="flex flex-col items-center justify-center pt-2 pb-4">
                <div className="flex items-center justify-between w-full px-4 gap-4">
                  <div className="flex-1 text-center font-bold text-lg text-slate-100 truncate">
                    {match.homeTeam.name || "TBD"}
                  </div>
                  <div className="text-slate-600 font-black text-sm px-3 py-1 bg-slate-950 rounded-lg">
                    VS
                  </div>
                  <div className="flex-1 text-center font-bold text-lg text-slate-100 truncate">
                    {match.awayTeam.name || "TBD"}
                  </div>
                </div>
              </div>

              {/* Match Date/Time Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs font-medium text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  {match.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {match.time}
                </div>
              </div>
            </div>
          ))}

          {/* Dropdown Container */}
          <div className="relative flex items-center justify-center min-h-[160px]">
            {!isSelectorOpen ? (
              <button
                onClick={() => setIsSelectorOpen(true)}
                className="flex flex-col items-center justify-center w-full h-full min-h-[160px] bg-slate-900/30 border-2 border-dashed border-slate-700 hover:border-blue-500 hover:bg-blue-500/5 rounded-2xl transition-all group text-slate-500 hover:text-blue-400"
              >
                <div className="p-3 bg-slate-800 group-hover:bg-blue-500/20 rounded-full mb-3 transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm">Add Match</span>
              </button>
            ) : (
              <div className="absolute inset-0 z-10 w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-xl flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950/50">
                  <span className="font-medium text-sm text-slate-300 ml-2">Available Matches</span>
                  <button 
                    onClick={() => setIsSelectorOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[300px] custom-scrollbar">
                  {availableMatches.length === 0 ? (
                    <div className="text-center p-4 text-sm text-slate-500">
                      No more matches available.
                    </div>
                  ) : (
                    availableMatches.map((match) => (
                      <button
                        key={match._id}
                        onClick={() => handleAddMatch(match)}
                        className="group w-full rounded-xl border border-slate-700/60 bg-slate-900/40 hover:bg-slate-800 hover:border-blue-500/40 transition-all duration-200 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          {/* Teams */}
                          <div className="flex flex-1 items-center justify-center gap-3 min-w-0">
                            <span className="flex-1 truncate text-right font-semibold text-slate-100">
                              {match.homeTeam.name || "TBD"}
                            </span>

                            <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              VS
                            </span>

                            <span className="flex-1 truncate text-left font-semibold text-slate-100">
                              {match.awayTeam.name || "TBD"}
                            </span>
                          </div>

                          {/* Divider */}
                          <div className="h-8 w-px bg-slate-700" />

                          {/* Date & Time */}
                          <div className="flex flex-col items-end shrink-0">
                            <span className="text-xs font-semibold text-slate-200">
                              {match.date}
                            </span>

                            <span className="text-xs text-slate-400">
                              {match.time}
                            </span>
                          </div>

                          {/* Add */}
                          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 transition-all group-hover:bg-blue-500 group-hover:text-white">
                            <Plus className="h-4 w-4" />
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-4 border-t border-slate-800/50">
          <button 
            onClick={handleMatchCreation}
            disabled={selectedMatches.length === 0 || loading}
            className="w-full sm:w-auto flex justify-center px-8 py-3.5 bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            {loading ? <ButtonLoading /> : "Create Prediction"}
          </button>
        </div>

        
      </div>
    </div>
  );
}

export default CreatePrediction;
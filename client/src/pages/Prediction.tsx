import { useEffect, useState } from "react";
import PredictionComp from "../components/PredictionComp";
import type { LivePrediction, UserPrediction } from "../types/prediction.types";
import { getPredictions } from "../services/predictions.service";
import PageLoading from "../components/PageLoading";
import UserPredictionComp from "../components/UserPredictionComp";

function PredictionPage() {

    const [ loading, setLoading ] = useState(false);
    const [ predictions, setPredictions ] = useState<LivePrediction[] | null>(null);
    const [ userPredictions, setUserPredictions ] = useState<UserPrediction[] | null>(null);

    const fetchPredictions = async () => {

        setLoading(true);
        try{

            const data = await getPredictions();
            setPredictions(data.predictions);
            setUserPredictions(data.userPredictions);

        }catch(error){
            console.log("prediction listing error!",error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPredictions();
    },[]);

    if(loading || !predictions || !userPredictions)return <PageLoading />


    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden font-sans pb-20">
            {/* Background Animations */}
            <div className="fixed -top-32 -left-32 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse"></div>
            <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 lg:px-8 space-y-10">
                
                {/* NEW PREDICTIONS --- */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-7 bg-emerald-500 rounded-full" />
                            <h2 className="font-display-sports text-3xl uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Live Predictions
                            </h2>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-emerald-500/30 ring-1 ring-inset ring-white/10">
                        <div className="overflow-auto flex gap-5">
                            {predictions.map((prediction) => (
                                <PredictionComp key={prediction._id} prediction={prediction} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* PAST PREDICTIONS --- */}
                <section className="mt-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3 opacity-70">
                            <div className="w-1.5 h-7 bg-slate-400 rounded-full" />
                            <h2 className="font-display-sports text-2xl uppercase tracking-wider text-slate-400 font-bold">
                                Your Predictions
                            </h2>
                        </div>
                    </div>

                    <div className="bg-transparent rounded-3xl p-4 md:p-6 border border-slate-300/60 border-dashed">
        
                        <div className="flex overflow-x-auto gap-5 pb-2 snap-x hide-scrollbar">
                            {userPredictions.map((v) => (
                                <div key={v._id} className="snap-start shrink-0">
                                    <UserPredictionComp prediction={v} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default PredictionPage;
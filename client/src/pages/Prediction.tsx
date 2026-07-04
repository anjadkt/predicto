import { useEffect, useState } from "react";
import PredictionComp from "../components/PredictionComp";
import type { LivePrediction, UserPrediction } from "../types/prediction.types";
import { getPredictions } from "../services/predictions.service";
import PageLoading from "../components/PageLoading";

function PredictionPage() {

    const [ loading, setLoading ] = useState(false);
    const [ predictions, setPredictions ] = useState<LivePrediction[] | null>(null);
    const [ userPredictions, setUserPredictions ] = useState<UserPrediction | null>(null);

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
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            | Predictions Live
                        </h2>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-emerald-500/30 ring-1 ring-inset ring-white/10">
                        <div className="overflow-auto flex gap-5">
                            {predictions.map((prediction) => (
                                <PredictionComp key={prediction._id} prediction={prediction} />
                            ))}
                        </div>
                    </div>
                </section>

                {/*PAST PREDICTIONS --- */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-300 mb-6">| Your Predictions</h2>
                    
                    <div className="bg-[#FDFBF7] rounded-3xl p-8 shadow-xl border border-slate-200">
                        <div className="space-y-4">
                            
                            
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default PredictionPage;
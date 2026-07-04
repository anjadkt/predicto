import { useEffect, useState } from "react";
import PredictionComp from "../components/PredictionComp";
import type { LivePrediction, UserPrediction } from "../types/prediction.types";
import { getPredictions } from "../services/predictions.service";
import PageLoading from "../components/PageLoading";

const topPrediction = {
    "_id": "6a476e98821a4308dd7ebfbc",
    "matches": [
        {
            "matchId": "6a4609a7e716cc43bbf0c634",
            "apiMatchId": 537428,
            "awayTeam": { "id": 825, "name": "Egypt", "shortName": "Egypt", "tla": "EGY", "crest": "https://crests.football-data.org/825.svg" },
            "homeTeam": { "id": 779, "name": "Australia", "shortName": "Australia", "tla": "AUS", "crest": "https://crests.football-data.org/779.svg" },
            "date": "3/7/2026",
            "time": "11:30 PM",
        },
        {
            "matchId": "6a4609a7e716cc43bbf0c635",
            "apiMatchId": 537427,
            "awayTeam": { "id": 1930, "name": "Cape Verde Islands", "shortName": "Cape Verde", "tla": "CPV", "crest": "https://crests.football-data.org/cape_verde.svg" },
            "homeTeam": { "id": 762, "name": "Argentina", "shortName": "Argentina", "tla": "ARG", "crest": "https://crests.football-data.org/762.png" },
            "date": "4/7/2026",
            "time": "3:30 AM",
        },
        {
            "matchId": "6a4609a7e716cc43bbf0c636",
            "apiMatchId": 537430,
            "awayTeam": { "id": 763, "name": "Ghana", "shortName": "Ghana", "tla": "GHA", "crest": "https://crests.football-data.org/ghana.svg" },
            "homeTeam": { "id": 818, "name": "Colombia", "shortName": "Colombia", "tla": "COL", "crest": "https://crests.football-data.org/818.svg" },
            "date": "4/7/2026",
            "time": "7:00 AM",
        }
    ],
    "closesAt": "2026-07-03T18:00:00.000Z",
    "status": "LIVE"
};

const pastPrediction = {
    "_id": "6a46b466e46648d0c530c84f",
    "totalPoints": 0,
    "predictions": [
        {
            "matchId": {
                "awayTeam": { "name": "Austria", "crest": "https://crests.football-data.org/816.svg" },
                "homeTeam": { "name": "Spain", "crest": "https://crests.football-data.org/760.svg" },
                "score": { "fullTime": { "home": 3, "away": 0 } }
            },
            "predictedScores": { "homeTeam": 2, "awayTeam": 1 },
            "results": { "points": 0, "status": "WRONG" }
        },
        {
            "matchId": {
                "awayTeam": { "name": "Croatia", "crest": "https://crests.football-data.org/799.svg" },
                "homeTeam": { "name": "Portugal", "crest": "https://crests.football-data.org/765.svg" },
                "score": { "fullTime": { "home": 2, "away": 1 } }
            },
            "predictedScores": { "homeTeam": 1, "awayTeam": 1 },
            "results": { "points": 0, "status": "WRONG" }
        },
        {
            "matchId": {
                "awayTeam": { "name": "Algeria", "crest": "https://crests.football-data.org/algeria.svg" },
                "homeTeam": { "name": "Switzerland", "crest": "https://crests.football-data.org/788.svg" },
                "score": { "fullTime": { "home": 2, "away": 0 } }
            },
            "predictedScores": { "homeTeam": 2, "awayTeam": 1 },
            "results": { "points": 0, "status": "WRONG" }
        }
    ]
};

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

    if(loading || !predictions)return <PageLoading />


    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden font-sans pb-20">
            {/* Background Animations */}
            <div className="fixed -top-32 -left-32 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse"></div>
            <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 lg:px-8 space-y-10">
                
                {/* --- TOP SECTION: NEW PREDICTIONS --- */}
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

                {/* --- BOTTOM SECTION: PAST PREDICTIONS --- */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-300 mb-6">| Your Predictions</h2>
                    
                    {/* Creamy White Background Container */}
                    <div className="bg-[#FDFBF7] rounded-3xl p-8 shadow-xl border border-slate-200">
                        <div className="space-y-4">
                            {pastPrediction.predictions.map((pred, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                                    
                                    {/* Match Info */}
                                    <div className="flex items-center justify-center gap-8 w-full md:w-2/3">
                                        <div className="flex items-center gap-3 w-[120px] justify-end">
                                            <span className="text-slate-800 font-semibold">{pred.matchId.homeTeam.name}</span>
                                            <img src={pred.matchId.homeTeam.crest} alt="Home" className="w-8 h-8 object-contain" />
                                        </div>
                                        
                                        <div className="flex flex-col items-center">
                                            <div className="text-2xl font-black text-slate-900">
                                                {pred.matchId.score.fullTime.home} - {pred.matchId.score.fullTime.away}
                                            </div>
                                            <div className="text-xs text-slate-500 font-medium tracking-wide">ACTUAL</div>
                                        </div>

                                        <div className="flex items-center gap-3 w-[120px] justify-start">
                                            <img src={pred.matchId.awayTeam.crest} alt="Away" className="w-8 h-8 object-contain" />
                                            <span className="text-slate-800 font-semibold">{pred.matchId.awayTeam.name}</span>
                                        </div>
                                    </div>

                                    {/* User Prediction & Result */}
                                    <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-1/3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="text-center">
                                            <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Your Pick</p>
                                            <p className="text-lg font-bold text-slate-700">
                                                {pred.predictedScores.homeTeam} - {pred.predictedScores.awayTeam}
                                            </p>
                                        </div>
                                        
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest ${
                                            pred.results.status === 'WRONG' 
                                            ? 'bg-red-100 text-red-600 border border-red-200' 
                                            : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                                        }`}>
                                            {pred.results.status}
                                        </div>
                                    </div>
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
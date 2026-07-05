import { useEffect, useState } from 'react';
import { getLeaderboardData } from '../services/leaderboard.service';
import PageLoading from '../components/PageLoading';
import type { LeaderBoardUser } from '../types/leaderboard.types';
import UserAvatar from '../hooks/UseAvatar';

export default function LeaderBoard() {

  const [ users , setUsers ] = useState<null | LeaderBoardUser[]>(null);

  useEffect(() => {
    const load = async () => {
      try {
        
        const data = await getLeaderboardData();
        setUsers(data);
        
      } catch (error) {
        console.log("Leaderboard error!", error)
      }
    }

    load();
  },[]);

  if(!users) return <PageLoading />

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden font-sans pb-20">
      {/* Background Animations */}
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse"></div>
      <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 lg:px-8 space-y-10">
        
        {/* Title Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-7 bg-emerald-500 rounded-full" />
            <h1 className="font-display-sports text-3xl uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-bold">
              Leader Board
            </h1>
          </div>

          {/* Leaderboard List Container */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-3 sm:p-6 shadow-2xl border border-emerald-500/30 ring-1 ring-inset ring-white/10">
            {users.length > 0 ? (
              <ul className="divide-y divide-white/10 space-y-2">
                {users.map((user, index) => (
                  <li 
                    key={user._id} 
                    className={`flex items-center justify-between p-4 sm:px-6 transition-all duration-300 rounded-2xl group border ${
                      index === 0 
                        ? 'bg-yellow-400/10 border-yellow-400/40 shadow-[0_0_15px_rgba(250,204,21,0.15)] hover:bg-yellow-400/20' : 
                      index === 1 
                        ? 'bg-amber-600/10 border-amber-600/40 shadow-[0_0_15px_rgba(217,119,6,0.1)] hover:bg-amber-600/20' :  
                        'bg-transparent border-transparent hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      
                      {/* Rank Indicator */}
                      <div className="w-8 text-center">
                        <span className={`text-xl font-display-sports font-bold ${
                          index === 0 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' :
                          index === 1 ? 'text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]' : 
                          'text-slate-500'
                        }`}>
                          #{index + 1}
                        </span>
                      </div>

                      {/* Avatar Section */}
                      <UserAvatar 
                        className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full object-cover border-2 p-0.5 transition-colors ${
                          index === 0 ? 'border-yellow-400/70 group-hover:border-yellow-400' :
                          index === 1 ? 'border-amber-600/70 group-hover:border-amber-600' :
                          'border-emerald-500/50 group-hover:border-emerald-400'
                        }`}
                        src={user.avatar}   
                        name={user.name}                  
                      />

                      {/* Name & Subtext Section */}
                      <div className="flex flex-col">
                        <span className="text-lg sm:text-sm font-semibold text-slate-200 capitalize tracking-wide">
                          {user.name}
                        </span>
                        <span className="text-xs text-slate-500 font-medium tracking-widest">
                          {user.number.replace(/.(?=.{4})/g, '•')}
                        </span>
                      </div>
                    </div>

                    {/* Score Section */}
                    <div className="text-right pl-4">
                      <div className={`inline-flex items-baseline gap-1.5 px-4 py-1.5 rounded-full shadow-inner border ${
                        index === 0 ? 'bg-yellow-950/40 border-yellow-500/30' :
                        index === 1 ? 'bg-slate-800/40 border-slate-500/30' :
                        index === 2 ? 'bg-amber-950/40 border-amber-500/30' :
                        'bg-cyan-950/40 border-cyan-500/30'
                      }`}>
                        <span className={`text-xl sm:text-2xl font-bold ${
                          index === 0 ? 'text-yellow-400' :
                          index === 1 ? 'text-slate-300' :
                          index === 2 ? 'text-amber-500' :
                          'text-cyan-400'
                        }`}>
                          {user.totalPoints}
                        </span>
                        <span className={`text-xs font-semibold uppercase tracking-widest ${
                          index === 0 ? 'text-yellow-500/70' :
                          index === 1 ? 'text-slate-400/70' :
                          index === 2 ? 'text-amber-600/70' :
                          'text-cyan-500/70'
                        }`}>
                          pts
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-12 text-center text-slate-400 font-medium tracking-wide">
                No users found on the leaderboard yet.
              </div>
            )}
          </div>

        </section>
      </div>
    </div>
  );
}
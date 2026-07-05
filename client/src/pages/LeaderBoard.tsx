import { useEffect, useState } from 'react';
import { getLeaderboardData } from '../services/leaderboard.service';
import PageLoading from '../components/PageLoading';
import type { LeaderBoardUser } from '../types/leaderboard.types';

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
              <ul className="divide-y divide-white/10">
                {users.map((user, index) => (
                  <li 
                    key={user._id} 
                    className="flex items-center justify-between p-4 sm:px-6 hover:bg-white/5 transition-all duration-300 rounded-2xl group"
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      
                      {/* Rank Indicator */}
                      <div className="w-8 text-center">
                        <span className={`text-xl font-display-sports font-bold ${
                          index === 0 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 
                          index === 1 ? 'text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.4)]' : 
                          index === 2 ? 'text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]' : 
                          'text-slate-500'
                        }`}>
                          #{index + 1}
                        </span>
                      </div>

                      {/* Avatar Section */}
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={`${user.name}'s avatar`} 
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-emerald-500/50 p-0.5 group-hover:border-emerald-400 transition-colors"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl uppercase border border-emerald-500/30 backdrop-blur-sm group-hover:border-emerald-400 transition-colors">
                          {user.name.charAt(0)}
                        </div>
                      )}

                      {/* Name & Subtext Section */}
                      <div className="flex flex-col">
                        <span className="text-lg sm:text-xl font-semibold text-slate-200 capitalize tracking-wide">
                          {user.name}
                        </span>
                        <span className="text-xs text-slate-500 font-medium tracking-widest">
                          {user.number.replace(/.(?=.{4})/g, '•')}
                        </span>
                      </div>
                    </div>

                    {/* Score Section */}
                    <div className="text-right pl-4">
                      <div className="inline-flex items-baseline gap-1.5 bg-cyan-950/40 border border-cyan-500/30 px-4 py-1.5 rounded-full shadow-inner">
                        <span className="text-xl sm:text-2xl font-bold text-cyan-400">
                          {user.totalPoints}
                        </span>
                        <span className="text-xs font-semibold text-cyan-500/70 uppercase tracking-widest">
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
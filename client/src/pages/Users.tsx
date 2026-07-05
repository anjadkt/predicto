import { useEffect, useState } from 'react';
import UserAvatar from '../hooks/UseAvatar';
import type { PredictorsResponse, PredictorUser } from '../types/users.types';
import UserModal from '../components/UserModal';
import PageLoading from '../components/PageLoading';
import { getUsersData } from '../services/users.service';

function Users() {
  const [users, setUsers] = useState<PredictorsResponse | null>(null);
  const [selectedUser, setSelectedUser] = useState<PredictorUser | null>(null);

  const load = async () => {
    try{
      const data = await getUsersData();
      setUsers(data);
    }catch(error){
      console.log("error in users page",error);
    }
  }

  useEffect(() => {
    load();
  },[])

  const UserCard = ({ user }: { user: PredictorUser }) => (

      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700 hover:border-slate-500 transition-colors shadow-sm w-full flex flex-row items-center gap-2 sm:gap-3">
        
        {/* 1. Avatar */}
        <div className="w-10 h-10 shrink-0 bg-slate-700 rounded-full flex items-center justify-center text-sm font-bold text-slate-300 shadow-inner overflow-hidden">
          <UserAvatar
            name={user.name}
            className="w-full h-full object-cover"
            src={user.avatar}
          />
        </div>
        
        {/* 2. Name & Number */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-medium text-slate-100 truncate capitalize text-sm sm:text-base leading-tight">
            {user.name}
          </h3>
          <p className="text-slate-400 text-xs tracking-wider truncate mt-0.5">
            {user.number}
          </p>
        </div>

        {/* 3. Points */}
        <div className="shrink-0 flex items-center gap-1.5 px-1 sm:px-3 text-right">
          <span className="hidden sm:block text-slate-500 text-[10px] uppercase tracking-wider">Points:</span>
          <span className="text-cyan-400 font-bold text-sm sm:text-base">{user.totalPoints}</span>
        </div>

        {/* 4. View Details CTA */}
        <button
          onClick={() => setSelectedUser(user)}
          className="shrink-0 px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40"
        >
          <span className="hidden sm:inline">View Details</span>
          <span className="sm:hidden">View</span>
        </button>
        
      </div>
  );

  if (!users) return <PageLoading />;

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8 lg:p-12 font-sans relative">

      <div className="max-w-7xl mx-auto space-y-12 mb-[100px]">

        {/* Unverified Section */}
        <section>
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-200">Pending Verification</h2>
            <span className="bg-amber-500/10 text-amber-500 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/20">
              {users.unverified.length}
            </span>
          </div>
          
          {/* Unverified Section  */}
          {users.unverified.length === 0 ? (
            <div className="text-slate-500 bg-slate-900/30 rounded-xl p-8 text-center border border-slate-800 border-dashed">
              No unverified users at the moment.
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              {users.unverified.map(user => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          )}
        </section>

        {/* Verified Section */}
        <section>

          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-200">Verified Users</h2>
            <span className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
              {users.verified.length}
            </span>
          </div>

          {users.verified.length === 0 ? (
            <div className="text-slate-500 bg-slate-900/30 rounded-xl p-8 text-center border border-slate-800 border-dashed">
              No verified users yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              {users.verified.map(user => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* User Details Modal */}
      {selectedUser && ( 
        <UserModal 
          reLoad = {load}
          onClose={() => setSelectedUser(null)} 
          user={selectedUser} 
        />
      )}
    </div>
  );
}

export default Users;
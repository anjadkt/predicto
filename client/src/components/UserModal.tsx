import { useState } from "react";
import UserAvatar from "../hooks/UseAvatar";
import type { PredictorUser } from "../types/users.types";
import { updateUserDetails } from "../services/users.service";
import ButtonLoading from "./ButtonLoading";

function UserModal(
  { user, onClose, reLoad }:
  { user: PredictorUser, onClose: () => void, reLoad:  () => void}
) {

  const [points, setPoints] = useState(user.totalPoints);
  const [isVerified, setIsVerified] = useState(user.isVerified);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try{
      setLoading(true);
      await updateUserDetails(user._id,{ score : points, isVerified });
      await reLoad();
      onClose();
    }catch(error){
      console.log("Error in user details updation", error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-7 py-4 bg-slate-950/80 backdrop-blur-sm">
      
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">User Details</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center text-3xl font-bold text-slate-300 shadow-inner mb-4 overflow-hidden">
              <UserAvatar
                name={user.name}
                className="w-full h-full object-cover"
                src={user.avatar}
              />
            </div>
            <h4 className="text-xl font-bold text-white capitalize">{user.name}</h4>
            
            {/* Display toggle */}
            <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              isVerified
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>

          <div className="space-y-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Phone Number</span>
              <span className="text-slate-200 font-medium">{user.number}</span>
            </div>

            {/* Verification Toggle */}
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Verification</span>
              <button
                onClick={() => setIsVerified(!isVerified)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  isVerified ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    isVerified ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Points Modifier */}
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Total Points</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPoints(p => p - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors border border-slate-600"
                >
                  -
                </button>
                <span className="text-cyan-400 font-bold w-6 text-center">{points}</span>
                <button
                  onClick={() => setPoints(p => p + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors border border-slate-600"
                >
                  +
                </button>
              </div>
            </div>
            
          </div>
        </div>

        {/* Modal Footer with Cancel & Save */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg font-medium text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg font-medium text-sm bg-black text-white hover:bg-black transition-colors shadow-sm"
          >
            {
              loading ? <ButtonLoading /> : "Save"
            }
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default UserModal;
function PageLoading() {
  return (

    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 backdrop-blur-sm">
      
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse"></div>
      <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="flex items-center space-x-3">
        <div className="w-3.5 h-3.5 rounded-full bg-indigo-400 shadow-[0_0_14px_rgba(99,102,241,0.6)] animate-bounce"></div>
        <div className="w-3.5 h-3.5 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3.5 h-3.5 rounded-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)] animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      
    </div>
  );
}

export default PageLoading;
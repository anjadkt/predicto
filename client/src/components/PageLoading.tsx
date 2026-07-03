function PageLoading() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900/70 backdrop-blur-lg z-50">
            {/* Buffering Dots */}
            <div className="flex items-center space-x-3 mb-8">
                <div className="w-5 h-5 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] animate-bounce"></div>
                <div className="w-5 h-5 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-5 h-5 rounded-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)] animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            
            {/* Buffering Text */}
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-xl font-bold tracking-[0.3em] animate-pulse">
                BUFFERING...
            </p>
        </div>
    );
}

export default PageLoading;
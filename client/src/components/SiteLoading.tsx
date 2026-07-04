function SiteLoading() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900/70 backdrop-blur-lg z-50">

            <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-indigo-400 shadow-[0_0_14px_rgba(99,102,241,0.6)] animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-4 h-4 rounded-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)] animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            
        </div>
    );
}

export default SiteLoading;
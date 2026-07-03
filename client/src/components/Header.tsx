
function Header({ title }: { title: string }) {
    return (
        <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Title Area */}
                    <div className="flex-shrink-0 flex items-center">
                        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            {title}
                        </h1>
                    </div>

                    {/* Logout Button */}
                    <div>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-300 shadow-sm ring-1 ring-inset ring-white/10 hover:bg-white/10 hover:text-white hover:ring-red-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 active:scale-95"
                        >
                            Logout
                        </button>
                    </div>
                    
                </div>
            </div>
        </header>
    );
}

export default Header;
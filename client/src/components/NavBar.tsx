import React from 'react';
import { Link, useLocation } from 'react-router';
import { Target, Radio, Trophy, Users, PlusCircle, LayoutDashboard } from 'lucide-react';

const IconMap: Record<string, React.ElementType> = {
    prediction: Target,
    live: Radio,
    leaderboard: Trophy,
    users: Users,
    create: PlusCircle,
};

interface NavLink {
    icon: string;
    href: string;
}

function NavBar({ navlinks }: { navlinks: NavLink[] }) {
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 w-full z-50 bg-slate-950/90 backdrop-blur-lg border-t border-white/10 md:hidden">
            <div className="flex justify-around items-center h-16 px-2 pb-safe">
                {navlinks.map((link, idx) => {
                    
                    const IconComponent = IconMap[link.icon] || LayoutDashboard; 
                    const isActive = location.pathname === link.href;

                    return (
                        <Link
                            key={idx}
                            to={link.href}
                            className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ease-in-out ${
                                isActive 
                                    ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)] -translate-y-1' 
                                    : 'text-slate-400 hover:text-slate-300 active:scale-95'
                            }`}
                        >
                            <IconComponent 
                                size={24} 
                                strokeWidth={isActive ? 2.5 : 2} 
                                className="transition-all duration-300"
                            />
                            
                            {isActive && (
                                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse"></span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

export default NavBar;
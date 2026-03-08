import { useAuth } from '../../context/AuthContext';
import { Bell, Search } from 'lucide-react';

export default function TopNavbar() {
    const { user } = useAuth();

    return (
        <header className="h-14 md:h-16 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
            <div className="flex items-center gap-3">
                {/* Mobile logo */}
                <span className="md:hidden font-mono font-bold text-lg text-white tracking-tight">PlaceIQ</span>

                <div className="relative hidden sm:block">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input type="text" placeholder="Search..."
                        className="bg-white/[0.03] border border-white/[0.06] rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-accent/30 w-48 md:w-64 transition-all" />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                <button className="relative p-2 rounded-lg hover:bg-white/[0.05] text-gray-500 transition-colors">
                    <Bell size={18} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                </button>

                <div className="hidden md:flex items-center gap-3 pl-4 border-l border-white/[0.06]">
                    <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-sm font-semibold">
                        {user?.name?.[0] || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-600 capitalize">{user?.role || 'student'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

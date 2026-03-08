import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Building2, FileText, User, LogOut,
    Users, Menu, X
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const studentLinks = [
        { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/student/companies', icon: Building2, label: 'Companies' },
        { to: '/student/applications', icon: FileText, label: 'Applications' },
        { to: '/student/profile', icon: User, label: 'Profile' },
    ];

    const adminLinks = [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/companies', icon: Building2, label: 'Companies' },
        { to: '/admin/students', icon: Users, label: 'Students' },
    ];

    const links = user?.role === 'admin' ? adminLinks : studentLinks;

    return (
        <>
            {/* ─── DESKTOP: Floating card-stack sidebar ─── */}
            <aside className="hidden md:flex w-[220px] h-screen flex-col p-3 sticky top-0 gap-3">
                {/* Brand card */}
                <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-4">
                    <span className="font-mono font-bold text-lg text-white tracking-tight">PlaceIQ</span>
                    <p className="text-[10px] text-gray-600 mt-0.5">Placement Portal</p>
                </div>

                {/* Navigation cards */}
                <div className="flex-1 rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-3 space-y-1">
                    {links.map(link => (
                        <NavLink key={link.to} to={link.to}
                            className={({ isActive }) => `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-accent/10 text-accent border border-accent/20 shadow-[0_0_12px_rgba(229,77,46,0.1)]'
                                : 'text-gray-500 hover:bg-white/[0.04] hover:text-gray-300 border border-transparent'
                                }`}
                        >
                            <motion.div
                                whileHover={{ scale: 1.15, rotate: -5 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            >
                                <link.icon size={18} className="flex-shrink-0" />
                            </motion.div>
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </div>

                {/* User card */}
                <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-4">
                    {user && (
                        <div className="mb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-sm font-bold font-mono">
                                    {user.name?.[0] || 'U'}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                    <p className="text-[10px] text-gray-600 truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={14} className="flex-shrink-0" />
                        <span>Logout</span>
                    </motion.button>
                </div>
            </aside>

            {/* ─── MOBILE: Bottom floating nav ─── */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-1">
                <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-xl px-2 py-2 flex items-center justify-around">
                    {links.map(link => {
                        const isActive = location.pathname === link.to;
                        return (
                            <NavLink key={link.to} to={link.to}
                                className="flex flex-col items-center gap-0.5 px-3 py-1.5 relative"
                                onClick={() => setMobileOpen(false)}
                            >
                                <motion.div
                                    whileTap={{ scale: 0.85 }}
                                    className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-accent/15 text-accent' : 'text-gray-500'}`}
                                >
                                    <link.icon size={18} />
                                </motion.div>
                                <span className={`text-[9px] font-medium ${isActive ? 'text-accent' : 'text-gray-600'}`}>
                                    {link.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-indicator"
                                        className="absolute -bottom-0.5 w-5 h-0.5 bg-accent rounded-full"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </NavLink>
                        );
                    })}
                    <button onClick={handleLogout}
                        className="flex flex-col items-center gap-0.5 px-3 py-1.5">
                        <div className="p-2 rounded-xl text-gray-500 hover:text-red-400 transition-colors">
                            <LogOut size={18} />
                        </div>
                        <span className="text-[9px] font-medium text-gray-600">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}

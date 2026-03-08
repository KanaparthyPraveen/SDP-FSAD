import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DotGrid from '../ui/DotGrid';

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-black flex flex-col relative">
            {/* Top nav */}
            <nav className="border-b border-white/[0.06] bg-black/80 backdrop-blur-xl relative z-10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="font-mono font-bold text-xl text-white tracking-tight">
                        PlaceIQ
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-4 py-2">
                            Sign in
                        </Link>
                        <Link to="/register"
                            className="text-sm font-semibold text-white border border-white/20 hover:border-white/50 px-5 py-2 rounded-lg transition-all">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Auth form area */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="w-full max-w-md"
                >
                    <Outlet />
                </motion.div>
            </div>

            {/* Subtle grid background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <DotGrid
                    dotSize={3}
                    gap={32}
                    baseColor="#271E37"
                    activeColor="#5227FF"
                    proximity={60}
                    shockRadius={150}
                    shockStrength={3}
                    resistance={750}
                    returnDuration={1.5}
                />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/[0.03] rounded-full blur-[120px]" />
            </div>
        </div>
    );
}

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
    ArrowRight, BookOpen, Building2, FileText, BarChart3,
    Bell, UserCheck, Shield, Layout, Moon, Zap, Menu, X
} from 'lucide-react';

/* ──────── Animated counter hook ──────── */
function useCounter(end, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-50px' });
    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [inView, end, duration]);
    return [count, ref];
}

/* ──────── Fade-in wrapper ──────── */
function FadeIn({ children, delay = 0, className = '' }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ──────── Grid background SVG ──────── */
function GridBg() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/[0.04] rounded-full blur-[120px]" />
        </div>
    );
}

/* ──────────────────────────────────────
   LANDING PAGE
   ────────────────────────────────────── */
export default function LandingPage() {
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
            {/* ── NAVBAR ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative z-50">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xl text-white tracking-tight">College Placement</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Features</a>
                        <a href="#companies" className="text-sm text-white/70 hover:text-white transition-colors">Companies</a>
                        <a href="#how-it-works" className="text-sm text-white/70 hover:text-white transition-colors">How It Works</a>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login" className="text-sm font-semibold text-white/80 hover:text-white transition-colors px-4 py-2">
                            Sign in
                        </Link>
                        <Link to="/register"
                            className="text-sm font-semibold text-white bg-transparent border border-white/20 hover:border-white/50 px-5 py-2 rounded-lg transition-all">
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button className="md:hidden text-white/80" onClick={() => setMobileMenu(!mobileMenu)}>
                        {mobileMenu ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenu && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="md:hidden bg-black/95 border-b border-white/[0.06] px-6 pb-6 pt-2">
                        <a href="#features" className="block py-2 text-white/70 hover:text-white">Features</a>
                        <a href="#companies" className="block py-2 text-white/70 hover:text-white">Companies</a>
                        <a href="#how-it-works" className="block py-2 text-white/70 hover:text-white">How It Works</a>
                        <div className="mt-4 flex gap-3">
                            <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
                            <Link to="/register" className="btn-outline text-sm">Get Started</Link>
                        </div>
                    </motion.div>
                )}
            </nav>

            {/* ── HERO ── */}
            <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 z-10">
                <GridBg />
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <FadeIn>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase mb-8">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            College Placement System
                        </span>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <h1 className="font-mono font-bold text-4xl sm:text-5xl md:text-7xl leading-[1.1] tracking-tight mb-6">
                            <span className="text-white">Command Your</span><br />
                            <span className="text-white">Placement Journey</span><br />
                            <span className="text-accent">From One Beautiful</span><br />
                            <span className="text-accent">Dashboard</span>
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                            Track applications, explore companies, and manage your placement
                            journey — all in one lightweight, beautiful platform.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register"
                                className="group flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-7 py-3 rounded-lg transition-all duration-200 shadow-glow-sm hover:shadow-glow">
                                Get Started
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="#features"
                                className="text-white/70 hover:text-white font-medium px-6 py-3 transition-colors">
                                View Features
                            </a>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── STATS BAR ── */}
            <section className="relative border-y border-white/[0.06] bg-surface z-10">
                <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { end: 500, suffix: '+', label: 'Students Placed' },
                        { end: 99.9, suffix: '%', label: 'Placement Rate', decimal: true },
                        { end: 50, suffix: '+', label: 'Partner Companies' },
                        { end: 100, suffix: '%', label: 'Free to Use' },
                    ].map((stat, i) => {
                        const [count, ref] = useCounter(stat.decimal ? 999 : stat.end);
                        return (
                            <FadeIn key={i} delay={i * 0.1} className="text-center">
                                <div ref={ref}>
                                    <p className="font-mono text-3xl md:text-5xl font-bold text-white">
                                        {stat.decimal ? (count / 10).toFixed(1) : count}{stat.suffix}
                                    </p>
                                    <p className="text-accent text-sm font-medium mt-1 uppercase tracking-wider">{stat.label}</p>
                                </div>
                            </FadeIn>
                        );
                    })}
                </div>
            </section>

            {/* ── DASHBOARD PREVIEW ── */}
            <section className="relative py-16 md:py-24 z-10" id="companies">
                <div className="max-w-6xl mx-auto px-6">
                    <FadeIn>
                        <div className="rounded-2xl border border-white/[0.08] bg-surface-card overflow-hidden shadow-card-hover">
                            {/* Top bar */}
                            <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06]">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="ml-3 text-sm font-mono text-white/70">College Placement Dashboard</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-white/70">
                                    <span>🟢 Active</span>
                                    <span>⏱ 99.98% uptime</span>
                                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-semibold">Live</span>
                                </div>
                            </div>

                            {/* Stat cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-white/[0.06]">
                                {[
                                    { icon: '📝', value: '24', label: 'Active Applications', color: 'text-purple-400' },
                                    { icon: '🏢', value: '18', label: 'Companies Hiring', color: 'text-green-400' },
                                    { icon: '🎓', value: '312', label: 'Students Placed', color: 'text-blue-400' },
                                    { icon: '🔔', value: '5', label: 'Upcoming Drives', color: 'text-orange-400' },
                                ].map((card, i) => (
                                    <div key={i} className={`px-6 py-5 ${i < 3 ? 'border-r border-white/[0.06]' : ''}`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{card.icon}</span>
                                            <div>
                                                <p className={`font-mono text-2xl font-bold ${card.color}`}>{card.value}</p>
                                                <p className="text-xs text-white/70">{card.label}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Dashboard body */}
                            <div className="grid md:grid-cols-3 gap-0">
                                {/* Recent Applications */}
                                <div className="p-6 border-r border-white/[0.06]">
                                    <h4 className="text-sm font-semibold text-white mb-4">Recent Applications</h4>
                                    {[
                                        { name: 'Google', role: 'SDE-1', status: 'Interview', time: '2 min ago', statusColor: 'text-orange-400' },
                                        { name: 'Microsoft', role: 'Full Stack', status: 'Applied', time: '5 min ago', statusColor: 'text-blue-400' },
                                        { name: 'Amazon', role: 'SDE-1', status: 'Shortlisted', time: '8 min ago', statusColor: 'text-purple-400' },
                                        { name: 'Flipkart', role: 'Backend', status: 'Selected', time: '12 min ago', statusColor: 'text-green-400' },
                                        { name: 'Deloitte', role: 'Analyst', status: 'Applied', time: '15 min ago', statusColor: 'text-blue-400' },
                                    ].map((app, i) => (
                                        <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                                            <div>
                                                <p className="text-sm font-medium text-white">{app.name}</p>
                                                <p className="text-xs text-white/70">{app.role} · <span className={app.statusColor}>{app.status}</span></p>
                                            </div>
                                            <span className="text-xs text-white/60">{app.time}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Application Distribution */}
                                <div className="p-6 border-r border-white/[0.06]">
                                    <h4 className="text-sm font-semibold text-white mb-4">Application Distribution</h4>
                                    <div className="flex items-center justify-center py-4">
                                        <div className="relative w-32 h-32">
                                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                                <circle cx="50" cy="50" r="38" fill="none" stroke="#1a1a1a" strokeWidth="8" />
                                                <circle cx="50" cy="50" r="38" fill="none" stroke="#22C55E" strokeWidth="8"
                                                    strokeDasharray="150 239" strokeLinecap="round" />
                                                <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" strokeWidth="8"
                                                    strokeDasharray="60 239" strokeDashoffset="-150" strokeLinecap="round" />
                                                <circle cx="50" cy="50" r="38" fill="none" stroke="#A855F7" strokeWidth="8"
                                                    strokeDasharray="29 239" strokeDashoffset="-210" strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="font-mono text-2xl font-bold text-white">24</span>
                                                <span className="text-[10px] text-white/70">total</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center gap-4 mt-2 text-xs">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" /> Selected 63%</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full" /> Applied 25%</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-purple-500 rounded-full" /> Interview 12%</span>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <div>
                                            <div className="flex justify-between text-xs text-white/70 mb-1"><span>IT Companies</span><span>48%</span></div>
                                            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 rounded-full" style={{ width: '48%' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs text-white/70 mb-1"><span>Product</span><span>32%</span></div>
                                            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '32%' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs text-white/70 mb-1"><span>Consulting</span><span>20%</span></div>
                                            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-500 rounded-full" style={{ width: '20%' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Live Analytics + Source Code */}
                                <div className="p-6">
                                    <h4 className="text-sm font-semibold text-white mb-4">Live Analytics</h4>
                                    {[
                                        { label: 'Active Applications', value: '24', change: '+12%', changeColor: 'text-green-400' },
                                        { label: 'Companies Visited', value: '18', change: '+8%', changeColor: 'text-green-400' },
                                        { label: 'Offers Received', value: '7', change: '+5%', changeColor: 'text-green-400' },
                                        { label: 'Pending Rounds', value: '3', change: '', changeColor: '' },
                                        { label: 'Success Rate', value: '87.5%', change: '', changeColor: '' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                                            <span className="text-sm text-white/70">{item.label}</span>
                                            <span className="flex items-center gap-2">
                                                <span className="font-mono text-sm font-semibold text-white">{item.value}</span>
                                                {item.change && <span className={`text-xs ${item.changeColor}`}>{item.change}</span>}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="py-16 md:py-24 relative z-10" id="features">
                <div className="max-w-6xl mx-auto px-6">
                    <FadeIn className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
                            ✨ Core Features
                        </span>
                        <h2 className="font-mono text-3xl md:text-5xl font-bold text-white leading-tight">
                            Everything You Need<br />to Get Placed
                        </h2>
                        <p className="text-white/70 mt-4 max-w-xl mx-auto">
                            PlaceIQ combines application tracking, company insights, and profile management into a single unified dashboard.
                        </p>
                    </FadeIn>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: <Shield size={24} />, title: 'Authentication', desc: 'Secure login with session-based access control.' },
                            { icon: <Layout size={24} />, title: 'Dashboard Analytics', desc: 'Real-time stats on applications, offers, and drives.' },
                            { icon: <Moon size={24} />, title: 'Dark Theme', desc: 'Beautiful dark interface designed for focus.' },
                            { icon: <Zap size={24} />, title: 'Instant Apply', desc: 'One-click applications to eligible companies.' },
                            { icon: <FileText size={24} />, title: 'Resume Upload', desc: 'Upload and manage your resume for recruiters.' },
                            { icon: <Building2 size={24} />, title: 'Company Profiles', desc: 'Explore detailed company info, roles, and CTC.' },
                            { icon: <BarChart3 size={24} />, title: 'Track Progress', desc: 'Monitor every round from applied to selected.' },
                            { icon: <Bell size={24} />, title: 'Smart Alerts', desc: 'Never miss a deadline or drive notification.' },
                        ].map((feature, i) => (
                            <FadeIn key={i} delay={i * 0.05}>
                                <motion.div
                                    whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.12)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="group p-6 rounded-2xl border border-white/[0.06] bg-surface-card h-full cursor-default"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/70 group-hover:text-accent group-hover:bg-accent/10 group-hover:border-accent/20 transition-all duration-300 mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-mono text-sm font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-xs text-white/70 leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-16 md:py-24 border-t border-white/[0.06] relative z-10" id="how-it-works">
                <div className="max-w-6xl mx-auto px-6">
                    <FadeIn className="text-center mb-14">
                        <span className="inline-flex items-center gap-2 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
                            💻 Student Experience
                        </span>
                        <h2 className="font-mono text-3xl md:text-5xl font-bold text-white leading-tight">
                            Register Once.<br />Apply Anywhere.
                        </h2>
                        <p className="text-white/70 mt-4 max-w-xl mx-auto">
                            PlaceIQ makes placement drives effortless — from profile setup to offer letter, all in four simple steps.
                        </p>
                    </FadeIn>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { step: '01', title: 'Create Profile', desc: 'Sign up and build your profile with skills, CGPA, and resume upload.', icon: <UserCheck size={22} /> },
                            { step: '02', title: 'Browse Companies', desc: 'Explore active placement drives, view eligibility, CTC, and role details.', icon: <Building2 size={22} /> },
                            { step: '03', title: 'Apply & Track', desc: 'One-click apply to eligible companies and track every round in real-time.', icon: <FileText size={22} /> },
                            { step: '04', title: 'Get Placed', desc: 'Receive offer status updates and manage all your placements from one dashboard.', icon: <BarChart3 size={22} /> },
                        ].map((item, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <motion.div
                                    whileHover={{ y: -6, borderColor: 'rgba(229, 77, 46, 0.3)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="relative p-6 rounded-2xl border border-white/[0.06] bg-[#0a0a0a] h-full group cursor-default"
                                >
                                    <span className="font-mono text-4xl font-bold text-white/[0.04] absolute top-4 right-5 select-none">{item.step}</span>
                                    <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4 group-hover:bg-accent/20 transition-colors">
                                        {item.icon}
                                    </div>
                                    <h3 className="font-mono text-sm font-semibold text-white mb-2">{item.title}</h3>
                                    <p className="text-xs text-white/70 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-white/[0.06] py-10 relative z-10">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="font-mono font-bold text-lg text-white">College Placement</span>
                    <p className="text-sm text-white/60">© 2026 College Placement Management System.</p>
                    <div className="flex items-center gap-6 text-sm text-white/70">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#companies" className="hover:text-white transition-colors">Companies</a>
                        <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

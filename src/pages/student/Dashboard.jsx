import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getApplicationStats, getApplications, getPerformanceInsights, STATUS_CONFIG } from '../../data/applications';
import { getRecommendedCompanies, getCompanies } from '../../data/companies';
import { getProfileStrength } from '../../utils/auth';
import { getActivities, ACTIVITY_CONFIG } from '../../data/activityFeed';
import {
    FileText, Building2, Trophy, Clock, TrendingUp, Target, BarChart3,
    Zap, CheckCircle2, Circle, CircleDot, AlertCircle, ArrowRight, Sparkles
} from 'lucide-react';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    // Defensive data calls - prevent crashes from stale localStorage
    let stats, applications, companies, insights, profileStrength, recommended, activities;
    try { stats = getApplicationStats(); } catch { stats = { total: 0, applied: 0, shortlisted: 0, interview: 0, selected: 0, rejected: 0 }; }
    try { applications = getApplications(); } catch { applications = []; }
    try { companies = getCompanies(); } catch { companies = []; }
    try { insights = getPerformanceInsights(); } catch { insights = { successRate: 0, interviewConversion: 0, offerProbability: 0, totalRoundsCleared: 0, totalApplications: 0, activeApplications: 0 }; }
    try { profileStrength = getProfileStrength(user); } catch { profileStrength = { percent: 0, missing: [], completed: [], total: 8, done: 0 }; }
    try { recommended = getRecommendedCompanies(user).slice(0, 4); } catch { recommended = []; }
    try { activities = getActivities(6); } catch { activities = []; }
    const activeCompanies = companies.filter(c => c.status === 'active').length;

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(t);
    }, []);

    const statCards = [
        { label: 'Applications', value: stats.total, icon: FileText, color: 'text-blue-400', gradient: 'from-blue-500/20 to-transparent' },
        { label: 'Companies Active', value: activeCompanies, icon: Building2, color: 'text-green-400', gradient: 'from-green-500/20 to-transparent' },
        { label: 'Selected', value: stats.selected, icon: Trophy, color: 'text-accent', gradient: 'from-accent/20 to-transparent' },
        { label: 'In Progress', value: stats.interview + stats.shortlisted, icon: Clock, color: 'text-purple-400', gradient: 'from-purple-500/20 to-transparent' },
    ];

    // Skeleton loader
    const Skeleton = ({ className }) => (
        <div className={`animate-pulse bg-white/[0.04] rounded-xl ${className}`} />
    );

    if (loading) return (
        <div className="space-y-8 py-2">
            <Skeleton className="h-14 w-64" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
            </div>
            <div className="grid lg:grid-cols-3 gap-5">
                <Skeleton className="h-48 lg:col-span-2" />
                <Skeleton className="h-48" />
            </div>
        </div>
    );

    return (
        <div className="space-y-8 py-2">

            {/* ─── Greeting ─── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="font-mono text-2xl md:text-3xl font-bold text-white">
                    Welcome back, <span className="text-accent">{user?.name?.split(' ')[0] || 'Student'}</span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">Here's your placement intelligence overview</p>
            </motion.div>

            {/* ─── Profile Strength + Stats Row ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                {/* Profile Strength Meter */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="lg:col-span-1 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0d0d0d] to-[#0a0a0a] p-5"
                >
                    <p className="text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-3">Profile Strength</p>
                    <div className="flex justify-center mb-3">
                        <div className="relative w-20 h-20">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a1a" strokeWidth="7" />
                                <circle cx="50" cy="50" r="40" fill="none"
                                    stroke={profileStrength.percent >= 80 ? '#22C55E' : profileStrength.percent >= 50 ? '#F59E0B' : '#E54D2E'}
                                    strokeWidth="7"
                                    strokeDasharray={`${(profileStrength.percent / 100) * 251} 251`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-mono text-lg font-bold text-white">{profileStrength.percent}%</span>
                            </div>
                        </div>
                    </div>
                    {profileStrength.missing.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-[10px] text-gray-600 mb-1">Missing:</p>
                            {profileStrength.missing.slice(0, 3).map(m => (
                                <div key={m} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                    <AlertCircle size={10} className="text-accent flex-shrink-0" /> {m}
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Stat Cards */}
                <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -3, borderColor: 'rgba(229,77,46,0.15)' }}
                            transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}
                            className={`p-5 rounded-2xl border border-white/[0.06] bg-gradient-to-br ${card.gradient} backdrop-blur-sm cursor-default`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <card.icon size={20} className={card.color} />
                                <TrendingUp size={14} className="text-green-500/60" />
                            </div>
                            <p className="font-mono text-3xl font-bold text-white">{card.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ─── Performance Insights ─── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Success Rate', value: `${insights.successRate}%`, icon: Target, desc: `${stats.selected} of ${stats.total} selected`, color: 'text-green-400' },
                    { label: 'Interview Conv.', value: `${insights.interviewConversion}%`, icon: BarChart3, desc: 'Interviews → Offers', color: 'text-blue-400' },
                    { label: 'Offer Probability', value: `${insights.offerProbability}%`, icon: Zap, desc: 'Mock AI prediction', color: 'text-yellow-400' },
                    { label: 'Rounds Cleared', value: insights.totalRoundsCleared, icon: CheckCircle2, desc: `Across ${stats.total} applications`, color: 'text-purple-400' },
                ].map((item, i) => (
                    <div key={i} className="rounded-xl border border-white/[0.04] bg-[#080808] p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <item.icon size={14} className={item.color} />
                            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500">{item.label}</span>
                        </div>
                        <p className="font-mono text-2xl font-bold text-white">{item.value}</p>
                        <p className="text-[10px] text-gray-600">{item.desc}</p>
                    </div>
                ))}
            </motion.div>

            {/* ─── Placement Journey Timeline ─── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6"
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-mono text-sm font-semibold text-white">Placement Journey</h2>
                    <span className="text-[10px] text-gray-600">{insights.activeApplications} active</span>
                </div>
                <div className="space-y-4">
                    {applications.filter(a => !['rejected'].includes(a.status)).slice(0, 4).map((app) => (
                        <div key={app.id} className="rounded-xl border border-white/[0.04] bg-[#060606] p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-lg">{app.companyLogo}</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">{app.companyName}</p>
                                    <p className="text-[10px] text-gray-600">{app.role} · {app.package}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_CONFIG[app.status]?.bg} ${STATUS_CONFIG[app.status]?.color} border ${STATUS_CONFIG[app.status]?.border}`}>
                                    {STATUS_CONFIG[app.status]?.label}
                                </span>
                            </div>

                            {/* Visual Pipeline */}
                            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                                {app.rounds.map((round, ri) => (
                                    <div key={ri} className="flex items-center flex-shrink-0">
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium border
                                            ${round.status === 'CLEARED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                round.status === 'ONGOING' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 animate-pulse' :
                                                    round.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        'bg-white/[0.02] text-gray-600 border-white/[0.04]'
                                            }`}>
                                            {round.status === 'CLEARED' ? <CheckCircle2 size={10} /> :
                                                round.status === 'ONGOING' ? <CircleDot size={10} /> :
                                                    round.status === 'REJECTED' ? <AlertCircle size={10} /> :
                                                        <Circle size={10} />}
                                            {round.name}
                                        </div>
                                        {ri < app.rounds.length - 1 && (
                                            <div className={`w-4 h-px mx-0.5 ${round.status === 'CLEARED' ? 'bg-green-500/40' : 'bg-white/[0.06]'}`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ─── Recommended Companies + Activity Feed ─── */}
            <div className="grid lg:grid-cols-5 gap-5">

                {/* Recommended Companies */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="lg:col-span-3 rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={14} className="text-accent" />
                        <h2 className="font-mono text-sm font-semibold text-white">Recommended for You</h2>
                    </div>
                    {recommended.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Building2 size={32} className="text-gray-700 mb-2" />
                            <p className="text-sm text-gray-500">Complete your profile to get recommendations</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {recommended.map((c) => (
                                <motion.div key={c.id}
                                    whileHover={{ y: -2, borderColor: 'rgba(229,77,46,0.15)' }}
                                    className="rounded-xl border border-white/[0.04] bg-[#060606] p-4 cursor-default"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{c.logo}</span>
                                            <div>
                                                <p className="text-sm font-medium text-white">{c.name}</p>
                                                <p className="text-[10px] text-gray-600">{c.role}</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-accent/10 text-accent border border-accent/20">
                                            {c.matchScore}%
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                        {c.matchedSkills.slice(0, 3).map(s => (
                                            <span key={s} className="px-1.5 py-0.5 rounded text-[9px] bg-green-500/10 text-green-400 border border-green-500/15">{s}</span>
                                        ))}
                                        <span className="text-[10px] text-gray-600 ml-auto">{c.ctc}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Activity Feed */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6"
                >
                    <h2 className="font-mono text-sm font-semibold text-white mb-4">Recent Activity</h2>
                    <div className="space-y-0">
                        {activities.map((act, i) => {
                            const config = ACTIVITY_CONFIG[act.type] || ACTIVITY_CONFIG.system;
                            const time = new Date(act.timestamp);
                            const ago = getTimeAgo(time);
                            return (
                                <div key={act.id} className={`flex items-start gap-3 py-3 border-b border-white/[0.03] last:border-0 ${!act.read ? 'opacity-100' : 'opacity-60'}`}>
                                    <span className="text-base mt-0.5">{config.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-300 leading-relaxed">{act.message}</p>
                                        <p className="text-[10px] text-gray-600 mt-0.5">{ago}</p>
                                    </div>
                                    {!act.read && <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />}
                                </div>
                            );
                        })}
                        {activities.length === 0 && (
                            <p className="text-sm text-gray-600 text-center py-6">No recent activity</p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* ─── Application Breakdown (Compact) ─── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6"
            >
                <h2 className="font-mono text-sm font-semibold text-white mb-4">Application Breakdown</h2>
                <div className="flex items-center gap-2 mb-4">
                    {Object.entries(stats).filter(([k]) => k !== 'total').map(([key, val]) => {
                        const cfg = STATUS_CONFIG[key];
                        if (!cfg || val === 0) return null;
                        const pct = stats.total > 0 ? (val / stats.total) * 100 : 0;
                        return (
                            <div key={key} className={`h-2 rounded-full ${cfg.bg.replace('/15', '/40')}`}
                                style={{ width: `${Math.max(pct, 4)}%` }}
                                title={`${cfg.label}: ${val}`}
                            />
                        );
                    })}
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                        <div key={key} className="text-center">
                            <p className="font-mono text-lg font-bold text-white">{stats[key] || 0}</p>
                            <p className="text-[10px] text-gray-500">{cfg.label}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

function getTimeAgo(date) {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getApplications, getApplicationStats, getPlacementFunnel, getDepartmentStats } from '../../data/applications';
import { getCompanies } from '../../data/companies';
import { getUsers } from '../../utils/auth';
import {
    Users as UsersIcon, Building2, FileText, Trophy, TrendingUp,
    ArrowDown, BarChart3
} from 'lucide-react';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);

    // Defensive data calls
    let allUsers, stats, apps, companies, funnel, deptStats;
    try { allUsers = getUsers(); } catch { allUsers = []; }
    try { stats = getApplicationStats(); } catch { stats = { total: 0, applied: 0, shortlisted: 0, interview: 0, selected: 0, rejected: 0 }; }
    try { apps = getApplications(); } catch { apps = []; }
    try { companies = getCompanies(); } catch { companies = []; }
    const students = allUsers.filter(u => u.role === 'student');
    try { funnel = getPlacementFunnel(allUsers); } catch { funnel = { totalStudents: 1, applied: 0, interviewed: 0, selected: 0, rejected: 0 }; }
    try { deptStats = getDepartmentStats(allUsers); } catch { deptStats = {}; }

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(t);
    }, []);

    const Skeleton = ({ className }) => <div className={`animate-pulse bg-white/[0.04] rounded-xl ${className}`} />;

    if (loading) return (
        <div className="space-y-8 py-2">
            <Skeleton className="h-14 w-72" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)}</div>
            <div className="grid lg:grid-cols-2 gap-5"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>
        </div>
    );

    const overviewCards = [
        { label: 'Total Students', value: students.length, icon: UsersIcon, color: 'text-blue-400', gradient: 'from-blue-500/20 to-transparent' },
        { label: 'Active Companies', value: companies.filter(c => c.status === 'active').length, icon: Building2, color: 'text-green-400', gradient: 'from-green-500/20 to-transparent' },
        { label: 'Applications', value: stats.total, icon: FileText, color: 'text-purple-400', gradient: 'from-purple-500/20 to-transparent' },
        { label: 'Placement Rate', value: `${students.length > 0 ? Math.round((stats.selected / Math.max(students.length, 1)) * 100) : 0}%`, icon: Trophy, color: 'text-accent', gradient: 'from-accent/20 to-transparent' },
    ];

    const funnelStages = [
        { label: 'Total Students', value: funnel.totalStudents, color: 'bg-blue-500', width: 100 },
        { label: 'Applied', value: funnel.applied, color: 'bg-purple-500', width: funnel.totalStudents > 0 ? (funnel.applied / funnel.totalStudents) * 100 : 0 },
        { label: 'Interviewed', value: funnel.interviewed, color: 'bg-orange-500', width: funnel.totalStudents > 0 ? (funnel.interviewed / funnel.totalStudents) * 100 : 0 },
        { label: 'Selected', value: funnel.selected, color: 'bg-green-500', width: funnel.totalStudents > 0 ? (funnel.selected / funnel.totalStudents) * 100 : 0 },
        { label: 'Rejected', value: funnel.rejected, color: 'bg-red-500', width: funnel.totalStudents > 0 ? (funnel.rejected / funnel.totalStudents) * 100 : 0 },
    ];

    const deptEntries = Object.entries(deptStats).sort((a, b) => b[1].applied - a[1].applied);
    const maxApplied = Math.max(...deptEntries.map(([, v]) => v.applied), 1);

    const topCompanies = [...companies]
        .map(c => ({ ...c, appCount: apps.filter(a => a.companyId === c.id).length }))
        .sort((a, b) => b.appCount - a.appCount)
        .slice(0, 5);

    const recentApps = [...apps].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 6);

    return (
        <div className="space-y-8 py-2">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-mono text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Placement intelligence & management</p>
            </motion.div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {overviewCards.map((card, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -3, borderColor: 'rgba(229,77,46,0.15)' }}
                        transition={{ duration: 0.35, delay: i * 0.06 }}
                        className={`p-5 rounded-2xl border border-white/[0.06] bg-gradient-to-br ${card.gradient} cursor-default`}
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

            <div className="grid lg:grid-cols-2 gap-5">
                {/* Placement Funnel */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6"
                >
                    <div className="flex items-center gap-2 mb-5">
                        <BarChart3 size={16} className="text-accent" />
                        <h2 className="font-mono text-sm font-semibold text-white">Placement Funnel</h2>
                    </div>
                    <div className="space-y-3">
                        {funnelStages.map((stage, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-400">{stage.label}</span>
                                    <span className="font-mono text-sm font-bold text-white">{stage.value}</span>
                                </div>
                                <div className="h-6 rounded-lg bg-white/[0.03] overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.max(stage.width, 4)}%` }}
                                        transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                                        className={`h-full rounded-lg ${stage.color}/30 flex items-center px-2`}
                                        style={{ backgroundColor: `${stage.color === 'bg-blue-500' ? 'rgba(59,130,246,0.3)' : stage.color === 'bg-purple-500' ? 'rgba(147,51,234,0.3)' : stage.color === 'bg-orange-500' ? 'rgba(249,115,22,0.3)' : stage.color === 'bg-green-500' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}
                                    />
                                </div>
                                {i < funnelStages.length - 1 && (
                                    <div className="flex justify-center py-0.5">
                                        <ArrowDown size={12} className="text-gray-700" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Department Performance */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6"
                >
                    <h2 className="font-mono text-sm font-semibold text-white mb-5">Department Performance</h2>
                    <div className="space-y-4">
                        {deptEntries.map(([dept, data]) => (
                            <div key={dept}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs text-gray-300 truncate">{dept}</span>
                                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                        <span>{data.applied} applied</span>
                                        <span className="text-green-400">{data.selected} selected</span>
                                    </div>
                                </div>
                                <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                                    <div className="h-full rounded-full bg-accent/50"
                                        style={{ width: `${(data.applied / maxApplied) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                        {deptEntries.length === 0 && (
                            <p className="text-sm text-gray-600 text-center py-8">No department data yet</p>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
                {/* Recent Applications */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6"
                >
                    <h2 className="font-mono text-sm font-semibold text-white mb-4">Recent Applications</h2>
                    <div className="space-y-0">
                        {recentApps.map(app => (
                            <div key={app.id} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-lg">{app.companyLogo}</span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{app.applicant?.name || 'Student'}</p>
                                        <p className="text-[10px] text-gray-600 truncate">{app.companyName} · {app.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
                                        ${app.status === 'selected' ? 'bg-green-500/15 text-green-400' :
                                            app.status === 'rejected' ? 'bg-red-500/15 text-red-400' :
                                                app.status === 'interview' ? 'bg-orange-500/15 text-orange-400' :
                                                    'bg-blue-500/15 text-blue-400'}`}>
                                        {app.status}
                                    </span>
                                    <span className="text-[10px] text-gray-600">{app.package}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Companies */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6"
                >
                    <h2 className="font-mono text-sm font-semibold text-white mb-4">Top Companies</h2>
                    <div className="space-y-3">
                        {topCompanies.map((c, i) => (
                            <div key={c.id} className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-gray-600 w-4">{i + 1}</span>
                                <span className="text-base">{c.logo}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-white truncate">{c.name}</p>
                                    <p className="text-[10px] text-gray-600">{c.role}</p>
                                </div>
                                <span className="font-mono text-xs text-accent font-bold">{c.appCount}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { apiGetApplications } from '../../services/api';
import { Search, FileText, ChevronRight, X, Loader2, TrendingUp } from 'lucide-react';

const STATUS_STYLES = {
    applied:     { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/25',   dot: 'bg-blue-500'   },
    shortlisted: { badge: 'bg-purple-500/15 text-purple-400 border-purple-500/25', dot: 'bg-purple-500' },
    interview:   { badge: 'bg-orange-500/15 text-orange-400 border-orange-500/25', dot: 'bg-orange-500' },
    selected:    { badge: 'bg-green-500/15 text-green-400 border-green-500/25',  dot: 'bg-green-500'  },
    rejected:    { badge: 'bg-red-500/15 text-red-400 border-red-500/25',        dot: 'bg-red-500'    },
};

const ROUND_STYLE = {
    CLEARED:  'bg-green-500',
    ONGOING:  'bg-orange-500',
    REJECTED: 'bg-red-500',
};

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [search,       setSearch]       = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selected,     setSelected]     = useState(null);

    useEffect(() => {
        apiGetApplications()
            .then(data => setApplications(data || []))
            .catch(err => console.error('Failed to load applications:', err))
            .finally(() => setLoading(false));
    }, []);

    const stats = useMemo(() => ({
        total:      applications.length,
        selected:   applications.filter(a => a.status === 'selected').length,
        rejected:   applications.filter(a => a.status === 'rejected').length,
        interview:  applications.filter(a => a.status === 'interview').length,
        applied:    applications.filter(a => a.status === 'applied').length,
    }), [applications]);

    const statuses = ['all', 'applied', 'shortlisted', 'interview', 'selected', 'rejected'];

    const filtered = useMemo(() => applications.filter(a => {
        const matchSearch = (a.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
            (a.role || '').toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || a.status === statusFilter;
        return matchSearch && matchStatus;
    }), [applications, search, statusFilter]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-40 bg-white/[0.04] rounded-xl animate-pulse" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[1,2,3,4].map(i => <div key={i} className="h-20 rounded-2xl bg-white/[0.03] animate-pulse border border-white/[0.04]" />)}
                </div>
                <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-white/[0.03] animate-pulse border border-white/[0.04]" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-mono text-2xl font-bold text-white">Applications</h1>
                <p className="text-sm text-white/60 mt-1">Track your placement applications</p>
            </motion.div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total Applied',  value: stats.total,    color: 'text-white',         bg: 'from-white/5' },
                    { label: 'In Progress',    value: stats.interview, color: 'text-orange-400',   bg: 'from-orange-500/10' },
                    { label: 'Selected',       value: stats.selected,  color: 'text-green-400',    bg: 'from-green-500/10' },
                    { label: 'Rejected',       value: stats.rejected,  color: 'text-red-400',      bg: 'from-red-500/10' },
                ].map(s => (
                    <motion.div key={s.label}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl bg-gradient-to-br ${s.bg} to-transparent border border-white/[0.06]`}
                    >
                        <p className={`font-mono text-3xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-white/50 mt-1">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search applications..." className="input-dark pl-10" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {statuses.map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                                statusFilter === s
                                    ? 'bg-accent/15 text-accent border-accent/25'
                                    : 'bg-white/[0.03] text-white/60 border-white/[0.06] hover:text-white/80'
                            }`}>{s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Applications list */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <FileText size={40} className="text-white/10" />
                    <p className="text-white/50 font-medium">No applications {statusFilter !== 'all' ? `with status "${statusFilter}"` : 'found'}</p>
                    {statusFilter !== 'all' && (
                        <button onClick={() => setStatusFilter('all')} className="text-xs text-accent hover:underline">Show all</button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((app, i) => {
                        const styles = STATUS_STYLES[app.status] || STATUS_STYLES.applied;
                        return (
                            <motion.div key={app.id}
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.25) }}
                                className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5 hover:border-white/[0.12] transition-all cursor-pointer"
                                onClick={() => setSelected(app)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{app.companyLogo}</span>
                                        <div>
                                            <h3 className="font-semibold text-white">{app.companyName}</h3>
                                            <p className="text-xs text-white/50 mt-0.5">{app.role}
                                                {app.packageOffered && <> · <span className="text-accent font-medium">{app.packageOffered}</span></>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${styles.badge}`}>
                                            {app.status}
                                        </span>
                                        <ChevronRight size={16} className="text-white/30" />
                                    </div>
                                </div>

                                {/* Round progress bar */}
                                {app.rounds?.length > 0 && (
                                    <div className="mt-4">
                                        <div className="flex items-center gap-1 mb-1.5">
                                            {app.rounds.map((round, ri) => (
                                                <div key={ri} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
                                                    <div className={`h-full rounded-full transition-all ${ROUND_STYLE[round.status] || ''}`} style={{ width: ROUND_STYLE[round.status] ? '100%' : '0%' }} />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-white/40">
                                            Current round: <span className="text-white/60 font-medium">{app.currentRound || '—'}</span>
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Detail modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{selected.companyLogo}</span>
                                <div>
                                    <h2 className="font-mono text-lg font-bold text-white">{selected.companyName}</h2>
                                    <p className="text-sm text-white/60">{selected.role}
                                        {selected.packageOffered && <span className="text-accent font-semibold ml-1">· {selected.packageOffered}</span>}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-white/[0.05] text-white/60 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold border capitalize ${(STATUS_STYLES[selected.status] || STATUS_STYLES.applied).badge}`}>
                                    {selected.status}
                                </span>
                                <span className="text-xs text-white/40">Applied {selected.appliedDate || '—'}</span>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Selection Rounds</h4>
                                <div className="space-y-3">
                                    {selected.rounds?.map((round, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${
                                                round.status === 'CLEARED' ? 'bg-green-500/15 text-green-400 border-green-500/25' :
                                                round.status === 'ONGOING' ? 'bg-orange-500/15 text-orange-400 border-orange-500/25' :
                                                round.status === 'REJECTED'? 'bg-red-500/15 text-red-400 border-red-500/25' :
                                                'bg-white/[0.04] text-white/40 border-white/[0.06]'
                                            }`}>
                                                {round.status === 'CLEARED' ? '✓' : round.status === 'REJECTED' ? '✗' : i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">{round.name}</p>
                                                {round.completedAt && <p className="text-[10px] text-white/40 mt-0.5">{round.completedAt}</p>}
                                            </div>
                                            <span className={`text-xs font-semibold ${
                                                round.status === 'CLEARED' ? 'text-green-400' :
                                                round.status === 'ONGOING' ? 'text-orange-400' :
                                                round.status === 'REJECTED'? 'text-red-400' : 'text-white/30'
                                            }`}>{round.status}</span>
                                        </div>
                                    ))}
                                    {!selected.rounds?.length && <p className="text-sm text-white/40">No rounds tracked yet.</p>}
                                </div>
                            </div>

                            {selected.coverLetter && (
                                <div>
                                    <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Cover Letter</h4>
                                    <p className="text-sm text-white/80 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">{selected.coverLetter}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

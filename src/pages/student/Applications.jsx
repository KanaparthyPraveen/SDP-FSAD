import { useState } from 'react';
import { motion } from 'framer-motion';
import { getApplications, STATUS_CONFIG } from '../../data/applications';
import { Search, Filter, FileText, ChevronRight, X } from 'lucide-react';

export default function Applications() {
    const [applications] = useState(getApplications());
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selected, setSelected] = useState(null);

    const statuses = ['all', 'applied', 'shortlisted', 'interview', 'selected', 'rejected'];

    const filtered = applications.filter(a => {
        const matchSearch = a.companyName.toLowerCase().includes(search.toLowerCase()) ||
            a.role.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || a.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-mono text-2xl font-bold text-white">Applications</h1>
                <p className="text-sm text-gray-500 mt-1">Track your placement applications</p>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search applications..." className="input-dark pl-10" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {statuses.map(s => (
                        <button key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${statusFilter === s
                                    ? 'bg-accent/15 text-accent border border-accent/25'
                                    : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:text-gray-300'
                                }`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Applications list */}
            <div className="space-y-3">
                {filtered.map((app, i) => (
                    <motion.div key={app.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5 hover:border-white/[0.12] transition-all cursor-pointer"
                        onClick={() => setSelected(app)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">{app.companyLogo}</span>
                                <div>
                                    <h3 className="font-medium text-white text-sm">{app.companyName}</h3>
                                    <p className="text-xs text-gray-600">{app.role} · {app.package}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`status-${app.status} capitalize`}>{app.status}</span>
                                <ChevronRight size={16} className="text-gray-600" />
                            </div>
                        </div>

                        {/* Round progress */}
                        <div className="mt-4 flex items-center gap-1">
                            {app.rounds?.map((round, ri) => (
                                <div key={ri} className="flex items-center gap-1 flex-1">
                                    <div className={`h-1 flex-1 rounded-full ${round.status === 'CLEARED' ? 'bg-green-500' :
                                            round.status === 'ONGOING' ? 'bg-orange-500' :
                                                round.status === 'REJECTED' ? 'bg-red-500' :
                                                    'bg-white/[0.06]'
                                        }`} />
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-600 mt-1.5">{app.currentRound}</p>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <FileText size={40} className="mx-auto text-gray-700 mb-3" />
                    <p className="text-gray-500">No applications found</p>
                </div>
            )}

            {/* Application detail modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{selected.companyLogo}</span>
                                <div>
                                    <h2 className="font-mono text-lg font-bold text-white">{selected.companyName}</h2>
                                    <p className="text-sm text-gray-500">{selected.role} · {selected.package}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-500">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-3">
                                <span className={`status-${selected.status} capitalize`}>{selected.status}</span>
                                <span className="text-xs text-gray-600">Applied {selected.appliedDate}</span>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Selection Rounds</h4>
                                <div className="space-y-3">
                                    {selected.rounds?.map((round, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${round.status === 'CLEARED' ? 'bg-green-500/15 text-green-400 border border-green-500/25' :
                                                    round.status === 'ONGOING' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/25' :
                                                        round.status === 'REJECTED' ? 'bg-red-500/15 text-red-400 border border-red-500/25' :
                                                            'bg-white/[0.04] text-gray-600 border border-white/[0.06]'
                                                }`}>
                                                {round.status === 'CLEARED' ? '✓' : round.status === 'REJECTED' ? '✗' : i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-white">{round.name}</p>
                                                {round.completedAt && <p className="text-[10px] text-gray-600">{round.completedAt}</p>}
                                            </div>
                                            <span className={`text-xs font-medium ${round.status === 'CLEARED' ? 'text-green-400' :
                                                    round.status === 'ONGOING' ? 'text-orange-400' :
                                                        round.status === 'REJECTED' ? 'text-red-400' :
                                                            'text-gray-600'
                                                }`}>
                                                {round.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selected.coverLetter && (
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cover Letter</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">{selected.coverLetter}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

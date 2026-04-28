import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { apiGetApplications, apiAdminUpdateApplication } from '../../services/api';
import { useToast } from '../../components/ui/Toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import {
    Search, Loader2, AlertCircle, XCircle, FileText,
    Layers, Check, X, Filter, RefreshCw
} from 'lucide-react';

const STATUS_STYLES = {
    applied:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
    shortlisted: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    interview:   'bg-orange-500/10 text-orange-400 border-orange-500/20',
    selected:    'bg-green-500/10 text-green-400 border-green-500/20',
    rejected:    'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUS_FILTERS = ['all', 'applied', 'shortlisted', 'interview', 'selected', 'rejected'];

export default function ManageApplications() {
    const { toast } = useToast();

    const [applications,    setApplications]   = useState([]);
    const [search,          setSearch]          = useState('');
    const [statusFilter,    setStatusFilter]    = useState('all');
    const [loading,         setLoading]         = useState(true);
    const [updatingId,      setUpdatingId]      = useState(null);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [selectedAppRounds, setSelectedAppRounds] = useState(null);
    const [confirm,         setConfirm]         = useState(null); // { label, fn }

    const loadApplications = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiGetApplications();
            setApplications(data || []);
        } catch (err) {
            toast('Failed to load applications — ' + err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadApplications(); }, [loadApplications]);

    const filtered = useMemo(() => applications.filter(app => {
        const studentName = app.applicant?.name || '';
        const matchSearch =
            app.companyName?.toLowerCase().includes(search.toLowerCase()) ||
            app.role?.toLowerCase().includes(search.toLowerCase()) ||
            studentName.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || app.status === statusFilter;
        return matchSearch && matchStatus;
    }), [applications, search, statusFilter]);

    /* ─── Status update ─── */
    const handleStatusChange = async (appId, newStatus) => {
        setUpdatingId(appId);
        try {
            await apiAdminUpdateApplication(appId, { status: newStatus });
            setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
            toast('Status updated successfully', 'success');
        } catch (err) {
            toast('Failed to update status — ' + err.message, 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    /* ─── Round update ─── */
    const handleRoundChange = async (appId, roundIndex, roundStatus) => {
        try {
            const updated = await apiAdminUpdateApplication(appId, { roundIndex, roundStatus });
            setApplications(prev => prev.map(a => a.id === appId ? updated : a));
            if (selectedAppRounds?.id === appId) setSelectedAppRounds(updated);
            toast(`Round marked as ${roundStatus}`, 'success');
        } catch (err) {
            toast('Failed to update round — ' + err.message, 'error');
        }
    };

    /* ─── Bulk shortlist/reject for filtered set ─── */
    const bulkUpdate = async (newStatus) => {
        const ids = filtered.map(a => a.id);
        let done = 0;
        for (const id of ids) {
            try {
                await apiAdminUpdateApplication(id, { status: newStatus });
                done++;
            } catch (_) {}
        }
        await loadApplications();
        toast(`Updated ${done}/${ids.length} applications to "${newStatus}"`, 'success');
        setConfirm(null);
    };

    const confirmBulk = (label, status) => setConfirm({
        label,
        title: `${label} all ${filtered.length} visible applications?`,
        message: 'This will update every application currently shown in the filtered list.',
        fn: () => bulkUpdate(status),
        danger: status === 'rejected',
    });

    return (
        <div className="space-y-6">

            {/* ── Profile Modal ── */}
            {selectedProfile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                            <h3 className="font-mono font-semibold text-white">Student Profile</h3>
                            <button onClick={() => setSelectedProfile(null)} className="text-white/50 hover:text-white transition-colors"><XCircle size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4 pb-4 border-b border-white/[0.04]">
                                <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center text-xl font-bold font-mono text-white border border-accent/20">
                                    {selectedProfile.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white text-base">{selectedProfile.name}</h4>
                                    <p className="text-sm text-white/60">{selectedProfile.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                {[
                                    { label: 'Roll Number', value: selectedProfile.rollNo },
                                    { label: 'Department',  value: selectedProfile.department },
                                    { label: 'CGPA',        value: selectedProfile.cgpa, mono: true },
                                    { label: 'Backlogs',    value: selectedProfile.backlogs ?? 0, mono: true },
                                ].map(f => (
                                    <div key={f.label}>
                                        <span className="block text-xs text-white/40 mb-1">{f.label}</span>
                                        <span className={`text-white/90 font-medium ${f.mono ? 'font-mono' : ''}`}>{f.value ?? 'N/A'}</span>
                                    </div>
                                ))}
                            </div>
                            {selectedProfile.skills?.length > 0 && (
                                <div>
                                    <span className="block text-xs text-white/40 mb-2">Skills</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedProfile.skills.map((s, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded text-xs bg-white/5 text-white/80 border border-white/10">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* ── Rounds Modal ── */}
            {selectedAppRounds && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                            <div>
                                <h3 className="font-mono font-semibold text-white">Interview Rounds</h3>
                                <p className="text-[11px] text-white/40 mt-0.5">{selectedAppRounds.applicant?.name} — {selectedAppRounds.companyName}</p>
                            </div>
                            <button onClick={() => setSelectedAppRounds(null)} className="text-white/50 hover:text-white transition-colors"><XCircle size={20} /></button>
                        </div>
                        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                            {!selectedAppRounds.rounds?.length ? (
                                <p className="text-sm text-center text-white/40 py-6">No rounds defined.</p>
                            ) : selectedAppRounds.rounds.map((round, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.04] bg-[#0d0d0d] gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${
                                            round.status === 'CLEARED'  ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            round.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            round.status === 'ONGOING'  ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                                          'bg-white/5 text-white/40 border-white/10'
                                        }`}>
                                            {round.status === 'CLEARED' ? <Check size={13}/> : round.status === 'REJECTED' ? <X size={13}/> : index + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{round.name}</p>
                                            <span className={`text-[10px] font-semibold ${
                                                round.status === 'CLEARED' ? 'text-green-400' :
                                                round.status === 'REJECTED' ? 'text-red-400' :
                                                round.status === 'ONGOING' ? 'text-orange-400' : 'text-white/30'
                                            }`}>{round.status}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => handleRoundChange(selectedAppRounds.id, index, 'CLEARED')}
                                            disabled={round.status === 'CLEARED'}
                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >Approve</button>
                                        <button
                                            onClick={() => handleRoundChange(selectedAppRounds.id, index, 'REJECTED')}
                                            disabled={round.status === 'REJECTED'}
                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* ── Page header ── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="font-mono text-2xl font-bold text-white">Manage Applications</h1>
                        <p className="text-sm text-white/60 mt-1">Review, update, and track student applications</p>
                    </div>
                    <button onClick={loadApplications} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.04] text-xs transition-all">
                        <RefreshCw size={13} /> Refresh
                    </button>
                </div>
            </motion.div>

            {/* ── Filters row ── */}
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                <div className="relative max-w-sm flex-1">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by student, company, role..." className="input-dark pl-10 text-xs" />
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                    {STATUS_FILTERS.map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                                statusFilter === s
                                    ? 'bg-accent/15 text-accent border-accent/25'
                                    : 'bg-white/[0.03] text-white/60 border-white/[0.06] hover:text-white/80'
                            }`}>{s === 'all' ? '⬛ All' : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Bulk actions ── */}
            {filtered.length > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <Filter size={13} className="text-white/40" />
                    <span className="text-xs text-white/50">{filtered.length} visible</span>
                    <div className="ml-auto flex gap-2">
                        <button onClick={() => confirmBulk('Shortlist', 'shortlisted')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-colors">
                            Shortlist All
                        </button>
                        <button onClick={() => confirmBulk('Reject', 'rejected')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors">
                            Reject All
                        </button>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 size={24} className="animate-spin text-accent" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-dark">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Company & Role</th>
                                    <th>Applied On</th>
                                    <th>Status</th>
                                    <th>Update</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(app => (
                                    <tr key={app.id}>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-white">{app.applicant?.name || 'Unknown'}</span>
                                                <span className="text-xs text-white/50">{app.applicant?.email}</span>
                                                <span className="text-xs font-mono text-white/40 mt-0.5">{app.applicant?.rollNo}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <span className="font-medium text-white">{app.companyName}</span>
                                                <span className="block text-xs text-accent mt-0.5">{app.role}</span>
                                            </div>
                                        </td>
                                        <td className="text-xs text-white/60">
                                            {app.appliedDate || (app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—')}
                                        </td>
                                        <td>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${STATUS_STYLES[app.status] || 'bg-white/5 text-white/50 border-white/10'}`}>
                                                {app.status || 'applied'}
                                            </span>
                                        </td>
                                        <td>
                                            {updatingId === app.id ? (
                                                <Loader2 size={14} className="animate-spin text-accent" />
                                            ) : (
                                                <select
                                                    value={app.status || 'applied'}
                                                    onChange={e => setConfirm({
                                                        title: `Change status to "${e.target.value}"?`,
                                                        message: `This will mark ${app.applicant?.name}'s application as "${e.target.value}".`,
                                                        fn: () => { handleStatusChange(app.id, e.target.value); setConfirm(null); },
                                                    })}
                                                    className="bg-[#111] border border-white/[0.06] text-white/80 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-accent transition-colors"
                                                >
                                                    {['applied','shortlisted','interview','selected','rejected'].map(s => (
                                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1.5">
                                                <button onClick={() => setSelectedAppRounds(app)}
                                                    className="p-1.5 text-white/40 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] rounded border border-white/[0.06] transition-colors" title="Manage Rounds">
                                                    <Layers size={13} />
                                                </button>
                                                <button onClick={() => setSelectedProfile(app.applicant)}
                                                    className="p-1.5 text-white/40 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] rounded border border-white/[0.06] transition-colors" title="View Profile">
                                                    <FileText size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={6} className="text-center py-12 text-white/40">No applications found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Confirmation dialog */}
            <ConfirmDialog
                open={!!confirm}
                title={confirm?.title || ''}
                message={confirm?.message || ''}
                confirmLabel={confirm?.label || 'Confirm'}
                onConfirm={confirm?.fn}
                onCancel={() => setConfirm(null)}
                danger={confirm?.danger}
            />
        </div>
    );
}

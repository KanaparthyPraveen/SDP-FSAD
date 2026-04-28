import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { apiGetStudents, apiGetApplications, apiAdminUpdateApplication } from '../../services/api';
import { Search, User, FileText, X, Download, CheckCircle2, Circle, CircleDot, AlertCircle, MessageSquare, Loader2 } from 'lucide-react';

const STATUS_CONFIG = {
    applied:     { label: 'Applied',     color: 'text-blue-400',   bg: 'bg-blue-500/15',   border: 'border-blue-500/25' },
    shortlisted: { label: 'Shortlisted', color: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/25' },
    interview:   { label: 'Interview',   color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/25' },
    selected:    { label: 'Selected',    color: 'text-green-400',  bg: 'bg-green-500/15',  border: 'border-green-500/25' },
    rejected:    { label: 'Rejected',    color: 'text-red-400',    bg: 'bg-red-500/15',    border: 'border-red-500/25' },
};

export default function ManageStudents() {
    const [users, setUsers]             = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [search, setSearch]           = useState('');
    const [selected, setSelected]       = useState(null);
    const [noteText, setNoteText]       = useState('');
    const [actionMsg, setActionMsg]     = useState('');
    const [error, setError]             = useState('');

    const loadData = useCallback(async () => {
        try {
            const [s, a] = await Promise.all([apiGetStudents(), apiGetApplications()]);
            setUsers(s.filter(u => u.role === 'student'));
            setApplications(a);
        } catch (err) {
            setError('Failed to load data — ' + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const getStudentApps = (studentId) => applications.filter(
        a => a.applicant?.userId === studentId
    );

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.rollNo && u.rollNo.toLowerCase().includes(search.toLowerCase()))
    );

    const handleRoundAction = async (appId, roundIndex, roundStatus) => {
        try {
            await apiAdminUpdateApplication(appId, { roundIndex, roundStatus });
            await loadData();
            setActionMsg(`Round updated to ${roundStatus}`);
            setTimeout(() => setActionMsg(''), 2000);
        } catch (err) {
            setActionMsg('Error: ' + err.message);
        }
    };

    const handleStatusOverride = async (appId, status) => {
        try {
            await apiAdminUpdateApplication(appId, { status });
            await loadData();
            setActionMsg(`Status set to ${status}`);
            setTimeout(() => setActionMsg(''), 2000);
        } catch (err) {
            setActionMsg('Error: ' + err.message);
        }
    };

    const handleAddNote = async (appId) => {
        if (!noteText.trim()) return;
        try {
            await apiAdminUpdateApplication(appId, { notes: noteText });
            await loadData();
            setNoteText('');
            setActionMsg('Note saved');
            setTimeout(() => setActionMsg(''), 2000);
        } catch (err) {
            setActionMsg('Error: ' + err.message);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-accent" />
        </div>
    );

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-mono text-2xl font-bold text-white">Manage Students</h1>
                <p className="text-sm text-white/60 mt-1">View profiles, control rounds, manage placements</p>
            </motion.div>

            {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <div className="relative max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search students..." className="input-dark pl-10" />
            </div>

            {/* Student cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((student, i) => (
                    <motion.div key={student.id}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -3, borderColor: 'rgba(229,77,46,0.15)' }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5 transition-all cursor-pointer"
                        onClick={() => setSelected(student)}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold font-mono">
                                {student.name[0]}
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-white">{student.name}</h3>
                                <p className="text-xs text-white/40">{student.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
                            <span>{student.department || 'N/A'}</span>
                            <span>CGPA: <span className="text-white font-mono">{student.cgpa || 0}</span></span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-white/40">{student.rollNo || ''}</span>
                            <div className="flex items-center gap-2">
                                {student.resume && <span className="flex items-center gap-1 text-[10px] text-green-400"><FileText size={10} />Resume</span>}
                                <span className="text-[10px] text-white/40">{getStudentApps(student.id).length} apps</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <User size={40} className="mx-auto text-gray-700 mb-3" />
                    <p className="text-white/60">No students found</p>
                </div>
            )}

            {/* Student detail + round control modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xl font-bold font-mono">
                                    {selected.name[0]}
                                </div>
                                <div>
                                    <h2 className="font-mono text-lg font-bold text-white">{selected.name}</h2>
                                    <p className="text-sm text-white/60">{selected.department} · CGPA {selected.cgpa || 0}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-white/[0.05] text-white/60"><X size={18} /></button>
                        </div>

                        <div className="p-6 space-y-5">
                            {actionMsg && (
                                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-400 text-center font-medium">
                                    {actionMsg}
                                </div>
                            )}

                            {/* Info row */}
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { label: 'Email', value: selected.email },
                                    { label: 'Phone', value: selected.phone || 'N/A' },
                                    { label: 'Roll No', value: selected.rollNo || 'N/A' },
                                    { label: 'Year', value: `Year ${selected.year || '?'}` },
                                ].map(({ label, value }) => (
                                    <div key={label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                        <p className="text-[10px] text-white/40 uppercase tracking-wider">{label}</p>
                                        <p className="text-xs text-white mt-0.5 truncate">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Skills */}
                            {selected.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {selected.skills.map(s => (
                                        <span key={s} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/80">{s}</span>
                                    ))}
                                </div>
                            )}

                            {/* Resume */}
                            {selected.resume && (
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                    <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-accent" />
                                        <span className="text-xs text-white">{selected.resumeName || 'Resume.pdf'}</span>
                                    </div>
                                    <a href={selected.resume} download={selected.resumeName || 'resume.pdf'}
                                        className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover font-medium">
                                        <Download size={12} /> Download
                                    </a>
                                </div>
                            )}

                            {/* ─── Application Round Control ─── */}
                            <div>
                                <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Application Round Control</h4>
                                <div className="space-y-4">
                                    {getStudentApps(selected.id).map(app => (
                                        <div key={app.id} className="rounded-xl border border-white/[0.04] bg-[#060606] p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-lg">{app.companyLogo}</span>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-white">{app.companyName} · {app.role}</p>
                                                    <p className="text-[10px] text-white/40">{app.packageOffered} · Applied {app.appliedDate}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_CONFIG[app.status]?.bg} ${STATUS_CONFIG[app.status]?.color} border ${STATUS_CONFIG[app.status]?.border}`}>
                                                    {STATUS_CONFIG[app.status]?.label}
                                                </span>
                                            </div>

                                            {/* Round pipeline with admin controls */}
                                            <div className="space-y-2 mb-3">
                                                {app.rounds.map((round, ri) => (
                                                    <div key={ri} className="flex items-center gap-3">
                                                        <div className={`flex items-center gap-1.5 flex-1 px-3 py-1.5 rounded-lg text-xs border
                                                            ${round.status === 'CLEARED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                                round.status === 'ONGOING' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                                    round.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                                        'bg-white/[0.02] text-white/60 border-white/[0.04]'}`}
                                                        >
                                                            {round.status === 'CLEARED' ? <CheckCircle2 size={12} /> :
                                                                round.status === 'ONGOING' ? <CircleDot size={12} /> :
                                                                    round.status === 'REJECTED' ? <AlertCircle size={12} /> :
                                                                        <Circle size={12} />}
                                                            <span className="flex-1">{round.name}</span>
                                                            {round.completedAt && <span className="text-[9px] opacity-60">{round.completedAt}</span>}
                                                        </div>

                                                        {/* Admin action buttons */}
                                                        {round.status !== 'CLEARED' && round.status !== 'REJECTED' && (
                                                            <div className="flex gap-1">
                                                                <button onClick={() => handleRoundAction(app.id, ri, 'CLEARED')}
                                                                    className="px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-[9px] font-medium hover:bg-green-500/20 transition-colors">
                                                                    Clear
                                                                </button>
                                                                <button onClick={() => handleRoundAction(app.id, ri, 'REJECTED')}
                                                                    className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-[9px] font-medium hover:bg-red-500/20 transition-colors">
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Quick status override */}
                                            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                                                <span className="text-[9px] text-white/40 uppercase mr-1">Override:</span>
                                                {['selected', 'rejected'].map(s => (
                                                    <button key={s} onClick={() => handleStatusOverride(app.id, s)}
                                                        className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors
                                                            ${s === 'selected' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' :
                                                                'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}>
                                                        {s === 'selected' ? '✓ Select' : '✗ Reject'}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Admin notes */}
                                            {app.notes && (
                                                <p className="mt-2 text-[10px] text-white/60 italic flex items-start gap-1">
                                                    <MessageSquare size={10} className="mt-0.5 flex-shrink-0" /> {app.notes}
                                                </p>
                                            )}
                                            <div className="flex gap-2 mt-2">
                                                <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)}
                                                    placeholder="Add admin note..." className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[10px] text-white/80 placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-accent/30" />
                                                <button onClick={() => handleAddNote(app.id)}
                                                    className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-[10px] font-medium hover:bg-accent/20 transition-colors">
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

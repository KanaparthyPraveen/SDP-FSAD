import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiGetCompanies, apiGetApplications, apiApply } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import {
    Search, MapPin, Calendar, Users, X, ArrowRight, Briefcase,
    ShieldCheck, ShieldX, Loader2, SlidersHorizontal, ChevronDown,
    CheckCircle2, Clock
} from 'lucide-react';

// Eligibility check
function checkEligibility(company, user) {
    if (!user || !company) return { eligible: false, reasons: ['Missing data'] };
    const reasons = [];
    if (company.minCgpa && (user.cgpa || 0) < company.minCgpa)
        reasons.push(`CGPA ${user.cgpa || 0} < required ${company.minCgpa}`);
    if (company.maxBacklogs !== undefined && (user.backlogs || 0) > company.maxBacklogs)
        reasons.push(`${user.backlogs} backlogs > allowed ${company.maxBacklogs}`);
    if (company.allowedBranches?.length > 0) {
        const branch = user.department || user.branch || '';
        if (!company.allowedBranches.some(b => b.toLowerCase() === branch.toLowerCase()))
            reasons.push(`Branch "${branch}" not eligible`);
    }
    return { eligible: reasons.length === 0, reasons };
}

const STATUS_BADGE = {
    active:   'bg-green-500/15 text-green-400 border-green-500/25',
    upcoming: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
    closed:   'bg-white/5 text-white/40 border-white/10',
};

const SORT_OPTIONS = [
    { value: 'default',  label: 'Default'         },
    { value: 'ctc_high', label: 'Highest CTC'      },
    { value: 'cgpa_low', label: 'Lowest CGPA Req.' },
    { value: 'openings', label: 'Most Openings'    },
];

export default function Companies() {
    const { user }    = useAuth();
    const { toast }   = useToast();

    const [companies,     setCompanies]     = useState([]);
    const [applications,  setApplications]  = useState([]);
    const [search,        setSearch]        = useState('');
    const [statusFilter,  setStatusFilter]  = useState('all');
    const [eligFilter,    setEligFilter]    = useState(false);
    const [sortBy,        setSortBy]        = useState('default');
    const [showSort,      setShowSort]      = useState(false);
    const [selected,      setSelected]      = useState(null);
    const [coverLetter,   setCoverLetter]   = useState('');
    const [applying,      setApplying]      = useState(false);
    const [loading,       setLoading]       = useState(true);
    const [confirmApply,  setConfirmApply]  = useState(false);

    const loadData = useCallback(async () => {
        try {
            const [c, a] = await Promise.all([apiGetCompanies(), apiGetApplications()]);
            setCompanies(c || []);
            setApplications(a || []);
        } catch (err) {
            toast('Failed to load company data', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const hasApplied = useCallback(
        (companyId) => applications.some(a => a.companyId === companyId),
        [applications]
    );

    // Filtering + sorting pipeline
    const filtered = useMemo(() => {
        let list = companies.filter(c => {
            const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                (c.role || '').toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === 'all' || c.status === statusFilter;
            const elig = eligFilter ? checkEligibility(c, user).eligible : true;
            return matchSearch && matchStatus && elig;
        });

        if (sortBy === 'ctc_high') {
            list = [...list].sort((a, b) => parseFloat(b.ctc) - parseFloat(a.ctc));
        } else if (sortBy === 'cgpa_low') {
            list = [...list].sort((a, b) => (a.minCgpa || 0) - (b.minCgpa || 0));
        } else if (sortBy === 'openings') {
            list = [...list].sort((a, b) => (b.openings || 0) - (a.openings || 0));
        }
        return list;
    }, [companies, search, statusFilter, eligFilter, sortBy, user]);

    const handleApply = async () => {
        if (!selected) return;
        setConfirmApply(false);
        setApplying(true);
        try {
            await apiApply(selected.id, coverLetter);
            await loadData();
            toast(`Applied to ${selected.name} successfully! 🎉`, 'success');
            setCoverLetter('');
            setSelected(null);
        } catch (err) {
            toast(err.message || 'Failed to apply. Please try again.', 'error');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-40 bg-white/[0.04] rounded-xl animate-pulse" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="h-44 rounded-2xl bg-white/[0.03] animate-pulse border border-white/[0.04]" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-mono text-2xl font-bold text-white">Companies</h1>
                <p className="text-sm text-white/60 mt-1">Browse and apply to active placement drives</p>
            </motion.div>

            {/* Search + Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                        type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search companies or roles..."
                        className="input-dark pl-10"
                    />
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                    {/* Status filter */}
                    {['all','active','upcoming','closed'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${
                                statusFilter === s
                                    ? 'bg-accent/15 text-accent border-accent/25'
                                    : 'bg-white/[0.03] text-white/60 border-white/[0.06] hover:text-white/80'
                            }`}>
                            {s}
                        </button>
                    ))}

                    {/* Eligible only toggle */}
                    <button onClick={() => setEligFilter(v => !v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            eligFilter
                                ? 'bg-green-500/15 text-green-400 border-green-500/25'
                                : 'bg-white/[0.03] text-white/60 border-white/[0.06] hover:text-white/80'
                        }`}>
                        <ShieldCheck size={12} /> Eligible Only
                    </button>

                    {/* Sort dropdown */}
                    <div className="relative">
                        <button onClick={() => setShowSort(v => !v)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border bg-white/[0.03] text-white/60 border-white/[0.06] hover:text-white/80 transition-all">
                            <SlidersHorizontal size={12} />
                            Sort
                            <ChevronDown size={12} className={`transition-transform ${showSort ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {showSort && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                    className="absolute right-0 top-full mt-1 z-20 bg-[#111] border border-white/[0.08] rounded-xl overflow-hidden shadow-xl min-w-[160px]"
                                >
                                    {SORT_OPTIONS.map(o => (
                                        <button key={o.value}
                                            onClick={() => { setSortBy(o.value); setShowSort(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                                                sortBy === o.value ? 'text-accent bg-accent/10' : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                                            }`}
                                        >{o.label}</button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Results count */}
            <p className="text-xs text-white/40">Showing {filtered.length} of {companies.length} companies</p>

            {/* Company grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Briefcase size={40} className="text-white/10" />
                    <p className="text-white/50 font-medium">No companies match your filters</p>
                    <button onClick={() => { setSearch(''); setStatusFilter('all'); setEligFilter(false); }}
                        className="text-xs text-accent hover:underline">Clear filters</button>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((company, i) => {
                        const applied = hasApplied(company.id);
                        const elig = checkEligibility(company, user);
                        return (
                            <motion.div key={company.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -3, borderColor: applied ? undefined : 'rgba(229,77,46,0.2)' }}
                                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                                className={`group rounded-2xl border bg-[#0a0a0a] p-5 transition-all cursor-pointer relative overflow-hidden ${
                                    applied ? 'border-green-500/20' : 'border-white/[0.06]'
                                }`}
                                onClick={() => setSelected(company)}
                            >
                                {/* Applied ribbon */}
                                {applied && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 text-[10px] font-semibold">
                                        <CheckCircle2 size={9} /> Applied
                                    </div>
                                )}

                                <div className="flex items-start gap-3 mb-3 pr-16">
                                    <span className="text-2xl">{company.logo}</span>
                                    <div>
                                        <h3 className="font-semibold text-white text-sm">{company.name}</h3>
                                        <p className="text-xs text-white/50">{company.role}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-mono text-base font-bold text-accent">{company.ctc}</span>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_BADGE[company.status] || STATUS_BADGE.closed}`}>
                                        {company.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-white/50 mb-3">
                                    <span className="flex items-center gap-1"><MapPin size={11} />{company.location}</span>
                                    <span className="flex items-center gap-1"><Users size={11} />{company.openings ?? '—'} slots left</span>
                                </div>

                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {company.skills?.slice(0, 3).map(s => (
                                        <span key={s} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/70">{s}</span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px]">
                                        <span className="flex items-center gap-1 text-white/40">
                                            <Calendar size={10} />
                                            {company.deadline ? new Date(company.deadline).toLocaleDateString() : 'No deadline'}
                                        </span>
                                        {elig.eligible
                                            ? <span className="flex items-center gap-0.5 text-green-400 font-medium"><ShieldCheck size={10} /> Eligible</span>
                                            : <span className="flex items-center gap-0.5 text-red-400 font-medium" title={elig.reasons[0]}><ShieldX size={10} /> Ineligible</span>
                                        }
                                    </div>
                                    {applied ? (
                                        <span className="text-xs text-green-400 font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> Applied</span>
                                    ) : (
                                        <span className="text-xs text-accent font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Apply <ArrowRight size={12} />
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Company detail modal */}
            <AnimatePresence>
                {selected && (() => {
                    const applied = hasApplied(selected.id);
                    const elig = checkEligibility(selected, user);
                    return (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{selected.logo}</span>
                                        <div>
                                            <h2 className="font-mono text-lg font-bold text-white">{selected.name}</h2>
                                            <p className="text-sm text-white/60">{selected.role}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-white/[0.05] text-white/60 hover:text-white transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-5">
                                    {/* Stats row */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: 'CTC', value: selected.ctc, accent: true },
                                            { label: 'Slots Left', value: selected.openings ?? '—' },
                                            { label: 'Location', value: selected.location },
                                        ].map(s => (
                                            <div key={s.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                                                <p className={`font-mono text-lg font-bold ${s.accent ? 'text-accent' : 'text-white'}`}>{s.value}</p>
                                                <p className="text-[10px] text-white/40 mt-0.5">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Eligibility alert */}
                                    {!elig.eligible && (
                                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                            <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5"><ShieldX size={12} /> Not Eligible</p>
                                            <p className="text-[11px] text-red-400/70 mt-1">{elig.reasons[0]}</p>
                                        </div>
                                    )}

                                    {selected.description && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">About</h4>
                                            <p className="text-sm text-white/80 leading-relaxed">{selected.description}</p>
                                        </div>
                                    )}

                                    {selected.skills?.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Required Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selected.skills.map(s => (
                                                    <span key={s} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/80">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selected.rounds?.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Selection Rounds</h4>
                                            <div className="space-y-2">
                                                {selected.rounds.map((r, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm">
                                                        <span className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-xs text-white/60 shrink-0">{i+1}</span>
                                                        <span className="text-white/80 flex-1">{r.name}</span>
                                                        {r.duration && <span className="text-xs text-white/40">{r.duration}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Apply section */}
                                    <div className="border-t border-white/[0.06] pt-5">
                                        {applied ? (
                                            <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                                <CheckCircle2 size={16} className="text-green-400" />
                                                <p className="text-green-400 font-semibold text-sm">You have already applied</p>
                                            </div>
                                        ) : (
                                            <>
                                                <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Cover Letter <span className="text-white/30 normal-case font-normal">(Optional)</span></h4>
                                                <textarea
                                                    value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                                                    placeholder="Why are you a great fit?"
                                                    className="input-dark h-20 resize-none mb-3"
                                                />
                                                <button
                                                    onClick={() => setConfirmApply(true)}
                                                    disabled={!elig.eligible || applying || (selected.openings !== undefined && selected.openings <= 0)}
                                                    className={`w-full flex items-center justify-center gap-2 ${
                                                        elig.eligible && (selected.openings === undefined || selected.openings > 0)
                                                            ? 'btn-primary'
                                                            : 'bg-white/[0.04] text-white/30 border border-white/[0.06] px-5 py-2.5 rounded-xl cursor-not-allowed'
                                                    }`}
                                                >
                                                    {applying ? <Loader2 size={16} className="animate-spin" /> : null}
                                                    {applying ? 'Submitting...'
                                                        : !elig.eligible ? elig.reasons[0] || 'Not Eligible'
                                                        : selected.openings <= 0 ? 'No Slots Available'
                                                        : 'Apply Now'}
                                                    {!applying && elig.eligible && selected.openings > 0 && <ArrowRight size={16} />}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    );
                })()}
            </AnimatePresence>

            {/* Confirmation dialog */}
            <ConfirmDialog
                open={confirmApply}
                title={`Apply to ${selected?.name}?`}
                message="This will submit your profile and cover letter. You cannot undo this action."
                confirmLabel="Yes, Apply Now"
                onConfirm={handleApply}
                onCancel={() => setConfirmApply(false)}
            />
        </div>
    );
}

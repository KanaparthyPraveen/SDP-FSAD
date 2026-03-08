import { useState } from 'react';
import { motion } from 'framer-motion';
import { getCompanies, checkEligibility } from '../../data/companies';
import { getApplications, applyToCompany } from '../../data/applications';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Calendar, Users, ChevronDown, X, ArrowRight, Briefcase, ShieldCheck, ShieldX } from 'lucide-react';

export default function Companies() {
    const { user } = useAuth();
    const [companies] = useState(getCompanies());
    const [applications, setApplications] = useState(getApplications());
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [applyMsg, setApplyMsg] = useState('');

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase())
    );

    const hasApplied = (companyId) => applications.some(a => a.companyId === companyId);

    const handleApply = (company) => {
        const result = applyToCompany(company, coverLetter, user);
        if (result.success) {
            setApplications(getApplications());
            setApplyMsg('Applied successfully!');
            setCoverLetter('');
            setTimeout(() => { setApplyMsg(''); setSelected(null); }, 1500);
        } else {
            setApplyMsg(result.error);
        }
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-mono text-2xl font-bold text-white">Companies</h1>
                <p className="text-sm text-gray-500 mt-1">Browse and apply to active placement drives</p>
            </motion.div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search companies or roles..."
                    className="input-dark pl-10" />
            </div>

            {/* Company grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((company, i) => (
                    <motion.div key={company.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4, borderColor: 'rgba(229,77,46,0.2)' }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="group rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5 transition-all cursor-pointer"
                        onClick={() => setSelected(company)}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{company.logo}</span>
                                <div>
                                    <h3 className="font-medium text-white text-sm">{company.name}</h3>
                                    <p className="text-xs text-gray-600">{company.role}</p>
                                </div>
                            </div>
                            <span className="font-mono text-sm font-semibold text-accent">{company.ctc}</span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1"><MapPin size={12} />{company.location}</span>
                            <span className="flex items-center gap-1"><Users size={12} />{company.openings} seats</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {company.skills?.slice(0, 3).map(s => (
                                <span key={s} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-gray-400">{s}</span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-600 flex items-center gap-1">
                                    <Calendar size={10} /> {new Date(company.deadline).toLocaleDateString()}
                                </span>
                                {(() => {
                                    const elig = checkEligibility(company, user);
                                    return elig.eligible ? (
                                        <span className="flex items-center gap-0.5 text-[10px] text-green-400 font-medium">
                                            <ShieldCheck size={10} /> Eligible
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-0.5 text-[10px] text-red-400 font-medium" title={elig.reasons[0]}>
                                            <ShieldX size={10} /> Not Eligible
                                        </span>
                                    );
                                })()}
                            </div>
                            {hasApplied(company.id) ? (
                                <span className="text-xs text-green-400 font-medium">✓ Applied</span>
                            ) : (
                                <span className="text-xs text-accent group-hover:text-accent-hover font-medium flex items-center gap-1">
                                    Apply <ArrowRight size={12} />
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <Briefcase size={40} className="mx-auto text-gray-700 mb-3" />
                    <p className="text-gray-500">No companies found</p>
                </div>
            )}

            {/* Company detail modal */}
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
                                <span className="text-3xl">{selected.logo}</span>
                                <div>
                                    <h2 className="font-mono text-lg font-bold text-white">{selected.name}</h2>
                                    <p className="text-sm text-gray-500">{selected.role}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-500">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                                    <p className="font-mono text-lg font-bold text-accent">{selected.ctc}</p>
                                    <p className="text-[10px] text-gray-600">CTC</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                                    <p className="font-mono text-lg font-bold text-white">{selected.openings}</p>
                                    <p className="text-[10px] text-gray-600">Openings</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                                    <p className="font-mono text-lg font-bold text-white">{selected.location}</p>
                                    <p className="text-[10px] text-gray-600">Location</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About</h4>
                                <p className="text-sm text-gray-400 leading-relaxed">{selected.description}</p>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Eligibility</h4>
                                <p className="text-sm text-gray-400">{selected.eligibility}</p>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Selection Rounds</h4>
                                <div className="space-y-2">
                                    {selected.rounds?.map((r, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm">
                                            <span className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-xs text-gray-500">{i + 1}</span>
                                            <span className="text-gray-300">{r.name}</span>
                                            <span className="text-xs text-gray-600 ml-auto">{r.duration}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {!hasApplied(selected.id) ? (() => {
                                const elig = checkEligibility(selected, user);
                                return (
                                    <div className="border-t border-white/[0.06] pt-5">
                                        {!elig.eligible && (
                                            <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                                <p className="text-xs text-red-400 font-medium flex items-center gap-1.5"><ShieldX size={12} /> Not Eligible</p>
                                                <p className="text-[10px] text-red-400/70 mt-1">{elig.reasons[0]}</p>
                                            </div>
                                        )}
                                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cover Letter (Optional)</h4>
                                        <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                                            placeholder="Why are you a good fit?"
                                            className="input-dark h-20 resize-none mb-3" />
                                        <button onClick={() => handleApply(selected)} disabled={!elig.eligible}
                                            className={`w-full flex items-center justify-center gap-2 ${elig.eligible ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'}`}>
                                            {elig.eligible ? 'Apply Now' : 'Not Eligible'} <ArrowRight size={16} />
                                        </button>
                                    </div>
                                );
                            })() : (
                                <div className="border-t border-white/[0.06] pt-5 text-center">
                                    <p className="text-green-400 font-medium">✓ You have already applied</p>
                                </div>
                            )}

                            {applyMsg && (
                                <p className={`text-sm text-center ${applyMsg.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                                    {applyMsg}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

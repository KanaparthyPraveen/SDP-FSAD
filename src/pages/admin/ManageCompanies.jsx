import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { apiGetCompanies, apiCreateCompany, apiDeleteCompany } from '../../services/api';
import { Search, Plus, Trash2, X, AlertCircle, Loader2, Users } from 'lucide-react';
import { apiGetApplicationsByCompany } from '../../services/api';
import { useToast } from '../../components/ui/Toast';

export default function ManageCompanies() {
    const { toast }         = useToast();
    const [companies, setCompanies] = useState([]);
    const [search, setSearch]       = useState('');
    const [showAdd, setShowAdd]     = useState(false);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState('');
    const [saving, setSaving]       = useState(false);

    const [selectedCompanyApps, setSelectedCompanyApps] = useState(null); // the company object
    const [companyAppsData, setCompanyAppsData] = useState([]);
    const [appsLoading, setAppsLoading] = useState(false);

    const [newCompany, setNewCompany] = useState({
        name: '', role: '', ctc: '', location: '', openings: '',
        minCgpa: '', maxBacklogs: '', deadline: '', description: '', logo: '🏢',
        eligibility: '', skills: '',
    });

    const loadCompanies = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiGetCompanies();
            setCompanies(data);
            setError('');
        } catch (err) {
            setError('Failed to load companies — ' + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadCompanies(); }, [loadCompanies]);

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await apiCreateCompany({
                ...newCompany,
                openings: parseInt(newCompany.openings) || 0,
                minCgpa: parseFloat(newCompany.minCgpa) || 0,
                maxBacklogs: parseInt(newCompany.maxBacklogs) || 0,
                skills: newCompany.skills.split(',').map(s => s.trim()).filter(Boolean),
                allowedBranches: ['Computer Science', 'Information Technology', 'Electronics'],
                packageOffered: newCompany.ctc,
                type: 'Full-time',
                dresscode: 'Business Casual',
                registrations: 0,
                status: 'active',
            });
            await loadCompanies();
            setShowAdd(false);
            setNewCompany({ name: '', role: '', ctc: '', location: '', openings: '', minCgpa: '', maxBacklogs: '', deadline: '', description: '', logo: '🏢', eligibility: '', skills: '' });
        } catch (err) {
            setError('Failed to create company — ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this company?')) return;
        try {
            await apiDeleteCompany(id);
            setCompanies(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            setError('Failed to delete — ' + err.message);
        }
    };

    const handleViewApps = async (company) => {
        setSelectedCompanyApps(company);
        setAppsLoading(true);
        try {
            const data = await apiGetApplicationsByCompany(company.id);
            setCompanyAppsData(data || []);
        } catch (err) {
            setError('Failed to fetch applications — ' + err.message);
        } finally {
            setAppsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-mono text-2xl font-bold text-white">Manage Companies</h1>
                        <p className="text-sm text-white/60 mt-1">Add, edit, and manage placement companies</p>
                    </div>
                    <button onClick={() => setShowAdd(true)} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                        <Plus size={16} /> Add Company
                    </button>
                </div>
            </motion.div>

            {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <div className="relative max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search companies..." className="input-dark pl-10" />
            </div>

            {/* Company table */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 size={24} className="animate-spin text-accent" />
                    </div>
                ) : (
                    <table className="w-full table-dark">
                        <thead>
                            <tr>
                                <th>Company</th><th>Role</th><th>CTC</th>
                                <th>Location</th><th>Openings</th><th>Deadline</th><th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c.id}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{c.logo}</span>
                                            <span className="font-medium text-white">{c.name}</span>
                                        </div>
                                    </td>
                                    <td>{c.role}</td>
                                    <td className="font-mono text-accent">{c.ctc}</td>
                                    <td>{c.location}</td>
                                    <td>{c.openings}</td>
                                    <td className="text-xs">{c.deadline ? new Date(c.deadline).toLocaleDateString() : '—'}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleViewApps(c)}
                                                className="p-1.5 rounded-lg hover:bg-blue-500/10 text-white/40 hover:text-blue-400 transition-colors" title="View Candidates">
                                                <Users size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(c.id)}
                                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors" title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} className="text-center py-10 text-white/40">No companies found</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add company modal */}
            {showAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                            <h2 className="font-mono text-lg font-bold text-white">Add Company</h2>
                            <button onClick={() => setShowAdd(false)} className="p-2 rounded-lg hover:bg-white/[0.05] text-white/60"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleAdd} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5">Company Name</label>
                                    <input required value={newCompany.name} onChange={e => setNewCompany({ ...newCompany, name: e.target.value })} className="input-dark" placeholder="Google" />
                                </div>
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5">Role</label>
                                    <input required value={newCompany.role} onChange={e => setNewCompany({ ...newCompany, role: e.target.value })} className="input-dark" placeholder="Software Engineer" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5">CTC</label>
                                    <input required value={newCompany.ctc} onChange={e => setNewCompany({ ...newCompany, ctc: e.target.value })} className="input-dark" placeholder="18 LPA" />
                                </div>
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5">Location</label>
                                    <input value={newCompany.location} onChange={e => setNewCompany({ ...newCompany, location: e.target.value })} className="input-dark" placeholder="Bangalore" />
                                </div>
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5">Openings</label>
                                    <input type="number" value={newCompany.openings} onChange={e => setNewCompany({ ...newCompany, openings: e.target.value })} className="input-dark" placeholder="15" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5">Min CGPA</label>
                                    <input type="number" step="0.1" value={newCompany.minCgpa} onChange={e => setNewCompany({ ...newCompany, minCgpa: e.target.value })} className="input-dark" placeholder="7.0" />
                                </div>
                                <div>
                                    <label className="block text-xs text-white/60 mb-1.5">Deadline</label>
                                    <input type="date" value={newCompany.deadline} onChange={e => setNewCompany({ ...newCompany, deadline: e.target.value })} className="input-dark" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-white/60 mb-1.5">Skills (comma-separated)</label>
                                <input value={newCompany.skills} onChange={e => setNewCompany({ ...newCompany, skills: e.target.value })} className="input-dark" placeholder="React, Node.js, Python" />
                            </div>
                            <div>
                                <label className="block text-xs text-white/60 mb-1.5">Description</label>
                                <textarea value={newCompany.description} onChange={e => setNewCompany({ ...newCompany, description: e.target.value })} className="input-dark resize-none h-20" placeholder="About the role..." />
                            </div>
                            <button type="submit" disabled={saving} className="w-full btn-primary flex items-center justify-center gap-2">
                                {saving ? <Loader2 size={16} className="animate-spin" /> : 'Add Company'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Applications per Company Modal */}
            {selectedCompanyApps && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                            <div>
                                <h3 className="font-mono font-semibold text-white flex items-center gap-2">
                                    <span className="text-xl">{selectedCompanyApps.logo}</span>
                                    {selectedCompanyApps.name} Candidates
                                </h3>
                            </div>
                            <button onClick={() => setSelectedCompanyApps(null)} className="text-white/50 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            {appsLoading ? (
                                <div className="flex justify-center p-8"><Loader2 size={24} className="animate-spin text-accent" /></div>
                            ) : companyAppsData.length === 0 ? (
                                <div className="text-center py-8 text-white/50">No students have applied yet.</div>
                            ) : (
                                <div className="space-y-3">
                                    {companyAppsData.map(app => (
                                        <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/[0.04] bg-[#0d0d0d] gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/80 font-mono border border-white/10 shrink-0">
                                                    {app.applicant?.name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{app.applicant?.name}</p>
                                                    <p className="text-[10px] text-white/50 mt-0.5">{app.applicant?.email} • {app.applicant?.department}</p>
                                                    <p className="text-[10px] text-white/50">CGPA: {app.applicant?.cgpa} | Roll: {app.applicant?.rollNo}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:items-end gap-1 shrink-0">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold text-center border ${
                                                    app.status === 'selected' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    app.status === 'interview' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                    {app.status ? app.status.toUpperCase() : 'APPLIED'}
                                                </span>
                                                <span className="text-[10px] text-white/40">Round: {app.currentRound}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

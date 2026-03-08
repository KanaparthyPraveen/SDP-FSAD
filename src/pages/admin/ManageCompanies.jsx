import { useState } from 'react';
import { motion } from 'framer-motion';
import { getCompanies, addCompany, deleteCompany } from '../../data/companies';
import { getApplications } from '../../data/applications';
import { Search, Plus, Trash2, X, Building2, MapPin, Users } from 'lucide-react';

export default function ManageCompanies() {
    const [companies, setCompanies] = useState(getCompanies());
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [newCompany, setNewCompany] = useState({
        name: '', role: '', ctc: '', location: '', openings: '',
        minCgpa: '', maxBacklogs: '', deadline: '', description: '', logo: '🏢',
        eligibility: '', skills: '',
    });

    const applications = getApplications();
    const filtered = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    const handleAdd = (e) => {
        e.preventDefault();
        const company = addCompany({
            ...newCompany,
            openings: parseInt(newCompany.openings) || 0,
            minCgpa: parseFloat(newCompany.minCgpa) || 0,
            maxBacklogs: parseInt(newCompany.maxBacklogs) || 0,
            skills: newCompany.skills.split(',').map(s => s.trim()).filter(Boolean),
            allowedBranches: ['Computer Science', 'Information Technology', 'Electronics'],
            package: newCompany.ctc,
            type: 'Full-time',
            dresscode: 'Business Casual',
            registrations: 0,
            ctcBreakdown: { base: newCompany.ctc, bonus: '0', stocks: '0' },
        });
        setCompanies(getCompanies());
        setShowAdd(false);
        setNewCompany({ name: '', role: '', ctc: '', location: '', openings: '', minCgpa: '', maxBacklogs: '', deadline: '', description: '', logo: '🏢', eligibility: '', skills: '' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this company?')) {
            deleteCompany(id);
            setCompanies(getCompanies());
        }
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-mono text-2xl font-bold text-white">Manage Companies</h1>
                        <p className="text-sm text-gray-500 mt-1">Add, edit, and manage placement companies</p>
                    </div>
                    <button onClick={() => setShowAdd(true)} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                        <Plus size={16} /> Add Company
                    </button>
                </div>
            </motion.div>

            <div className="relative max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search companies..." className="input-dark pl-10" />
            </div>

            {/* Company table */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
                <table className="w-full table-dark">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Role</th>
                            <th>CTC</th>
                            <th>Location</th>
                            <th>Openings</th>
                            <th>Apps</th>
                            <th>Deadline</th>
                            <th></th>
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
                                <td>{applications.filter(a => a.companyId === c.id).length}</td>
                                <td className="text-xs">{new Date(c.deadline).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleDelete(c.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add company modal */}
            {showAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                            <h2 className="font-mono text-lg font-bold text-white">Add Company</h2>
                            <button onClick={() => setShowAdd(false)} className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-500">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1.5">Company Name</label>
                                    <input required value={newCompany.name} onChange={e => setNewCompany({ ...newCompany, name: e.target.value })}
                                        className="input-dark" placeholder="Google" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1.5">Role</label>
                                    <input required value={newCompany.role} onChange={e => setNewCompany({ ...newCompany, role: e.target.value })}
                                        className="input-dark" placeholder="Software Engineer" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1.5">CTC</label>
                                    <input required value={newCompany.ctc} onChange={e => setNewCompany({ ...newCompany, ctc: e.target.value })}
                                        className="input-dark" placeholder="18 LPA" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1.5">Location</label>
                                    <input value={newCompany.location} onChange={e => setNewCompany({ ...newCompany, location: e.target.value })}
                                        className="input-dark" placeholder="Bangalore" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1.5">Openings</label>
                                    <input type="number" value={newCompany.openings} onChange={e => setNewCompany({ ...newCompany, openings: e.target.value })}
                                        className="input-dark" placeholder="15" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1.5">Min CGPA</label>
                                    <input type="number" step="0.1" value={newCompany.minCgpa} onChange={e => setNewCompany({ ...newCompany, minCgpa: e.target.value })}
                                        className="input-dark" placeholder="7.0" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1.5">Deadline</label>
                                    <input type="date" value={newCompany.deadline} onChange={e => setNewCompany({ ...newCompany, deadline: e.target.value })}
                                        className="input-dark" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">Skills (comma-separated)</label>
                                <input value={newCompany.skills} onChange={e => setNewCompany({ ...newCompany, skills: e.target.value })}
                                    className="input-dark" placeholder="React, Node.js, Python" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">Description</label>
                                <textarea value={newCompany.description} onChange={e => setNewCompany({ ...newCompany, description: e.target.value })}
                                    className="input-dark resize-none h-20" placeholder="About the role..." />
                            </div>
                            <button type="submit" className="w-full btn-primary">Add Company</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiGetCompanies } from '../../services/api';
import { Search, Command, ArrowRight, Building2, LayoutDashboard, FileText, User, Settings, LogOut } from 'lucide-react';

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [companiesList, setCompaniesList] = useState([]);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isStudent = user?.role === 'student';
    const prefix = isStudent ? '/student' : '/admin';

    useEffect(() => {
        if (open) {
            apiGetCompanies()
                .then(setCompaniesList)
                .catch(err => console.error("Error fetching companies map:", err));
        }
    }, [open]);

    const pages = isStudent ? [
        { label: 'Dashboard', icon: LayoutDashboard, path: `${prefix}/dashboard`, group: 'Pages' },
        { label: 'Companies', icon: Building2, path: `${prefix}/companies`, group: 'Pages' },
        { label: 'Applications', icon: FileText, path: `${prefix}/applications`, group: 'Pages' },
        { label: 'Profile', icon: User, path: `${prefix}/profile`, group: 'Pages' },
    ] : [
        { label: 'Dashboard', icon: LayoutDashboard, path: `${prefix}/dashboard`, group: 'Pages' },
        { label: 'Manage Companies', icon: Building2, path: `${prefix}/companies`, group: 'Pages' },
        { label: 'Manage Students', icon: User, path: `${prefix}/students`, group: 'Pages' },
    ];

    const actions = [
        { label: 'Logout', icon: LogOut, action: () => { logout(); navigate('/'); }, group: 'Actions' },
    ];

    const companies = companiesList.map(c => ({
        label: `${c.name} — ${c.role}`,
        icon: Building2,
        path: isStudent ? '/student/companies' : '/admin/companies',
        group: 'Companies',
    }));

    const all = [...pages, ...actions, ...companies];

    const filtered = query
        ? all.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
        : all;

    const grouped = filtered.reduce((acc, item) => {
        if (!acc[item.group]) acc[item.group] = [];
        acc[item.group].push(item);
        return acc;
    }, {});

    const flatFiltered = filtered;

    const runAction = useCallback((item) => {
        setOpen(false);
        setQuery('');
        if (item.action) item.action();
        else if (item.path) navigate(item.path);
    }, [navigate]);

    // Keyboard shortcut: Ctrl+K
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(prev => !prev);
                setQuery('');
                setActiveIndex(0);
            }
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 100);
    }, [open]);

    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(i => Math.min(i + 1, flatFiltered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (flatFiltered[activeIndex]) runAction(flatFiltered[activeIndex]);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="relative w-full max-w-lg mx-4 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                    <Search size={18} className="text-gray-500 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
                        onKeyDown={handleKeyDown}
                        placeholder="Search pages, companies, actions..."
                        className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 outline-none"
                    />
                    <kbd className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] text-gray-500 font-mono">ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-[50vh] overflow-y-auto py-2">
                    {Object.entries(grouped).map(([group, items]) => (
                        <div key={group}>
                            <p className="px-5 py-1.5 text-[10px] font-mono uppercase tracking-widest text-gray-600">{group}</p>
                            {items.map((item, i) => {
                                const globalIndex = flatFiltered.indexOf(item);
                                const isActive = globalIndex === activeIndex;
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={`${item.label}-${i}`}
                                        className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${isActive ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'}`}
                                        onClick={() => runAction(item)}
                                        onMouseEnter={() => setActiveIndex(globalIndex)}
                                    >
                                        <Icon size={16} className={isActive ? 'text-accent' : 'text-gray-500'} />
                                        <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>{item.label}</span>
                                        {isActive && <ArrowRight size={12} className="ml-auto text-accent" />}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                    {flatFiltered.length === 0 && (
                        <p className="text-center text-sm text-gray-600 py-8">No results found</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 px-5 py-3 border-t border-white/[0.06] text-[10px] text-gray-600">
                    <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] font-mono">↑↓</kbd> Navigate</span>
                    <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] font-mono">↵</kbd> Select</span>
                    <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] font-mono">Esc</kbd> Close</span>
                </div>
            </div>
        </div>
    );
}

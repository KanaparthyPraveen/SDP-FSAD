import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, BookOpen, Hash, Calendar, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        department: 'Computer Science', rollNo: '', year: '4',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const result = await register({
                name: form.name, email: form.email, password: form.password,
                department: form.department, rollNo: form.rollNo, year: parseInt(form.year),
            });
            if (result.success) {
                navigate('/student/dashboard');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Connection error — is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const departments = ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical', 'Civil'];

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="font-mono text-2xl font-bold text-white mb-2">Create account</h1>
                <p className="text-sm text-white/60">Join PlaceIQ and start your placement journey</p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-8">
                {error && (
                    <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-2">Full Name</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                            <input type="text" required value={form.name}
                                onChange={e => update('name', e.target.value)}
                                placeholder="Praveen Kumar" className="input-dark pl-10" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-2">Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                            <input type="email" required value={form.email}
                                onChange={e => update('email', e.target.value)}
                                placeholder="student@university.com" className="input-dark pl-10" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-2">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                                <input type="password" required value={form.password}
                                    onChange={e => update('password', e.target.value)}
                                    placeholder="••••••••" className="input-dark pl-10" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-2">Confirm</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                                <input type="password" required value={form.confirmPassword}
                                    onChange={e => update('confirmPassword', e.target.value)}
                                    placeholder="••••••••" className="input-dark pl-10" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-2">Department</label>
                        <div className="relative">
                            <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                            <select value={form.department} onChange={e => update('department', e.target.value)}
                                className="input-dark pl-10 appearance-none cursor-pointer">
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-2">Roll No</label>
                            <div className="relative">
                                <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                                <input type="text" value={form.rollNo}
                                    onChange={e => update('rollNo', e.target.value)}
                                    placeholder="CS21B001" className="input-dark pl-10" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-2">Year</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                                <select value={form.year} onChange={e => update('year', e.target.value)}
                                    className="input-dark pl-10 appearance-none cursor-pointer">
                                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full btn-primary flex items-center justify-center gap-2 py-3 mt-2">
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Create Account <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-white/60">
                        Already have an account?{' '}
                        <Link to="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

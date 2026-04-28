import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await login(form.email, form.password);
            if (result.success) {
                navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Connection error — is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="font-mono text-2xl font-bold text-white mb-2">Welcome back</h1>
                <p className="text-sm text-white/70">Sign in to your PlaceIQ account</p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-8">
                {error && (
                    <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-2">Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60" />
                            <input type="email" required value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="you@example.com"
                                className="input-dark pl-10" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-2">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60" />
                            <input type="password" required value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                className="input-dark pl-10" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full btn-primary flex items-center justify-center gap-2 py-3">
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Sign in <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-white/70">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="text-accent hover:text-accent-hover font-medium transition-colors">
                            Create account
                        </Link>
                    </p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/[0.06]">
                    <p className="text-xs text-white/60 text-center mb-3">Quick fill</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <button type="button"
                            onClick={() => setForm({ email: 'praveen@student.com', password: 'Admin@1234' })}
                            className="p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-white/70 transition-all text-center">
                            👨‍🎓 Student
                        </button>
                        <button type="button"
                            onClick={() => setForm({ email: 'admin@pis.com', password: 'Admin@1234' })}
                            className="p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-white/70 transition-all text-center">
                            🔑 Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

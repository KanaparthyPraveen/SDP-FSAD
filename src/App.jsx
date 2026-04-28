import { Outlet, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';

import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import StudentDashboard from './pages/student/Dashboard';
import Companies from './pages/student/Companies';
import Applications from './pages/student/Applications';
import Profile from './pages/student/Profile';
import AIAnalytics from './pages/student/AIAnalytics';

import AdminDashboard from './pages/admin/Dashboard';
import ManageCompanies from './pages/admin/ManageCompanies';
import ManageStudents from './pages/admin/ManageStudents';
import ManageApplications from './pages/admin/ManageApplications';

function RequireRole({ role }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
    return <Outlet />;
}

export default function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <Routes>
                    {/* Landing */}
                    <Route path="/" element={<LandingRedirect />} />

                    {/* Auth */}
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Student routes */}
                    <Route element={<DashboardLayout />}>
                        <Route element={<RequireRole role="student" />}>
                            <Route path="/student/dashboard" element={<StudentDashboard />} />
                            <Route path="/student/companies" element={<Companies />} />
                            <Route path="/student/applications" element={<Applications />} />
                            <Route path="/student/profile" element={<Profile />} />
                            <Route path="/student/ai-analytics" element={<AIAnalytics />} />
                        </Route>
                    </Route>

                    {/* Admin routes */}
                    <Route element={<DashboardLayout />}>
                        <Route element={<RequireRole role="admin" />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/companies" element={<ManageCompanies />} />
                            <Route path="/admin/students" element={<ManageStudents />} />
                            <Route path="/admin/applications" element={<ManageApplications />} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </ToastProvider>
    );
}

function LandingRedirect() {
    const { user } = useAuth();
    if (user) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
    return <LandingPage />;
}

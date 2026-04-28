import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login as authLogin, register as authRegister, logout as authLogout, updateProfile as authUpdateProfile } from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore session from cached user in sessionStorage
        const current = getCurrentUser();
        setUser(current);
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const result = await authLogin(email, password);
        if (result.success) setUser(result.user);
        return result;
    };

    const register = async (data) => {
        const result = await authRegister(data);
        if (result.success) setUser(result.user);
        return result;
    };

    const logout = () => {
        authLogout();
        setUser(null);
    };

    const updateProfile = async (data) => {
        if (!user) return { success: false, error: 'Not authenticated' };
        const result = await authUpdateProfile(user.id, data);
        if (result.success) setUser(result.user);
        return result;
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}

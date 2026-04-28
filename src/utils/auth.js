/**
 * auth.js — now bridges to the backend API.
 * Keeps the same exported function signatures so existing callers don't break.
 * localStorage is NOT used for actual data anymore; only sessionStorage for caching.
 */
import {
    apiLogin,
    apiRegister,
    apiUpdateProfile,
    getCachedUser,
    clearToken,
} from '../services/api';

export async function login(email, password) {
    try {
        const user = await apiLogin(email, password);
        return { success: true, user };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function register(data) {
    try {
        const user = await apiRegister(data);
        return { success: true, user };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function updateProfile(userId, data) {
    try {
        const user = await apiUpdateProfile(data);
        return { success: true, user };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export function logout() {
    clearToken();
}

export function getCurrentUser() {
    return getCachedUser();
}

export function isAuthenticated() {
    return getCurrentUser() !== null;
}

export function getUserRole() {
    return getCurrentUser()?.role || null;
}

/* ─── Profile Strength Calculator (purely client-side, no API needed) ─── */
export function getProfileStrength(user) {
    if (!user) return { percent: 0, missing: [], completed: [] };
    const fields = [
        { key: 'name',     label: 'Full Name',          check: u => !!u.name },
        { key: 'phone',    label: 'Phone Number',        check: u => !!u.phone },
        { key: 'skills',   label: 'Skills (at least 2)', check: u => (u.skills || []).length >= 2 },
        { key: 'resume',   label: 'Resume Upload',       check: u => !!u.resume },
        { key: 'bio',      label: 'Bio / About',         check: u => !!u.bio && u.bio.length > 10 },
        { key: 'cgpa',     label: 'CGPA',                check: u => u.cgpa > 0 },
        { key: 'linkedIn', label: 'LinkedIn Profile',    check: u => !!u.linkedIn },
        { key: 'github',   label: 'GitHub Profile',      check: u => !!u.github },
    ];

    const completed = fields.filter(f => f.check(user)).map(f => f.label);
    const missing   = fields.filter(f => !f.check(user)).map(f => f.label);
    const percent   = Math.round((completed.length / fields.length) * 100);
    return { percent, missing, completed, total: fields.length, done: completed.length };
}

/**
 * Central API client for PlaceIQ React frontend.
 * All requests go through this module — handles:
 *  - Base URL resolution
 *  - Injecting Authorization JWT header
 *  - Consistent error surfacing
 */

// Use relative path — Vite proxy in vite.config.js forwards /api/* to http://localhost:8080
// In production, set VITE_API_URL env var to point to your deployed backend
const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'placeiq_token';
const USER_KEY  = 'placeiq_user';

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
}

export function getCachedUser() {
    try {
        const raw = sessionStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function setCachedUser(user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ─── Core request helper ──────────────────────────────────────────────────────

async function request(method, path, body = null, requireAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (requireAuth) {
        const token = getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    // Frontend logging for Developer Console
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
        console.groupCollapsed(`🚀 API Request: ${method} ${path}`);
        if (body) console.log('Payload:', body);
        console.log('Headers:', headers);
        console.groupEnd();
    }

    const res = await fetch(`${BASE_URL}${path}`, options);

    let json;
    try {
        json = await res.json();
    } catch {
        throw new Error(`Server returned non-JSON response (status ${res.status})`);
    }

    if (isLocal) {
        console.groupCollapsed(`✅ API Response: ${method} ${path} (${res.status})`);
        console.log('Response DATA:', json);
        console.groupEnd();
    }

    if (!res.ok || json.success === false) {
        throw new Error(json.message || `Request failed: ${res.status}`);
    }

    return json.data !== undefined ? json.data : json;
}

// Special version that returns the raw data envelope (used for auth which needs token+user)
async function requestRaw(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
        console.groupCollapsed(`🚀 API Auth Request: ${method} ${path}`);
        if (body) console.log('Payload:', { ...body, password: '***' });
        console.groupEnd();
    }

    const res = await fetch(`${BASE_URL}${path}`, options);
    let json;
    try { json = await res.json(); } catch { throw new Error(`Server error (${res.status})`); }
    
    if (isLocal) {
        console.groupCollapsed(`✅ API Auth Response: ${method} ${path} (${res.status})`);
        console.log('Response DATA:', json);
        console.groupEnd();
    }

    if (!res.ok || json.success === false) throw new Error(json.message || `Request failed: ${res.status}`);
    return json.data; 
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export async function apiLogin(email, password) {
    const data = await requestRaw('POST', '/auth/login', { email, password });
    setToken(data.token);
    setCachedUser(data.user);
    return data.user;
}

export async function apiRegister({ name, email, password, department, rollNo, year, role }) {
    const data = await requestRaw('POST', '/auth/register',
        { name, email, password, department, rollNo, year, role });
    setToken(data.token);
    setCachedUser(data.user);
    return data.user;
}

export async function apiUpdateProfile(profileData) {
    const user = await request('PUT', '/auth/profile', profileData);
    setCachedUser(user);
    return user;
}

// ─── Company endpoints ────────────────────────────────────────────────────────

export async function apiGetCompanies(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request('GET', `/companies${query ? '?' + query : ''}`);
}

export async function apiGetCompany(id) {
    return request('GET', `/companies/${id}`);
}

export async function apiCreateCompany(company) {
    return request('POST', '/companies', company);
}

export async function apiUpdateCompany(id, company) {
    return request('PUT', `/companies/${id}`, company);
}

export async function apiDeleteCompany(id) {
    return request('DELETE', `/companies/${id}`);
}

// ─── Application endpoints ────────────────────────────────────────────────────

export async function apiGetApplications() {
    return request('GET', '/applications');
}

export async function apiApply(companyId, coverLetter = '') {
    return request('POST', '/applications', { companyId, coverLetter });
}

export async function apiAdminUpdateApplication(appId, update) {
    return request('PUT', `/applications/${appId}`, update);
}

export async function apiGetApplicationsByCompany(companyId) {
    return request('GET', `/applications/company/${companyId}`);
}

// ─── Student endpoints (admin) ────────────────────────────────────────────────

export async function apiGetStudents() {
    return request('GET', '/students');
}

export async function apiGetStudent(id) {
    return request('GET', `/students/${id}`);
}

// ─── AI Prediction ────────────────────────────────────────────────────────────

export async function apiPredict(studentId, companyId) {
    return request('POST', '/predict', { studentId, companyId });
}

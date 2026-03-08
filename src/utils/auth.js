const AUTH_KEY = 'pis_user';
const USERS_KEY = 'pis_users';

// Seed default users on first load
function seedUsers() {
    const existing = localStorage.getItem(USERS_KEY);
    if (!existing) {
        const defaults = [
            {
                id: '1',
                name: 'Praveen Kumar',
                email: 'praveen@student.com',
                password: 'Admin@1234',
                role: 'student',
                department: 'Computer Science',
                branch: 'Computer Science',
                rollNo: 'CS21B001',
                year: 4,
                cgpa: 8.5,
                backlogs: 0,
                avatar: null,
                phone: '9876543210',
                bio: 'Final year CS student passionate about full-stack development and competitive programming.',
                skills: ['React', 'Node.js', 'Java', 'DSA', 'Python'],
                resume: null,
                linkedIn: 'linkedin.com/in/praveen-kumar',
                github: 'github.com/praveen-kumar',
                createdAt: '2025-08-15',
            },
            {
                id: '2',
                name: 'Admin User',
                email: 'admin@pis.com',
                password: 'Admin@1234',
                role: 'admin',
                department: 'Placement Cell',
                branch: 'Administration',
                avatar: null,
                phone: '9876543211',
                createdAt: '2025-06-01',
            },
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
    }
}
seedUsers();

export function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    if (!user) return { success: false, error: 'No account found with this email' };
    if (user.password !== password) return { success: false, error: 'Invalid password' };

    const { password: _, ...safeUser } = user;
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
    return { success: true, user: safeUser };
}

export function register({ name, email, password, department, rollNo, year }) {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        return { success: false, error: 'Email already registered' };
    }

    const newUser = {
        id: String(Date.now()),
        name,
        email,
        password,
        role: 'student',
        department: department || 'Computer Science',
        branch: department || 'Computer Science',
        rollNo: rollNo || '',
        year: parseInt(year) || 4,
        cgpa: 0,
        backlogs: 0,
        avatar: null,
        phone: '',
        bio: '',
        skills: [],
        resume: null,
        linkedIn: '',
        github: '',
        createdAt: new Date().toISOString().split('T')[0],
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...safeUser } = newUser;
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
    return { success: true, user: safeUser };
}

export function updateProfile(userId, data) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return { success: false, error: 'User not found' };

    // Don't allow updating password or role through this function
    const { password, role, id, ...safeData } = data;
    users[idx] = { ...users[idx], ...safeData };
    saveUsers(users);

    const { password: _, ...safeUser } = users[idx];
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
    return { success: true, user: safeUser };
}

export function logout() {
    sessionStorage.removeItem(AUTH_KEY);
}

export function getCurrentUser() {
    try {
        const data = sessionStorage.getItem(AUTH_KEY);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

export function isAuthenticated() {
    return getCurrentUser() !== null;
}

export function getUserRole() {
    return getCurrentUser()?.role || null;
}

/* ─── Profile Strength Calculator ─── */
export function getProfileStrength(user) {
    if (!user) return { percent: 0, missing: [], completed: [] };
    const fields = [
        { key: 'name', label: 'Full Name', check: u => !!u.name },
        { key: 'phone', label: 'Phone Number', check: u => !!u.phone },
        { key: 'skills', label: 'Skills (at least 2)', check: u => (u.skills || []).length >= 2 },
        { key: 'resume', label: 'Resume Upload', check: u => !!u.resume },
        { key: 'bio', label: 'Bio / About', check: u => !!u.bio && u.bio.length > 10 },
        { key: 'cgpa', label: 'CGPA', check: u => u.cgpa > 0 },
        { key: 'linkedIn', label: 'LinkedIn Profile', check: u => !!u.linkedIn },
        { key: 'github', label: 'GitHub Profile', check: u => !!u.github },
    ];

    const completed = fields.filter(f => f.check(user)).map(f => f.label);
    const missing = fields.filter(f => !f.check(user)).map(f => f.label);
    const percent = Math.round((completed.length / fields.length) * 100);

    return { percent, missing, completed, total: fields.length, done: completed.length };
}

const defaultApplications = [
    {
        id: '1',
        companyId: '1',
        companyName: 'Google',
        companyLogo: '🔍',
        role: 'Software Engineer',
        status: 'interview',
        currentRound: 'Technical Round 1',
        appliedDate: '2026-02-10',
        appliedAt: '2026-02-10T09:30:00Z',
        package: '18 LPA',
        coverLetter: 'I am excited to apply for the Software Engineer position at Google. My strong background in DSA and system design makes me an ideal candidate.',
        probability: 0.62,
        rounds: [
            { name: 'Online Assessment', status: 'CLEARED', completedAt: '2026-02-12' },
            { name: 'Technical Round 1', status: 'ONGOING', completedAt: null },
            { name: 'Technical Round 2', status: 'PENDING', completedAt: null },
            { name: 'HR Round', status: 'PENDING', completedAt: null },
        ],
    },
    {
        id: '2',
        companyId: '3',
        companyName: 'Amazon',
        companyLogo: '📦',
        role: 'SDE-1',
        status: 'shortlisted',
        currentRound: 'Technical Round 1',
        appliedDate: '2026-02-12',
        appliedAt: '2026-02-12T11:00:00Z',
        package: '22 LPA',
        coverLetter: 'Amazon\'s customer obsession philosophy aligns with my approach to software development. I would love to contribute to AWS and e-commerce at scale.',
        probability: 0.48,
        rounds: [
            { name: 'Online Assessment', status: 'CLEARED', completedAt: '2026-02-14' },
            { name: 'Technical Round 1', status: 'PENDING', completedAt: null },
            { name: 'Technical Round 2', status: 'PENDING', completedAt: null },
            { name: 'Bar Raiser', status: 'PENDING', completedAt: null },
            { name: 'HR Round', status: 'PENDING', completedAt: null },
        ],
    },
    {
        id: '3',
        companyId: '4',
        companyName: 'Infosys',
        companyLogo: '🏢',
        role: 'Systems Engineer',
        status: 'applied',
        currentRound: 'InfyTQ Assessment',
        appliedDate: '2026-02-15',
        appliedAt: '2026-02-15T14:20:00Z',
        package: '6 LPA',
        coverLetter: 'Infosys provides an excellent platform to start a career in IT. I am eager to contribute to global digital transformation.',
        probability: 0.75,
        rounds: [
            { name: 'InfyTQ Assessment', status: 'PENDING', completedAt: null },
            { name: 'Technical Interview', status: 'PENDING', completedAt: null },
            { name: 'HR Interview', status: 'PENDING', completedAt: null },
        ],
    },
    {
        id: '4',
        companyId: '6',
        companyName: 'Deloitte',
        companyLogo: '📊',
        role: 'Business Analyst',
        status: 'selected',
        currentRound: 'Completed',
        appliedDate: '2026-01-20',
        appliedAt: '2026-01-20T10:00:00Z',
        package: '10 LPA',
        coverLetter: 'My analytical mindset and communication skills make me well-suited for the Business Analyst role at Deloitte.',
        probability: 1.0,
        rounds: [
            { name: 'Aptitude Test', status: 'CLEARED', completedAt: '2026-01-22' },
            { name: 'Group Discussion', status: 'CLEARED', completedAt: '2026-01-25' },
            { name: 'Technical Interview', status: 'CLEARED', completedAt: '2026-01-28' },
            { name: 'HR Interview', status: 'CLEARED', completedAt: '2026-01-30' },
        ],
    },
    {
        id: '5',
        companyId: '9',
        companyName: 'Wipro',
        companyLogo: '🌸',
        role: 'Project Engineer',
        status: 'rejected',
        currentRound: 'Rejected at Technical',
        appliedDate: '2026-01-25',
        appliedAt: '2026-01-25T08:45:00Z',
        package: '5.5 LPA',
        coverLetter: 'I applied to Wipro for broad industry exposure and enterprise development experience.',
        probability: 0,
        rounds: [
            { name: 'WILP Test', status: 'CLEARED', completedAt: '2026-01-27' },
            { name: 'Technical Interview', status: 'REJECTED', completedAt: '2026-01-30' },
            { name: 'HR Round', status: 'PENDING', completedAt: null },
        ],
    },
];

const APP_KEY = 'pis_applications';

export function getApplications() {
    const stored = localStorage.getItem(APP_KEY);
    if (stored) {
        try { return JSON.parse(stored); } catch { /* fallthrough */ }
    }
    localStorage.setItem(APP_KEY, JSON.stringify(defaultApplications));
    return defaultApplications;
}

export function saveApplications(data) {
    localStorage.setItem(APP_KEY, JSON.stringify(data));
}

export function applyToCompany(company, coverLetter = '', user = null) {
    const apps = getApplications();
    if (apps.find(a => a.companyId === company.id)) {
        return { success: false, error: 'You have already applied to this company.' };
    }
    // Check deadline
    if (new Date(company.deadline) < new Date()) {
        return { success: false, error: 'Application deadline has passed.' };
    }
    const newApp = {
        id: String(Date.now()),
        companyId: company.id,
        companyName: company.name,
        companyLogo: company.logo,
        role: company.role,
        status: 'applied',
        currentRound: company.rounds?.[0]?.name || 'Under Review',
        appliedDate: new Date().toISOString().split('T')[0],
        appliedAt: new Date().toISOString(),
        package: company.ctc || company.package,
        coverLetter,
        probability: 0.35 + Math.random() * 0.25,
        // Store full applicant data so companies/admins can view it
        applicant: user ? {
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            department: user.department || '',
            rollNo: user.rollNo || '',
            year: user.year || '',
            cgpa: user.cgpa || 0,
            backlogs: user.backlogs || 0,
            skills: user.skills || [],
            bio: user.bio || '',
            linkedIn: user.linkedIn || '',
            github: user.github || '',
            resume: user.resume || null,
            resumeName: user.resumeName || '',
        } : null,
        rounds: (company.rounds || []).map((r, i) => ({
            name: r.name,
            status: i === 0 ? 'PENDING' : 'PENDING',
            completedAt: null,
        })),
    };
    apps.push(newApp);
    saveApplications(apps);
    return { success: true, application: newApp };
}

export function updateApplicationRound(appId, roundName, status) {
    const apps = getApplications();
    const idx = apps.findIndex(a => a.id === appId);
    if (idx !== -1) {
        const app = apps[idx];
        const roundIdx = app.rounds.findIndex(r => r.name === roundName);
        if (roundIdx !== -1) {
            app.rounds[roundIdx].status = status;
            app.rounds[roundIdx].completedAt = new Date().toISOString().split('T')[0];
        }
        // Update overall status
        const allCleared = app.rounds.every(r => r.status === 'CLEARED');
        const anyRejected = app.rounds.some(r => r.status === 'REJECTED');
        const hasOngoing = app.rounds.some(r => r.status === 'ONGOING');
        if (allCleared) app.status = 'selected';
        else if (anyRejected) app.status = 'rejected';
        else if (hasOngoing) app.status = 'interview';
        else {
            const clearedCount = app.rounds.filter(r => r.status === 'CLEARED').length;
            if (clearedCount > 0) app.status = 'shortlisted';
        }
        apps[idx] = app;
        saveApplications(apps);
        return app;
    }
    return null;
}

export function getApplicationStats() {
    const apps = getApplications();
    return {
        total: apps.length,
        applied: apps.filter(a => a.status === 'applied').length,
        shortlisted: apps.filter(a => a.status === 'shortlisted').length,
        interview: apps.filter(a => a.status === 'interview').length,
        selected: apps.filter(a => a.status === 'selected').length,
        rejected: apps.filter(a => a.status === 'rejected').length,
    };
}

export const STATUS_CONFIG = {
    applied: { label: 'Applied', color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/25', className: 'status-applied' },
    shortlisted: { label: 'Shortlisted', color: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/25', className: 'status-shortlisted' },
    interview: { label: 'Interview', color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/25', className: 'status-interview' },
    selected: { label: 'Selected', color: 'text-green-400', bg: 'bg-green-500/15', border: 'border-green-500/25', className: 'status-selected' },
    rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/25', className: 'status-rejected' },
};

/* ─── Placement Funnel (Admin) ─── */
export function getPlacementFunnel(allUsers = []) {
    const apps = getApplications();
    const totalStudents = allUsers.filter(u => u.role === 'student').length || 1;
    const applied = new Set(apps.map(a => a.applicant?.email || a.companyId)).size;
    const interviewed = apps.filter(a => ['interview', 'shortlisted', 'selected'].includes(a.status)).length;
    const selected = apps.filter(a => a.status === 'selected').length;
    return {
        totalStudents,
        applied: apps.length,
        interviewed,
        selected,
        rejected: apps.filter(a => a.status === 'rejected').length,
    };
}

/* ─── Admin: Update Application (move round, reject, select, add notes) ─── */
export function updateApplicationByAdmin(appId, { status, roundIndex, roundStatus, notes }) {
    const apps = getApplications();
    const idx = apps.findIndex(a => a.id === appId);
    if (idx === -1) return null;
    const app = apps[idx];

    // Update specific round
    if (roundIndex !== undefined && roundStatus && app.rounds[roundIndex]) {
        app.rounds[roundIndex].status = roundStatus;
        app.rounds[roundIndex].completedAt = roundStatus !== 'PENDING' ? new Date().toISOString().split('T')[0] : null;
        // Auto-advance: set next round to ONGOING
        if (roundStatus === 'CLEARED' && app.rounds[roundIndex + 1]) {
            app.rounds[roundIndex + 1].status = 'ONGOING';
        }
    }

    // Override status if provided
    if (status) {
        app.status = status;
    } else {
        // Auto-derive status from rounds
        const allCleared = app.rounds.every(r => r.status === 'CLEARED');
        const anyRejected = app.rounds.some(r => r.status === 'REJECTED');
        const hasOngoing = app.rounds.some(r => r.status === 'ONGOING');
        const clearedCount = app.rounds.filter(r => r.status === 'CLEARED').length;
        if (allCleared) app.status = 'selected';
        else if (anyRejected) app.status = 'rejected';
        else if (hasOngoing) app.status = 'interview';
        else if (clearedCount > 0) app.status = 'shortlisted';
    }

    // Update current round label
    const ongoing = app.rounds.find(r => r.status === 'ONGOING');
    const pending = app.rounds.find(r => r.status === 'PENDING');
    app.currentRound = ongoing?.name || pending?.name || (app.status === 'selected' ? 'Completed' : app.currentRound);

    // Admin notes
    if (notes !== undefined) app.notes = notes;

    apps[idx] = app;
    saveApplications(apps);
    return app;
}

/* ─── Student Performance Insights ─── */
export function getPerformanceInsights() {
    const apps = getApplications();
    if (apps.length === 0) return { successRate: 0, interviewConversion: 0, offerProbability: 0, totalRoundsCleared: 0 };

    const selected = apps.filter(a => a.status === 'selected').length;
    const interviewed = apps.filter(a => ['interview', 'shortlisted', 'selected'].includes(a.status)).length;
    const totalRoundsCleared = apps.reduce((sum, a) => sum + a.rounds.filter(r => r.status === 'CLEARED').length, 0);
    const avgProbability = apps.reduce((sum, a) => sum + (a.probability || 0), 0) / apps.length;

    return {
        successRate: apps.length > 0 ? Math.round((selected / apps.length) * 100) : 0,
        interviewConversion: interviewed > 0 ? Math.round((selected / interviewed) * 100) : 0,
        offerProbability: Math.round(avgProbability * 100),
        totalRoundsCleared,
        totalApplications: apps.length,
        activeApplications: apps.filter(a => !['selected', 'rejected'].includes(a.status)).length,
    };
}

/* ─── Department Stats (Admin) ─── */
export function getDepartmentStats(allUsers = []) {
    const apps = getApplications();
    const students = allUsers.filter(u => u.role === 'student');
    const departments = {};
    students.forEach(s => {
        const dept = s.department || 'Other';
        if (!departments[dept]) departments[dept] = { total: 0, applied: 0, selected: 0 };
        departments[dept].total++;
    });
    apps.forEach(a => {
        const dept = a.applicant?.department || 'Other';
        if (!departments[dept]) departments[dept] = { total: 0, applied: 0, selected: 0 };
        departments[dept].applied++;
        if (a.status === 'selected') departments[dept].selected++;
    });
    return departments;
}

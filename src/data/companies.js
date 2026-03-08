export const companies = [
    {
        id: '1',
        name: 'Google',
        logo: '🔍',
        shortName: 'GOOG',
        role: 'Software Engineer',
        ctc: '18 LPA',
        package: '18 LPA',
        location: 'Bangalore',
        type: 'Full-time',
        minCgpa: 7.0,
        maxBacklogs: 0,
        allowedBranches: ['Computer Science', 'Information Technology', 'Electronics'],
        eligibility: 'CGPA 7.0+, No backlogs',
        deadline: '2026-03-15',
        description: "Join Google's engineering team to build products used by billions. Work on cutting-edge technology in search, cloud, and AI.",
        aboutCompany: "Google LLC is an American multinational technology company focusing on artificial intelligence, online advertising, search engine technology, cloud computing, computer software, quantum computing, e-commerce, and consumer electronics.",
        skills: ['DSA', 'System Design', 'Python', 'Java'],
        openings: 15,
        status: 'active',
        dresscode: 'Smart Casual',
        rounds: [
            { name: 'Online Assessment', type: 'aptitude', duration: '90 min' },
            { name: 'Technical Round 1', type: 'technical', duration: '60 min' },
            { name: 'Technical Round 2', type: 'technical', duration: '60 min' },
            { name: 'HR Round', type: 'hr', duration: '30 min' },
        ],
        registrations: 120,
        ctcBreakdown: { base: '14 LPA', bonus: '2 LPA', stocks: '2 LPA' },
    },
    {
        id: '2',
        name: 'Microsoft',
        logo: '🪟',
        shortName: 'MSFT',
        role: 'Full Stack Developer',
        ctc: '16 LPA',
        package: '16 LPA',
        location: 'Hyderabad',
        type: 'Full-time',
        minCgpa: 7.5,
        maxBacklogs: 0,
        allowedBranches: ['Computer Science', 'Information Technology'],
        eligibility: 'CGPA 7.5+, No backlogs',
        deadline: '2026-03-20',
        description: 'Build cloud-first applications for Azure and Microsoft 365. Contribute to enterprise solutions that empower millions.',
        aboutCompany: 'Microsoft Corporation is an American multinational technology corporation that develops, licenses, and supports a wide range of software products, consumer electronics, and personal computers.',
        skills: ['React', 'Node.js', 'Azure', 'TypeScript'],
        openings: 20,
        status: 'active',
        dresscode: 'Business Casual',
        rounds: [
            { name: 'Coding Test', type: 'aptitude', duration: '75 min' },
            { name: 'Technical Interview', type: 'technical', duration: '60 min' },
            { name: 'HR Interview', type: 'hr', duration: '45 min' },
        ],
        registrations: 95,
        ctcBreakdown: { base: '12 LPA', bonus: '2 LPA', stocks: '2 LPA' },
    },
    {
        id: '3',
        name: 'Amazon',
        logo: '📦',
        shortName: 'AMZN',
        role: 'SDE-1',
        ctc: '22 LPA',
        package: '22 LPA',
        location: 'Hyderabad',
        type: 'Full-time',
        minCgpa: 6.5,
        maxBacklogs: 1,
        allowedBranches: ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical'],
        eligibility: 'CGPA 6.5+, ≤1 backlog',
        deadline: '2026-03-10',
        description: 'Solve complex challenges at scale. Work on AWS, e-commerce, and logistics systems that handle millions of transactions.',
        aboutCompany: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, and artificial intelligence.',
        skills: ['Java', 'AWS', 'Distributed Systems', 'DSA'],
        openings: 25,
        status: 'active',
        dresscode: 'Casual',
        rounds: [
            { name: 'Online Assessment', type: 'aptitude', duration: '105 min' },
            { name: 'Technical Round 1', type: 'technical', duration: '60 min' },
            { name: 'Technical Round 2', type: 'technical', duration: '60 min' },
            { name: 'Bar Raiser', type: 'technical', duration: '60 min' },
            { name: 'HR Round', type: 'hr', duration: '30 min' },
        ],
        registrations: 200,
        ctcBreakdown: { base: '14 LPA', bonus: '4 LPA', stocks: '4 LPA' },
    },
    {
        id: '4',
        name: 'Infosys',
        logo: '🏢',
        shortName: 'INFY',
        role: 'Systems Engineer',
        ctc: '6 LPA',
        package: '6 LPA',
        location: 'Pune',
        type: 'Full-time',
        minCgpa: 6.0,
        maxBacklogs: 2,
        allowedBranches: ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical', 'Civil'],
        eligibility: 'CGPA 6.0+, ≤2 backlogs',
        deadline: '2026-04-01',
        description: 'Start your career in IT consulting and digital transformation. Work with Fortune 500 clients across industries.',
        aboutCompany: 'Infosys Limited is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services.',
        skills: ['Java', 'SQL', 'Spring Boot', 'Agile'],
        openings: 100,
        status: 'active',
        dresscode: 'Formal',
        rounds: [
            { name: 'InfyTQ Assessment', type: 'aptitude', duration: '90 min' },
            { name: 'Technical Interview', type: 'technical', duration: '45 min' },
            { name: 'HR Interview', type: 'hr', duration: '30 min' },
        ],
        registrations: 350,
        ctcBreakdown: { base: '5 LPA', bonus: '0.5 LPA', stocks: '0.5 LPA' },
    },
    {
        id: '5',
        name: 'TCS',
        logo: '🌐',
        shortName: 'TCS',
        role: 'Assistant Developer',
        ctc: '7 LPA',
        package: '7 LPA',
        location: 'Mumbai',
        type: 'Full-time',
        minCgpa: 6.0,
        maxBacklogs: 2,
        allowedBranches: ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical'],
        eligibility: 'CGPA 6.0+, ≤2 backlogs',
        deadline: '2026-04-05',
        description: "Join TCS's global workforce and contribute to large-scale digital solutions for banking, retail, and healthcare.",
        aboutCompany: 'Tata Consultancy Services is an Indian multinational information technology services and consulting company headquartered in Mumbai.',
        skills: ['Python', 'Java', 'Cloud', 'DevOps'],
        openings: 150,
        status: 'active',
        dresscode: 'Formal',
        rounds: [
            { name: 'National Qualifier Test', type: 'aptitude', duration: '90 min' },
            { name: 'Technical + Managerial', type: 'technical', duration: '60 min' },
            { name: 'HR Round', type: 'hr', duration: '30 min' },
        ],
        registrations: 420,
        ctcBreakdown: { base: '6 LPA', bonus: '0.5 LPA', stocks: '0.5 LPA' },
    },
    {
        id: '6',
        name: 'Deloitte',
        logo: '📊',
        shortName: 'DLTT',
        role: 'Business Analyst',
        ctc: '10 LPA',
        package: '10 LPA',
        location: 'Bangalore',
        type: 'Full-time',
        minCgpa: 7.0,
        maxBacklogs: 0,
        allowedBranches: ['Computer Science', 'Information Technology', 'Electronics', 'Electrical'],
        eligibility: 'CGPA 7.0+, No backlogs',
        deadline: '2026-03-25',
        description: 'Drive business impact through data-driven consulting. Work with top enterprises on strategy and technology projects.',
        aboutCompany: 'Deloitte Touche Tohmatsu Limited, commonly referred to as Deloitte, is a multinational professional services network.',
        skills: ['Excel', 'SQL', 'Tableau', 'Communication'],
        openings: 30,
        status: 'active',
        dresscode: 'Business Formal',
        rounds: [
            { name: 'Aptitude Test', type: 'aptitude', duration: '60 min' },
            { name: 'Group Discussion', type: 'technical', duration: '45 min' },
            { name: 'Technical Interview', type: 'technical', duration: '45 min' },
            { name: 'HR Interview', type: 'hr', duration: '30 min' },
        ],
        registrations: 180,
        ctcBreakdown: { base: '8 LPA', bonus: '1 LPA', stocks: '1 LPA' },
    },
    {
        id: '7',
        name: 'Flipkart',
        logo: '🛒',
        shortName: 'FLPK',
        role: 'Backend Engineer',
        ctc: '14 LPA',
        package: '14 LPA',
        location: 'Bangalore',
        type: 'Full-time',
        minCgpa: 7.0,
        maxBacklogs: 0,
        allowedBranches: ['Computer Science', 'Information Technology'],
        eligibility: 'CGPA 7.0+, No backlogs',
        deadline: '2026-03-18',
        description: "Build India's largest e-commerce platform. Work on high-scale microservices, payment gateways, and supply chain tech.",
        aboutCompany: 'Flipkart Internet Private Limited is an Indian e-commerce company, headquartered in Bengaluru, and incorporated in Singapore.',
        skills: ['Java', 'Microservices', 'Kafka', 'Redis'],
        openings: 12,
        status: 'active',
        dresscode: 'Casual',
        rounds: [
            { name: 'Online Coding', type: 'aptitude', duration: '90 min' },
            { name: 'Machine Coding Round', type: 'technical', duration: '90 min' },
            { name: 'System Design', type: 'technical', duration: '60 min' },
            { name: 'HR Round', type: 'hr', duration: '30 min' },
        ],
        registrations: 88,
        ctcBreakdown: { base: '10 LPA', bonus: '2 LPA', stocks: '2 LPA' },
    },
    {
        id: '8',
        name: 'Razorpay',
        logo: '💳',
        shortName: 'RZRP',
        role: 'Frontend Engineer',
        ctc: '12 LPA',
        package: '12 LPA',
        location: 'Bangalore',
        type: 'Full-time',
        minCgpa: 7.0,
        maxBacklogs: 0,
        allowedBranches: ['Computer Science', 'Information Technology'],
        eligibility: 'CGPA 7.0+, No backlogs',
        deadline: '2026-03-22',
        description: 'Shape the future of fintech in India. Build seamless payment experiences used by millions of businesses.',
        aboutCompany: 'Razorpay is an Indian payment gateway company providing technology solutions to businesses for accepting and processing digital payments.',
        skills: ['React', 'TypeScript', 'GraphQL', 'CSS'],
        openings: 8,
        status: 'active',
        dresscode: 'Casual',
        rounds: [
            { name: 'Online Assessment', type: 'aptitude', duration: '60 min' },
            { name: 'Frontend Technical', type: 'technical', duration: '90 min' },
            { name: 'Culture Fit', type: 'hr', duration: '30 min' },
        ],
        registrations: 65,
        ctcBreakdown: { base: '9 LPA', bonus: '1.5 LPA', stocks: '1.5 LPA' },
    },
    {
        id: '9',
        name: 'Wipro',
        logo: '🌸',
        shortName: 'WIPR',
        role: 'Project Engineer',
        ctc: '5.5 LPA',
        package: '5.5 LPA',
        location: 'Chennai',
        type: 'Full-time',
        minCgpa: 6.0,
        maxBacklogs: 2,
        allowedBranches: ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical'],
        eligibility: 'CGPA 6.0+, ≤2 backlogs',
        deadline: '2026-04-10',
        description: 'Work on enterprise software solutions and digital transformation projects for global clients.',
        aboutCompany: 'Wipro Limited is an Indian multinational corporation that provides information technology, consulting and business process services.',
        skills: ['Java', '.NET', 'SQL', 'Testing'],
        openings: 80,
        status: 'active',
        dresscode: 'Business Casual',
        rounds: [
            { name: 'WILP Test', type: 'aptitude', duration: '60 min' },
            { name: 'Technical Interview', type: 'technical', duration: '45 min' },
            { name: 'HR Round', type: 'hr', duration: '30 min' },
        ],
        registrations: 310,
        ctcBreakdown: { base: '4.5 LPA', bonus: '0.5 LPA', stocks: '0.5 LPA' },
    },
    {
        id: '10',
        name: 'Zomato',
        logo: '🍕',
        shortName: 'ZMTO',
        role: 'Mobile Developer',
        ctc: '15 LPA',
        package: '15 LPA',
        location: 'Gurgaon',
        type: 'Full-time',
        minCgpa: 7.0,
        maxBacklogs: 0,
        allowedBranches: ['Computer Science', 'Information Technology'],
        eligibility: 'CGPA 7.0+, No backlogs',
        deadline: '2026-03-28',
        description: 'Build food-tech experiences loved by millions. Work on the Zomato app, Blinkit, and Hyperpure platforms.',
        aboutCompany: 'Zomato Limited is an Indian multinational restaurant aggregator and food delivery company.',
        skills: ['React Native', 'Kotlin', 'Swift', 'Firebase'],
        openings: 10,
        status: 'active',
        dresscode: 'Casual',
        rounds: [
            { name: 'Coding Challenge', type: 'aptitude', duration: '90 min' },
            { name: 'Technical Interview', type: 'technical', duration: '60 min' },
            { name: 'Leadership Round', type: 'hr', duration: '45 min' },
        ],
        registrations: 75,
        ctcBreakdown: { base: '11 LPA', bonus: '2 LPA', stocks: '2 LPA' },
    },
];

export function getCompanies() {
    const stored = localStorage.getItem('pis_companies');
    if (stored) {
        try { return JSON.parse(stored); } catch { /* fallthrough */ }
    }
    localStorage.setItem('pis_companies', JSON.stringify(companies));
    return companies;
}

export function saveCompanies(data) {
    localStorage.setItem('pis_companies', JSON.stringify(data));
}

export function addCompany(company) {
    const all = getCompanies();
    const newCompany = {
        ...company,
        id: String(Date.now()),
        status: 'active',
        registrations: 0,
        rounds: company.rounds || [],
        allowedBranches: company.allowedBranches || [],
    };
    all.push(newCompany);
    saveCompanies(all);
    return newCompany;
}

export function updateCompany(id, updates) {
    const all = getCompanies();
    const idx = all.findIndex(c => c.id === id);
    if (idx !== -1) {
        all[idx] = { ...all[idx], ...updates };
        saveCompanies(all);
        return all[idx];
    }
    return null;
}

export function deleteCompany(id) {
    const all = getCompanies().filter(c => c.id !== id);
    saveCompanies(all);
}

/* ─── Eligibility Engine ─── */
export function checkEligibility(company, user) {
    if (!user || !company) return { eligible: false, reasons: ['Missing data'] };
    const reasons = [];
    if (company.minCgpa && (user.cgpa || 0) < company.minCgpa) {
        reasons.push(`CGPA ${user.cgpa || 0} < required ${company.minCgpa}`);
    }
    if (company.maxBacklogs !== undefined && (user.backlogs || 0) > company.maxBacklogs) {
        reasons.push(`${user.backlogs} backlogs > allowed ${company.maxBacklogs}`);
    }
    if (company.allowedBranches?.length > 0) {
        const userBranch = user.department || user.branch || '';
        if (!company.allowedBranches.some(b => b.toLowerCase() === userBranch.toLowerCase())) {
            reasons.push(`Branch "${userBranch}" not in allowed: ${company.allowedBranches.join(', ')}`);
        }
    }
    return { eligible: reasons.length === 0, reasons };
}

export function getEligibleCompanies(user) {
    const all = getCompanies();
    return all.filter(c => checkEligibility(c, user).eligible);
}

/* ─── Recommendation Engine ─── */
export function getRecommendedCompanies(user) {
    if (!user) return [];
    const eligible = getEligibleCompanies(user);
    const userSkills = (user.skills || []).map(s => s.toLowerCase());

    const scored = eligible.map(company => {
        const companySkills = (company.skills || []).map(s => s.toLowerCase());
        const matched = userSkills.filter(s => companySkills.includes(s)).length;
        const total = Math.max(companySkills.length, 1);
        const skillScore = matched / total;
        // Bonus for higher CTC
        const ctcNum = parseFloat((company.ctc || '0').replace(/[^0-9.]/g, ''));
        const ctcScore = Math.min(ctcNum / 25, 1) * 0.3;
        return {
            ...company,
            matchScore: Math.round((skillScore * 0.7 + ctcScore) * 100),
            matchedSkills: userSkills.filter(s => companySkills.includes(s)),
        };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore);
}

/* ─── Eligible Student Count Per Company (Admin) ─── */
export function getEligibleStudentCount(company, allUsers = []) {
    const students = allUsers.filter(u => u.role === 'student');
    return students.filter(s => checkEligibility(company, s).eligible).length;
}

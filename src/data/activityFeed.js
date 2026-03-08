const FEED_KEY = 'pis_activity_feed';
const MAX_ITEMS = 50;

function getFeed() {
    try { return JSON.parse(localStorage.getItem(FEED_KEY) || '[]'); }
    catch { return []; }
}

function saveFeed(feed) {
    localStorage.setItem(FEED_KEY, JSON.stringify(feed.slice(0, MAX_ITEMS)));
}

export function addActivity(type, message, meta = {}) {
    const feed = getFeed();
    feed.unshift({
        id: String(Date.now()),
        type,       // 'apply', 'status_update', 'company_added', 'profile_update', 'system'
        message,
        meta,       // { companyName, status, etc. }
        timestamp: new Date().toISOString(),
        read: false,
    });
    saveFeed(feed);
}

export function getActivities(limit = 20) {
    return getFeed().slice(0, limit);
}

export function getUnreadCount() {
    return getFeed().filter(a => !a.read).length;
}

export function markAllRead() {
    const feed = getFeed().map(a => ({ ...a, read: true }));
    saveFeed(feed);
}

export function markRead(id) {
    const feed = getFeed().map(a => a.id === id ? { ...a, read: true } : a);
    saveFeed(feed);
}

// Activity type icons & colors
export const ACTIVITY_CONFIG = {
    apply: { icon: '📝', color: 'text-blue-400', label: 'Application' },
    status_update: { icon: '🔄', color: 'text-orange-400', label: 'Status Update' },
    company_added: { icon: '🏢', color: 'text-green-400', label: 'New Company' },
    profile_update: { icon: '👤', color: 'text-purple-400', label: 'Profile' },
    system: { icon: '⚡', color: 'text-accent', label: 'System' },
    round_update: { icon: '🎯', color: 'text-yellow-400', label: 'Round Update' },
};

// Seed some initial activity
function seedActivity() {
    if (getFeed().length > 0) return;
    const seeds = [
        { type: 'apply', message: 'You applied to Google as Software Engineer', meta: { companyName: 'Google' }, timestamp: '2026-02-10T09:30:00Z' },
        { type: 'status_update', message: 'Amazon shortlisted your application', meta: { companyName: 'Amazon', status: 'shortlisted' }, timestamp: '2026-02-14T10:00:00Z' },
        { type: 'apply', message: 'You applied to Infosys as Systems Engineer', meta: { companyName: 'Infosys' }, timestamp: '2026-02-15T14:20:00Z' },
        { type: 'status_update', message: 'Google moved you to Technical Round 1', meta: { companyName: 'Google', round: 'Technical Round 1' }, timestamp: '2026-02-12T11:00:00Z' },
        { type: 'status_update', message: 'Deloitte selected you! Congratulations 🎉', meta: { companyName: 'Deloitte', status: 'selected' }, timestamp: '2026-01-30T16:00:00Z' },
        { type: 'system', message: 'Welcome to PlaceIQ — complete your profile to get started', meta: {}, timestamp: '2026-01-01T00:00:00Z' },
    ].map((s, i) => ({ ...s, id: String(1000 + i), read: i > 2 }));
    saveFeed(seeds);
}
seedActivity();

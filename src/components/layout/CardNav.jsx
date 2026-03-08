import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../../context/AuthContext';
import { ArrowUpRight, LogOut } from 'lucide-react';
import './CardNav.css';

export default function CardNav() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const navRef = useRef(null);
    const cardsRef = useRef([]);
    const tlRef = useRef(null);

    const handleLogout = () => {
        closeMenu();
        logout();
        navigate('/');
    };

    const handleNav = (path) => {
        closeMenu();
        navigate(path);
    };

    const closeMenu = () => {
        const tl = tlRef.current;
        if (!tl || !isExpanded) return;
        setIsHamburgerOpen(false);
        tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
        tl.reverse();
    };

    const studentItems = [
        {
            label: 'Navigate',
            bgColor: '#0D0716',
            textColor: '#fff',
            links: [
                { label: 'Dashboard', path: '/student/dashboard' },
                { label: 'Companies', path: '/student/companies' },
            ],
        },
        {
            label: 'Track',
            bgColor: '#170D27',
            textColor: '#fff',
            links: [
                { label: 'Applications', path: '/student/applications' },
                { label: 'Profile', path: '/student/profile' },
            ],
        },
        {
            label: 'Account',
            bgColor: '#1a0a0a',
            textColor: '#fff',
            links: [
                { label: 'Logout', action: handleLogout },
            ],
        },
    ];

    const adminItems = [
        {
            label: 'Overview',
            bgColor: '#0D0716',
            textColor: '#fff',
            links: [
                { label: 'Dashboard', path: '/admin/dashboard' },
            ],
        },
        {
            label: 'Manage',
            bgColor: '#170D27',
            textColor: '#fff',
            links: [
                { label: 'Companies', path: '/admin/companies' },
                { label: 'Students', path: '/admin/students' },
            ],
        },
        {
            label: 'Account',
            bgColor: '#1a0a0a',
            textColor: '#fff',
            links: [
                { label: 'Logout', action: handleLogout },
            ],
        },
    ];

    const items = user?.role === 'admin' ? adminItems : studentItems;

    const calculateHeight = () => {
        const navEl = navRef.current;
        if (!navEl) return 260;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
            const contentEl = navEl.querySelector('.card-nav-content');
            if (contentEl) {
                const wasVis = contentEl.style.visibility;
                const wasPE = contentEl.style.pointerEvents;
                const wasPos = contentEl.style.position;
                const wasH = contentEl.style.height;
                contentEl.style.visibility = 'visible';
                contentEl.style.pointerEvents = 'auto';
                contentEl.style.position = 'static';
                contentEl.style.height = 'auto';
                contentEl.offsetHeight;
                const h = 60 + contentEl.scrollHeight + 16;
                contentEl.style.visibility = wasVis;
                contentEl.style.pointerEvents = wasPE;
                contentEl.style.position = wasPos;
                contentEl.style.height = wasH;
                return h;
            }
        }
        return 260;
    };

    const createTimeline = () => {
        const navEl = navRef.current;
        if (!navEl) return null;
        gsap.set(navEl, { height: 60, overflow: 'hidden' });
        gsap.set(cardsRef.current, { y: 50, opacity: 0 });
        const tl = gsap.timeline({ paused: true });
        tl.to(navEl, { height: calculateHeight, duration: 0.4, ease: 'power3.out' });
        tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08 }, '-=0.1');
        return tl;
    };

    useLayoutEffect(() => {
        const tl = createTimeline();
        tlRef.current = tl;
        return () => { tl?.kill(); tlRef.current = null; };
    }, [items.length]);

    useLayoutEffect(() => {
        const handleResize = () => {
            if (!tlRef.current) return;
            if (isExpanded) {
                const newHeight = calculateHeight();
                gsap.set(navRef.current, { height: newHeight });
                tlRef.current.kill();
                const newTl = createTimeline();
                if (newTl) { newTl.progress(1); tlRef.current = newTl; }
            } else {
                tlRef.current.kill();
                const newTl = createTimeline();
                if (newTl) { tlRef.current = newTl; }
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isExpanded]);

    const toggleMenu = () => {
        const tl = tlRef.current;
        if (!tl) return;
        if (!isExpanded) {
            setIsHamburgerOpen(true);
            setIsExpanded(true);
            tl.play(0);
        } else {
            setIsHamburgerOpen(false);
            tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
            tl.reverse();
        }
    };

    const setCardRef = (i) => (el) => {
        if (el) cardsRef.current[i] = el;
    };

    return (
        <>
            {/* Backdrop overlay when menu is open */}
            <div
                className={`card-nav-backdrop ${isExpanded ? 'visible' : ''}`}
                onClick={closeMenu}
            />

            <div className="card-nav-container">
                <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`}>
                    <div className="card-nav-top">
                        <div className="card-nav-left">
                            <div
                                className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
                                onClick={toggleMenu}
                                role="button"
                                aria-label={isExpanded ? 'Close menu' : 'Open menu'}
                                tabIndex={0}
                                style={{ color: '#fff' }}
                            >
                                <div className="hamburger-line" />
                                <div className="hamburger-line" />
                            </div>
                            <div className="card-nav-logo">PlaceIQ</div>
                        </div>

                        <div className="card-nav-right">
                            {user && (
                                <div className="card-nav-user">
                                    <div className="card-nav-avatar">{user.name?.[0] || 'U'}</div>
                                    <div className="card-nav-user-info">
                                        <span className="card-nav-user-name">{user.name}</span>
                                        <span className="card-nav-user-role">{user.role}</span>
                                    </div>
                                </div>
                            )}
                            <button type="button" className="card-nav-cta-button" onClick={() => handleNav(user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')}>
                                Dashboard
                            </button>
                        </div>
                    </div>

                    <div className="card-nav-content" aria-hidden={!isExpanded}>
                        {items.map((item, idx) => (
                            <div
                                key={`${item.label}-${idx}`}
                                className="nav-card"
                                ref={setCardRef(idx)}
                                style={{ backgroundColor: item.bgColor, color: item.textColor }}
                            >
                                <div className="nav-card-label">{item.label}</div>
                                <div className="nav-card-links">
                                    {item.links?.map((lnk, i) => {
                                        const isActive = lnk.path && location.pathname === lnk.path;
                                        return (
                                            <a
                                                key={`${lnk.label}-${i}`}
                                                className="nav-card-link"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (lnk.action) lnk.action();
                                                    else if (lnk.path) handleNav(lnk.path);
                                                }}
                                                href={lnk.path || '#'}
                                                style={isActive ? { color: '#E54D2E' } : undefined}
                                            >
                                                <ArrowUpRight className="nav-card-link-icon" aria-hidden="true" />
                                                {lnk.label}
                                                {lnk.label === 'Logout' && <LogOut size={12} style={{ marginLeft: 2 }} />}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </nav>
            </div>
        </>
    );
}


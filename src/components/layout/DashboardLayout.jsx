import { Outlet } from 'react-router-dom';
import { Component } from 'react';
import CardNav from './CardNav';
import CommandPalette from './CommandPalette';
import DotGrid from '../ui/DotGrid';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error('PlaceIQ Error:', error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#020202] p-8 relative z-10">
                    <div className="max-w-md text-center">
                        <h2 className="font-mono text-xl font-bold text-white mb-2">Something went wrong</h2>
                        <p className="text-sm text-gray-500 mb-4">{this.state.error?.message}</p>
                        <button onClick={() => {
                            localStorage.removeItem('pis_applications');
                            localStorage.removeItem('pis_companies');
                            localStorage.removeItem('pis_activity_feed');
                            window.location.reload();
                        }}
                            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium mr-2">
                            Reset Data & Reload
                        </button>
                        <button onClick={() => this.setState({ hasError: false })}
                            className="px-4 py-2 rounded-lg bg-white/[0.05] text-gray-400 text-sm font-medium">
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function DashboardLayout() {
    return (
        <div className="min-h-screen w-full bg-[#020202] relative">
            <div className="fixed inset-0 pointer-events-none z-0">
                <DotGrid
                    dotSize={3}
                    gap={32}
                    baseColor="#271E37"
                    activeColor="#5227FF"
                    proximity={60}
                    shockRadius={150}
                    shockStrength={3}
                    resistance={750}
                    returnDuration={1.5}
                />
            </div>
            <div className="relative z-10">
                <ErrorBoundary>
                    {/* CardNav is fixed at the top */}
                    <CardNav />
                    <CommandPalette />

                    {/* Main content fills full viewport width */}
                    <main className="w-full min-h-screen pt-[76px] px-4 sm:px-6 lg:px-8 pb-8">
                        <Outlet />
                    </main>
                </ErrorBoundary>
            </div>
        </div>
    );
}

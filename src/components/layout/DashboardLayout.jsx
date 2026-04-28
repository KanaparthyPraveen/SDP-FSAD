import { Component } from 'react';
import { Outlet } from 'react-router-dom';
import CardNav from './CardNav';
import CommandPalette from './CommandPalette';

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
                <div className="min-h-screen flex items-center justify-center bg-[#020202] p-8">
                    <div className="max-w-md text-center space-y-4">
                        <h2 className="font-mono text-xl font-bold text-white">Something went wrong</h2>
                        <p className="text-sm text-white/50">{this.state.error?.message}</p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => window.location.href = '/login'}
                                className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
                            >
                                Go to Login
                            </button>
                            <button
                                onClick={() => this.setState({ hasError: false })}
                                className="px-4 py-2 rounded-lg bg-white/[0.05] text-white/60 text-sm font-medium hover:bg-white/[0.08] transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function DashboardLayout() {
    return (
        <div className="min-h-screen w-full bg-[#020202]">
            <ErrorBoundary>
                <CardNav />
                <CommandPalette />
                <main className="w-full min-h-screen pt-[76px] px-4 sm:px-6 lg:px-8 pb-10 max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </ErrorBoundary>
        </div>
    );
}

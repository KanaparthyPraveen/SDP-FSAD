import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
}

const ICONS = {
    success: <CheckCircle size={16} className="text-green-400 shrink-0" />,
    error:   <XCircle size={16} className="text-red-400 shrink-0" />,
    warning: <AlertTriangle size={16} className="text-yellow-400 shrink-0" />,
    info:    <Info size={16} className="text-blue-400 shrink-0" />,
};

const BORDER = {
    success: 'border-green-500/30 bg-green-500/10',
    error:   'border-red-500/30 bg-red-500/10',
    warning: 'border-yellow-500/30 bg-yellow-500/10',
    info:    'border-blue-500/30 bg-blue-500/10',
};

let _id = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const toast = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++_id;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
        return id;
    }, []);

    const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: 60, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 60, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-sm text-sm font-medium text-white ${BORDER[t.type]}`}
                        >
                            {ICONS[t.type]}
                            <span className="flex-1 text-white/90">{t.message}</span>
                            <button
                                onClick={() => remove(t.id)}
                                className="text-white/40 hover:text-white transition-colors ml-1"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Confirmation dialog modal.
 * Props:
 *   open: bool
 *   title: string
 *   message: string
 *   confirmLabel: string  (default "Confirm")
 *   onConfirm: fn
 *   onCancel: fn
 *   danger: bool          (red style for destructive actions)
 */
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger = false }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="bg-[#0d0d0d] border border-white/[0.08] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
            >
                <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle size={20} className={danger ? 'text-red-400 shrink-0 mt-0.5' : 'text-yellow-400 shrink-0 mt-0.5'} />
                        <div>
                            <h3 className="font-semibold text-white text-base">{title}</h3>
                            <p className="text-sm text-white/60 mt-1 leading-relaxed">{message}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.04] text-sm font-medium transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                                danger
                                    ? 'bg-red-500/90 hover:bg-red-500 text-white'
                                    : 'bg-accent hover:bg-accent-hover text-white'
                            }`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

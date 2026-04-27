import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Notification = ({ message, type, onClose }: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      className={`fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
        type === 'success' 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
          : 'bg-rose-50 border-rose-200 text-rose-800'
      }`}
    >
      {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      <p className="font-medium">{message}</p>
      <button onClick={onClose} className="ml-4 hover:opacity-70 transition-opacity">
        <X size={18} />
      </button>
    </motion.div>
  );
};

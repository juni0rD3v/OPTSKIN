import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle size={20} className="text-white" />,
    error: <AlertCircle size={20} className="text-white" />,
    info: <Info size={20} className="text-white" />
  };

  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[60] animate-fade-in-up">
      <div className={`${bgColors[type]} text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 min-w-[300px]`}>
        {icons[type]}
        <span className="font-medium text-sm flex-1">{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
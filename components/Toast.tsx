
import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Allow time for fade-out animation before calling onClose
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl cursor-pointer
                  bg-surface text-textPrimary border border-primary
                  transition-all duration-300 ease-in-out
                  ${isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'}`}
    >
      <p className="text-center font-medium">{message}</p>
    </div>
  );
};

export default Toast;

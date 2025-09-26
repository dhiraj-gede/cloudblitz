import React from 'react';
import type { Toast, ToastType } from '../../contexts/toast-context.ts';

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const { id, message, type } = toast;

  const getToastClasses = () => {
    const baseClasses =
      'px-4 py-3 rounded-lg shadow-lg flex justify-between items-center min-w-[300px]';

    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
      case 'error':
        return `${baseClasses} bg-rose-100 text-rose-800 border border-rose-200`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
    }
  };

  return (
    <div className={getToastClasses()}>
      <span>{message}</span>
      <button onClick={() => onDismiss(id)} className='ml-2 text-gray-500 hover:text-gray-700'>
        ×
      </button>
    </div>
  );
};

// Re-export the types from toast-context
export type { Toast, ToastType };

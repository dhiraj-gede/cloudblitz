import * as React from 'react';
import { ToastContext, type Toast, type ToastType } from './toast-context.ts';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC = () => {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error('ToastContainer must be used within a ToastProvider');
  }

  const { toasts, removeToast } = context;

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2'>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg flex justify-between items-center min-w-[300px] ${
            toast.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : toast.type === 'error'
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className='ml-2 text-gray-500 hover:text-gray-700'
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

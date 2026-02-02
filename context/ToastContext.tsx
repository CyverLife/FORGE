import { Toast, ToastType } from '@/components/ui/Toast';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ToastContextData {
    showToast: (title: string, message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<{ title: string; message: string; type: ToastType } | null>(null);

    const showToast = (title: string, message: string, type: ToastType = 'info') => {
        setToast({ title, message, type });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Toast
                    key={Date.now()} // Force re-render on new toast
                    title={toast.title}
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast(null)}
                />
            )}
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);

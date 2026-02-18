import { GlobalAlertModal } from '@/components/ui/GlobalAlertModal';
import React, { createContext, useCallback, useContext, useState } from 'react';

type AlertButton = {
    text: string;
    onPress?: () => void | Promise<void>;
    style?: 'default' | 'cancel' | 'destructive';
};

type AlertOptions = {
    title: string;
    message?: string;
    buttons?: AlertButton[];
};

type GlobalAlertContextType = {
    showAlert: (title: string, message?: string, buttons?: AlertButton[]) => void;
    hideAlert: () => void;
};

const GlobalAlertContext = createContext<GlobalAlertContextType | undefined>(undefined);

export function GlobalAlertProvider({ children }: { children: React.ReactNode }) {
    const [visible, setVisible] = useState(false);
    const [config, setConfig] = useState<AlertOptions>({ title: '', message: '', buttons: [] });

    const showAlert = useCallback((title: string, message?: string, buttons: AlertButton[] = []) => {
        setConfig({ title, message, buttons });
        setVisible(true);
    }, []);

    const hideAlert = useCallback(() => {
        setVisible(false);
    }, []);

    const value = React.useMemo(() => ({
        showAlert,
        hideAlert
    }), [showAlert, hideAlert]);

    return (
        <GlobalAlertContext.Provider value={value}>
            {children}
            <GlobalAlertModal
                visible={visible}
                title={config.title}
                message={config.message}
                buttons={config.buttons}
                onClose={hideAlert}
            />
        </GlobalAlertContext.Provider>
    );
}

export function useGlobalAlert() {
    const context = useContext(GlobalAlertContext);
    if (context === undefined) {
        throw new Error('useGlobalAlert must be used within a GlobalAlertProvider');
    }
    return context;
}

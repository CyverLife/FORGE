import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

// TODO: Replace with actual RevenueCat Public API Keys
const API_KEYS = {
    apple: 'appl_REPLACE_WITH_YOUR_KEY',
    google: 'goog_REPLACE_WITH_YOUR_KEY',
};

export function useRevenueCat() {
    const [currentOffering, setCurrentOffering] = useState<PurchasesPackage | null>(null);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [isPro, setIsPro] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkEntitlements = (info: CustomerInfo) => {
        if (info.entitlements.active['pro']) { // 'pro' should match your Entitlement ID in RevenueCat
            setIsPro(true);
        } else {
            setIsPro(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                if (Platform.OS === 'ios') {
                    await Purchases.configure({ apiKey: API_KEYS.apple });
                } else if (Platform.OS === 'android') {
                    await Purchases.configure({ apiKey: API_KEYS.google });
                }

                const info = await Purchases.getCustomerInfo();
                setCustomerInfo(info);
                checkEntitlements(info);

                const offerings = await Purchases.getOfferings();
                if (offerings.current && offerings.current.availablePackages.length > 0) {
                    setCurrentOffering(offerings.current.availablePackages[0]);
                }
            } catch (e) {
                console.warn('RevenueCat Init Error:', e);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    const purchasePro = async () => {
        if (!currentOffering) return;
        try {
            setLoading(true);
            const { customerInfo } = await Purchases.purchasePackage(currentOffering);
            setCustomerInfo(customerInfo);
            checkEntitlements(customerInfo);
        } catch (e: any) {
            if (!e.userCancelled) {
                console.error('Purchase Error:', e);
            }
        } finally {
            setLoading(false);
        }
    };

    const restorePurchases = async () => {
        try {
            setLoading(true);
            const info = await Purchases.restorePurchases();
            setCustomerInfo(info);
            checkEntitlements(info);
        } catch (e) {
            console.error('Restore Error:', e);
        } finally {
            setLoading(false);
        }
    };

    return {
        isPro,
        currentOffering,
        purchasePro,
        restorePurchases,
        loading
    };
}

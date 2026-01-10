"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PaywallContextType {
    isOpen: boolean;
    openPaywall: () => void;
    closePaywall: () => void;
}

const PaywallContext = createContext<PaywallContextType | undefined>(undefined);

export function PaywallProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openPaywall = () => setIsOpen(true);
    const closePaywall = () => setIsOpen(false);

    return (
        <PaywallContext.Provider value={{ isOpen, openPaywall, closePaywall }}>
            {children}
        </PaywallContext.Provider>
    );
}

export function usePaywall() {
    const context = useContext(PaywallContext);
    if (!context) {
        throw new Error("usePaywall must be used within PaywallProvider");
    }
    return context;
}

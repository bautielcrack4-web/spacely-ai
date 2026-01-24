"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SupportContextType {
    isOpen: boolean;
    openSupport: (category?: string, description?: string) => void;
    closeSupport: () => void;
    initialCategory: string;
    initialDescription: string;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export function SupportProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [initialCategory, setInitialCategory] = useState("Bug");
    const [initialDescription, setInitialDescription] = useState("");

    const openSupport = (category: string = "Bug", description: string = "") => {
        setInitialCategory(category);
        setInitialDescription(description);
        setIsOpen(true);
    };

    const closeSupport = () => {
        setIsOpen(false);
        setInitialDescription("");
    };

    return (
        <SupportContext.Provider value={{ isOpen, openSupport, closeSupport, initialCategory, initialDescription }}>
            {children}
        </SupportContext.Provider>
    );
}

export function useSupport() {
    const context = useContext(SupportContext);
    if (context === undefined) {
        throw new Error('useSupport must be used within a SupportProvider');
    }
    return context;
}

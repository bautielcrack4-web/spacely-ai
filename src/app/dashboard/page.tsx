"use client";

import { useState, useEffect } from "react";
import { DesignTool } from "@/components/DesignTool";
import { PaywallModal } from "@/components/PaywallModal";
import { supabase } from "@/lib/supabase";
import { HistoryGallery } from "@/components/dashboard/HistoryGallery";
import { useDesignGenerator } from "@/hooks/useDesignGenerator";

export default function DashboardPage() {
    const {
        loading,
        generatedImage,
        showPaywall,
        setShowPaywall,
        generateDesign,
        clearGeneration
    } = useDesignGenerator();

    const [initialState, setInitialState] = useState<{ preview: string, prompt: string, style: string } | null>(null);

    // Auth Check & Restore State
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            const pending = localStorage.getItem('pendingDesign');
            if (session && pending) {
                try {
                    const data = JSON.parse(pending);
                    setInitialState(data);
                } catch (e) {
                    console.error("Failed to parse pending design", e);
                }
            } else if (!session) {
                window.location.href = '/login';
            }
        };
        checkAuth();
    }, []);

    return (
        <div className="min-h-screen bg-[#FAFBFC] relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-50/50 to-transparent pointer-events-none" />

            <div className="max-w-[1920px] mx-auto px-4 md:px-6">
                <DesignTool
                    onGenerate={generateDesign}
                    onClear={() => {
                        clearGeneration();
                        setInitialState(null);
                    }}
                    loading={loading}
                    generatedImage={generatedImage}
                    initialState={initialState}
                />

                <HistoryGallery />
            </div>

            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
        </div>
    );
}

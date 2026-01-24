"use client";

import { useState, useEffect, Suspense } from "react";
import { DesignTool } from "@/components/DesignTool";
import { supabase } from "@/lib/supabase";
import { HistoryGallery } from "@/components/dashboard/HistoryGallery";
import { useDesignGenerator } from "@/hooks/useDesignGenerator";
import { useSearchParams } from "next/navigation";

function CreatePageContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode") || "interior";
    const templateFromUrl = searchParams.get("template");
    const styleFromUrl = searchParams.get("style");

    const {
        loading,
        generatedImage,
        isLocked,
        generateDesign,
        clearGeneration
    } = useDesignGenerator();

    const [initialState, setInitialState] = useState<{ preview: string, prompt: string, style: string } | null>(null);

    // Auth Check & Restore State
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            // Check if template and style are in URL (from Discover page)
            if (templateFromUrl) {
                setInitialState({
                    preview: templateFromUrl,
                    prompt: "",
                    style: styleFromUrl || "Modern Minimalist"
                });
                return;
            }

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
        <div className="min-h-screen relative overflow-hidden">
            {/* Premium Background with Mesh Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20" />

            {/* Animated Gradient Orbs */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-40 right-0 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

            <div className="max-w-[1920px] mx-auto px-4 md:px-6 relative z-10">
                <DesignTool
                    onGenerate={(file, prompt, style, preview) => generateDesign(file, prompt, style, preview, mode)}
                    onClear={() => {
                        clearGeneration();
                        setInitialState(null);
                    }}
                    loading={loading}
                    generatedImage={generatedImage}
                    isLocked={isLocked}
                    initialState={initialState}
                    mode={mode}
                />

                <HistoryGallery />
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
                <div className="text-gray-400 font-bold">Loading...</div>
            </div>
        }>
            <CreatePageContent />
        </Suspense>
    );
}

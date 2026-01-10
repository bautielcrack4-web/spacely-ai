"use client";

import { useState, useEffect } from "react";
import { DesignTool } from "@/components/DesignTool";
import { PaywallModal } from "@/components/PaywallModal";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [showPaywall, setShowPaywall] = useState(false);

    // Auth Check
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                window.location.href = '/login';
            }
        };
        checkAuth();
    }, []);

    const handleGenerate = async (file: File, prompt: string, style: string) => {
        if (!file) return;
        setLoading(true);
        setGeneratedImage(null);

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onloadend = async () => {
                const base64data = reader.result;
                // Construct prompt: Style + User Prompt
                const finalPrompt = prompt.trim()
                    ? `${style} style interior, high quality, photorealistic. ${prompt}`
                    : `${style} style interior, high quality, photorealistic, transformation`;

                try {
                    const res = await fetch("/api/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            imageUrl: base64data,
                            prompt: finalPrompt
                        }),
                    });

                    if (res.status === 403) {
                        setShowPaywall(true);
                        setLoading(false);
                        return;
                    }

                    if (!res.ok) {
                        const error = await res.json();
                        throw new Error(error.error || "Generation failed");
                    }

                    const data = await res.json();
                    if (data.result) {
                        const outputUrl = Array.isArray(data.result) ? data.result[0] : data.result;
                        setGeneratedImage(outputUrl);
                    }
                } catch (err: any) {
                    console.error("API Error", err);
                    alert("Error: " + err.message);
                } finally {
                    setLoading(false);
                }
            };
        } catch (error) {
            console.error("Processing Error", error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFBFC] relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-50/50 to-transparent pointer-events-none" />

            <DesignTool
                onGenerate={handleGenerate}
                loading={loading}
                generatedImage={generatedImage}
            />

            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
        </div>
    );
}

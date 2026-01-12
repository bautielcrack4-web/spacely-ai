"use client";

import { useState, useEffect } from "react";
import { DesignTool } from "@/components/DesignTool";
import { PaywallModal } from "@/components/PaywallModal";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function DashboardPage() {
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const [initialState, setInitialState] = useState<{ preview: string, prompt: string, style: string } | null>(null);

    // Auth Check & Restore State
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            // If user is coming back from login with a pending design
            const pending = localStorage.getItem('pendingDesign');
            if (session && pending) {
                try {
                    const data = JSON.parse(pending);
                    setInitialState(data);
                    // Optional: clear it after loading, or keep it until successful generation
                    // localStorage.removeItem('pendingDesign'); 
                } catch (e) {
                    console.error("Failed to parse pending design", e);
                }
            } else if (!session) {
                // If no session and no pending design to restore, redirect to login
                window.location.href = '/login';
            }
        };
        checkAuth();
    }, []);

    const handleGenerate = async (file: File | null, prompt: string, style: string, currentPreview?: string) => {
        setLoading(true);
        setGeneratedImage(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            // 1. If not logged in, save state and redirect
            if (!session) {
                // If we have a file, convert to base64 to save
                let base64ToSave = currentPreview || "";

                if (file && !base64ToSave) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    await new Promise(resolve => {
                        reader.onloadend = () => {
                            base64ToSave = reader.result as string;
                            resolve(true);
                        }
                    });
                }

                if (base64ToSave) {
                    localStorage.setItem('pendingDesign', JSON.stringify({
                        preview: base64ToSave,
                        prompt,
                        style
                    }));
                    window.location.href = '/login?returnTo=/dashboard&action=generate';
                    return;
                }
            }

            // 2. Logic for logged in users
            let base64data = currentPreview || ""; // Use preview if available (restored state)

            if (file && !base64data.startsWith('data:')) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                await new Promise((resolve, reject) => {
                    reader.onloadend = () => {
                        base64data = reader.result as string;
                        resolve(true);
                    };
                    reader.onerror = () => reject(new Error("Failed to read file"));
                });
            }

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
                    throw new Error(error.details || error.error || "Generation failed");
                }

                const data = await res.json();
                if (data.result) {
                    const outputUrl = Array.isArray(data.result) ? data.result[0] : data.result;
                    setGeneratedImage(outputUrl);
                    toast.success("Design generated successfully!");
                    // Clear pending design if successful
                    localStorage.removeItem('pendingDesign');
                }
            } catch (err: any) {
                console.error("API Error", err);
                toast.error(err.message || "Failed to generate design");
            } finally {
                setLoading(false);
            }

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
                onGenerate={(file, prompt, style, currentPreview) => handleGenerate(file, prompt, style, currentPreview)}
                onClear={() => {
                    setGeneratedImage(null);
                    setInitialState(null);
                    localStorage.removeItem('pendingDesign');
                }}
                loading={loading}
                generatedImage={generatedImage}
                initialState={initialState}
            />

            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
        </div>
    );
}

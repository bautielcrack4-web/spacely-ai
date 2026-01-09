"use client";

import { useState, useEffect } from "react";
import { RenderControls } from "@/components/dashboard/RenderControls";
import { PreviewArea } from "@/components/dashboard/PreviewArea";
import { RecentGallery } from "@/components/dashboard/RecentGallery";
import { PaywallModal } from "@/components/PaywallModal";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("");
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);

    // Auth Check on mount
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                window.location.href = '/login';
            }
        };
        checkAuth();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleGenerate = async (settings: any) => {
        if (!preview) return; // Prompt can be empty as we might auto-generate it or use styles
        setLoading(true);
        setGeneratedImage(null);

        try {
            // Converting blob URL to base64 for Replicate API
            const response = await fetch(preview);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64data = reader.result;
                const fullPrompt = `${settings.roomType} ${settings.sceneType}, ${prompt}`; // Simple prompt construction

                try {
                    const res = await fetch("/api/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            imageUrl: base64data,
                            prompt: fullPrompt
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

            reader.readAsDataURL(blob);

        } catch (error) {
            console.error("Processing Error", error);
            setLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-theme(spacing.12))] gap-6">
            <RenderControls
                onGenerate={handleGenerate}
                loading={loading}
                file={file}
                onFileChange={handleFileChange}
                prompt={prompt}
                setPrompt={setPrompt}
            />

            <PreviewArea
                image={generatedImage}
                loading={loading}
            />

            <RecentGallery />

            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
        </div>
    );
}

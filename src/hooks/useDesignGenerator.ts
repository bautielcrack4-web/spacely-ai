"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useDesignGenerator() {
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [showPaywall, setShowPaywall] = useState(false);

    const generateDesign = async (file: File | null, prompt: string, style: string, currentPreview?: string) => {
        setLoading(true);
        setGeneratedImage(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            // 1. If not logged in, save state and redirect
            if (!session) {
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

            // 2. Process for logged in users
            let base64data = currentPreview || "";

            if (file && !file.name.includes('data:')) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                await new Promise((resolve, reject) => {
                    reader.onloadend = () => {
                        base64data = reader.result as string;
                        resolve(true);
                    };
                    reader.onerror = () => reject(new Error("Failed to read file"));
                });
            } else if (!base64data && !file) {
                toast.error("Please upload an image or select a template");
                setLoading(false);
                return;
            }

            // Handle template URL conversion
            if (base64data.startsWith('/')) {
                try {
                    const response = await fetch(base64data);
                    const blob = await response.blob();
                    await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            base64data = reader.result as string;
                            resolve(true);
                        };
                        reader.readAsDataURL(blob);
                    });
                } catch (e) {
                    console.error("Failed to convert template to base64", e);
                }
            }

            // Construct prompt
            const finalPrompt = prompt.trim()
                ? `${style} style interior, high quality, photorealistic. ${prompt}`
                : `${style} style interior, high quality, photorealistic, transformation`;

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
                localStorage.removeItem('pendingDesign');
            }

        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to generate design";
            console.error("API Error", err);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const clearGeneration = () => {
        setGeneratedImage(null);
        localStorage.removeItem('pendingDesign');
    };

    return {
        loading,
        generatedImage,
        showPaywall,
        setShowPaywall,
        generateDesign,
        clearGeneration
    };
}

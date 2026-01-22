"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { usePaywall } from "@/contexts/PaywallContext";

export function useDesignGenerator() {
    const [loading, setLoading] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const { openPaywall } = usePaywall();

    const generateDesign = async (file: File | null, prompt: string, style: string, currentPreview?: string) => {
        setLoading(true);
        setGeneratedImage(null);
        setIsLocked(false);

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

            // Handle Limits (Teaser Mode)
            if (res.status === 403 || res.status === 429) {
                // Determine if it's a credit limit or daily limit
                // For now, treat both as "Paywall Teaser"

                // Simulate generation time (so the user feels the value)
                await new Promise(resolve => setTimeout(resolve, 4000));

                // Set the INPUT image as the result (it will be blurred anyway)
                // This saves us from generating a real image but gives the "result exists" feeling
                setGeneratedImage(base64data);
                setIsLocked(true);
                setLoading(false);

                // Don't open paywall immediately, let the user click "Unlock" on the image
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
            if (!isLocked) { // Only unset loading if we didn't handle it in the locked flow
                setLoading(false);
            }
            // Actually, we set loading false in the locked flow too.
            // But React state updates are batched/async, so standard cleanup is safer if we guard it.
            // Simplified: just ensure setLoading(false) runs if we didn't return early.
            // But we returned in the locked block. So this finally block runs for exceptions.
            // Let's make it cleaner.
        }
    };

    const clearGeneration = () => {
        setGeneratedImage(null);
        setIsLocked(false);
        localStorage.removeItem('pendingDesign');
    };

    return {
        loading,
        generatedImage,
        isLocked,
        generateDesign,
        clearGeneration
    };
}

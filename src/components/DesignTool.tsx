"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Upload, Loader2, ArrowRight, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaywallModal } from "@/components/PaywallModal";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export function DesignTool() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("");
    const [showPaywall, setShowPaywall] = useState(false);
    const [credits, setCredits] = useState<number | null>(null);

    useEffect(() => {
        checkCredits();
    }, []);

    const checkCredits = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const { data } = await supabase
                .from('profiles')
                .select('credits')
                .eq('id', session.user.id)
                .single();
            if (data) setCredits(data.credits);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleGenerate = async () => {
        if (!preview || !prompt) return;
        setLoading(true);
        setGeneratedImage(null);

        try {
            // 1. Convert file to base64 or upload to blob storage (simplified here as base64 for demo)
            // For real prod, upload to Supabase Storage first.

            // Converting blob URL to base64 for Replicate API
            const response = await fetch(preview);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64data = reader.result;

                const res = await fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        imageUrl: base64data,
                        prompt: prompt
                    }),
                });

                if (res.status === 403) {
                    setShowPaywall(true);
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                if (data.result) {
                    // Replicate usually returns an array of output URLs or a single object depending on model
                    // Adapting based on standard Pruna output
                    const outputUrl = Array.isArray(data.result) ? data.result[0] : data.result;
                    setGeneratedImage(outputUrl);
                    checkCredits();
                }
                setLoading(false);
            };

            reader.readAsDataURL(blob);

        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <>
            <section id="design-tool" className="py-20 bg-surface-100/50 border-y border-border">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Try it yourself</h2>
                        <p className="text-gray-400">Upload a photo and describe your dream style.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Input Section */}
                        <div className="space-y-6">
                            <div
                                className={cn(
                                    "aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center transition-colors cursor-pointer relative overflow-hidden",
                                    !preview ? "hover:border-brand/50 hover:bg-surface-200/50" : "border-brand"
                                )}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />

                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-12 h-12 rounded-full bg-surface-200 flex items-center justify-center mx-auto mb-4 text-gray-400">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-medium text-white">Click or drag image here</p>
                                        <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe your desired style (e.g., 'Modern minimalist living room with plants')"
                                    className="w-full h-24 bg-surface-100 border border-border rounded-lg p-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none text-sm"
                                />
                            </div>

                            <Button
                                onClick={handleGenerate}
                                className="w-full"
                                size="lg"
                                variant="accent"
                                disabled={!preview || !prompt || loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        Generate Redesign
                                        <Sparkles className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Output Section */}
                        <div className="rounded-xl border border-border bg-black/50 overflow-hidden relative min-h-[300px] flex items-center justify-center">
                            {generatedImage ? (
                                <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-8 text-gray-600">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>Your generated design will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
        </>
    );
}

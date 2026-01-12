"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Upload, ImageIcon, Download, Wand2, Sparkles, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { PremiumLoader } from "@/components/ui/PremiumLoader";

const QUICK_ACTIONS = [
    { label: "Make it modern", prompt: "Change the interior design to modern minimalist style" },
    { label: "Add plants", prompt: "Add indoor plants to make the room livelier" },
    { label: "Change to wooden floor", prompt: "Change the flooring to hardwood" },
    { label: "Blue walls", prompt: "Change the wall color to navy blue" },
    { label: "Sunset lighting", prompt: "Change lighting to golden hour sunset" },
];

export default function MagicEditPage() {
    const { t } = useLanguage();
    const [image, setImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File is too large. Max 10MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target?.result as string);
            setResultImage(null); // Reset result on new upload
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async () => {
        if (!image || !prompt) {
            toast.error("Please provide an image and instructions.");
            return;
        }

        setIsGenerating(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const response = await fetch("/api/edit/magic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: resultImage || image, // Allow chaining edits
                    prompt,
                    userId: user?.id
                })
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("API Error Body:", text);
                let errorMessage = response.statusText;
                try {
                    const errorJson = JSON.parse(text);
                    errorMessage = errorJson.error || errorMessage;
                } catch {
                    // unexpected non-json error (e.g. Vercel timeout HTML)
                    errorMessage = `Error ${response.status}: ${text.slice(0, 100)}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            setResultImage(data.result);
            setPrompt(""); // Clear prompt after success
            toast.success("Magic edit complete!");

        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : "Failed to edit image. Play try again.";
            toast.error(message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-100px)] flex flex-col">
            <div className="mb-6 flex-none">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 mb-2">
                    <Wand2 className="w-8 h-8 text-purple-600" />
                    {t("magic.title")}
                </h1>
                <p className="text-gray-500 font-medium text-lg">
                    {t("magic.subtitle")}
                </p>
            </div>

            <div className="flex-1 bg-gray-50 rounded-[2.5rem] border border-gray-100 p-8 relative overflow-hidden flex items-center justify-center group">

                {/* Main Canvas Area */}
                {image ? (
                    <div className="relative w-full h-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl transition-all">
                        <Image
                            src={resultImage || image}
                            alt="Workspace"
                            fill
                            className="object-contain"
                        />

                        {/* Loading Overlay */}
                        <AnimatePresence>
                            {isGenerating && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center"
                                >
                                    <PremiumLoader />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Reset Button (Only if edited) */}
                        {resultImage && (
                            <button
                                onClick={() => setResultImage(null)}
                                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                            >
                                Reset to Original
                            </button>
                        )}

                        {/* Download Button (Only if edited) */}
                        {resultImage && (
                            <a
                                href={resultImage}
                                download="spacely-magic-edit.png"
                                target="_blank"
                                className="absolute top-4 left-4 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-lg"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </a>
                        )}
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300">
                        <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mb-6">
                            <Upload className="w-10 h-10 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("magic.upload_label")}</h3>
                        <p className="text-gray-500">Click to start editing</p>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                )}
            </div>

            {/* Prompt Bar - Floating Bottom */}
            <div className="mt-6 flex-none">
                <div className="relative max-w-3xl mx-auto">
                    <div className="flex h-16 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden items-center p-2 pl-6 gap-4">
                        <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t("magic.placeholder")}
                            disabled={!image || isGenerating}
                            className="flex-1 h-full outline-none text-gray-700 font-medium placeholder:text-gray-400 bg-transparent"
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <Button
                            onClick={handleGenerate}
                            disabled={!image || !prompt || isGenerating}
                            className="h-12 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all"
                        >
                            {isGenerating ? "..." : <MoveRight className="w-5 h-5" />}
                        </Button>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 justify-center mt-4 flex-wrap">
                        {QUICK_ACTIONS.map((action) => (
                            <button
                                key={action.label}
                                onClick={() => setPrompt(action.prompt)}
                                disabled={!image}
                                className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

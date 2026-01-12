"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Upload, ImageIcon, Download, Palette, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { PremiumLoader } from "@/components/ui/PremiumLoader";

const PALETTES = [
    { id: "minimalist", name: "Minimalist White", colors: ["#FFFFFF", "#F5F5F5", "#D4D4D4"] },
    { id: "warm_terracotta", name: "Warm Terracotta", colors: ["#E2725B", "#F4A460", "#D2B48C"] },
    { id: "navy_gold", name: "Navy & Gold", colors: ["#000080", "#FFD700", "#FFFFFF"] },
    { id: "sage_green", name: "Sage Green", colors: ["#9DC183", "#F0FFF0", "#8FBC8F"] },
    { id: "moody_black", name: "Moody Black", colors: ["#000000", "#333333", "#666666"] },
    { id: "boho_chic", name: "Boho Chic", colors: ["#DEB887", "#A0522D", "#F5DEB3"] },
];

export default function ColorPage() {
    const { t } = useLanguage();
    const [image, setImage] = useState<string | null>(null);
    const [selectedPalette, setSelectedPalette] = useState<string | null>(null);
    const [customPrompt, setCustomPrompt] = useState("");
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
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async () => {
        if (!image) {
            toast.error("Please upload a room photo first.");
            return;
        }

        const palette = selectedPalette ? PALETTES.find(p => p.id === selectedPalette)?.name : null;

        if (!palette && !customPrompt) {
            toast.error("Please select a palette or enter a custom prompt.");
            return;
        }

        setIsGenerating(true);
        setResultImage(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const response = await fetch("/api/edit/color", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image,
                    palette,
                    prompt: customPrompt,
                    userId: user?.id
                })
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setResultImage(data.result);
            toast.success("Colors applied successfully!");

        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : "Failed to change colors. Please try again.";
            toast.error(message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 mb-2">
                    <Palette className="w-8 h-8 text-purple-600" />
                    {t("color.title")}
                </h1>
                <p className="text-gray-500 font-medium text-lg">
                    {t("color.subtitle")}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Inputs Section */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Room Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">1</span>
                            {t("color.upload_label")}
                        </label>
                        <div className="relative aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden hover:border-purple-300 transition-colors group">
                            {image ? (
                                <>
                                    <Image src={image} alt="Room" fill className="object-cover" />
                                    <button
                                        onClick={() => setImage(null)}
                                        className="absolute top-2 right-2 bg-white/80 backdrop-blur text-xs font-bold px-2 py-1 rounded-lg hover:bg-white"
                                    >
                                        Change
                                    </button>
                                </>
                            ) : (
                                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <span className="text-gray-500 font-medium">Click to upload photo</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Palette Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">2</span>
                            {t("color.palette_label")}
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            {PALETTES.map((palette) => (
                                <button
                                    key={palette.id}
                                    onClick={() => {
                                        setSelectedPalette(palette.id);
                                        setCustomPrompt("");
                                    }}
                                    className={cn(
                                        "p-3 rounded-xl border text-left transition-all hover:shadow-md",
                                        selectedPalette === palette.id
                                            ? "border-purple-600 bg-purple-50 ring-2 ring-purple-200"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                    )}
                                >
                                    <div className="flex gap-1 mb-2">
                                        {palette.colors.map(color => (
                                            <div key={color} className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: color }} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-gray-800 block">{palette.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Custom Prompt */}
                        <div className="pt-2">
                            <input
                                type="text"
                                value={customPrompt}
                                onChange={(e) => {
                                    setCustomPrompt(e.target.value);
                                    setSelectedPalette(null);
                                }}
                                placeholder={t("color.custom_prompt")}
                                className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={!image || (!selectedPalette && !customPrompt) || isGenerating}
                        className="w-full h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg shadow-lg hover:opacity-95 disabled:opacity-50 transition-all"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                Applying Colors...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Wand2 className="w-5 h-5" />
                                {t("color.generate")}
                            </span>
                        )}
                    </Button>
                </div>

                {/* Result Section */}
                <div className="lg:col-span-7 h-full">
                    <div className="bg-gray-50 rounded-[2.5rem] border border-gray-100 p-6 h-full min-h-[600px] flex items-center justify-center relative overflow-hidden">
                        {resultImage ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                            >
                                <Image src={resultImage} alt="Result" fill className="object-cover" />
                                <a
                                    href={resultImage}
                                    download="spacely-color-match.png"
                                    target="_blank"
                                    className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-2 font-bold flex items-center gap-2 hover:bg-white/30 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download High Res
                                </a>
                            </motion.div>
                        ) : (
                            <div className="text-center text-gray-400">
                                {isGenerating ? (
                                    <PremiumLoader />
                                ) : (
                                    <>
                                        <Palette className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                        <p className="font-medium">Result will appear here</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

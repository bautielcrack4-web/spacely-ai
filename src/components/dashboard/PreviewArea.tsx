"use client";

import { Home, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { ComparisonSlider } from "@/components/ui/comparison-slider";
import { useLanguage } from "@/contexts/LanguageContext";

interface PreviewAreaProps {
    image: string | null;
    original?: string | null;
    loading: boolean;
}

export function PreviewArea({ image, original, loading }: PreviewAreaProps) {
    const { t } = useLanguage();
    return (
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 flex items-center justify-center overflow-hidden relative min-h-[600px] shadow-sm shadow-purple-50/20">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#9333ea 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />

            {loading ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                    {/* If we have the original, show it as base for scanning */}
                    {original && (
                        <div className="absolute inset-8 overflow-hidden rounded-2xl border border-purple-100 shadow-inner">
                            <img
                                src={original}
                                alt={t("preview.scanning")}
                                className="w-full h-full object-contain opacity-40 grayscale-[50%]"
                            />
                            {/* The Scanline */}
                            <div className="scanline bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
                            {/* Grid Overlay */}
                            <div className="absolute inset-0 bg-[url('/grid.png')] opacity-5 bg-repeat" />
                        </div>
                    )}

                    <div className="z-30 flex flex-col items-center gap-6 bg-white/90 p-10 rounded-3xl backdrop-blur-xl border border-purple-100 shadow-2xl shadow-purple-100/50">
                        <div className="w-20 h-20 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-gray-900 font-bold text-xl tracking-tight">{t("preview.processing")}</p>
                            <p className="text-purple-600 text-xs font-bold uppercase tracking-widest animate-pulse">{t("preview.geometry")}</p>
                        </div>
                    </div>
                </div>
            ) : image && original ? (
                <div className="relative w-full h-full p-8">
                    <ComparisonSlider
                        original={original}
                        modified={image}
                        className="rounded-2xl shadow-2xl shadow-purple-900/10 border border-purple-100"
                    />
                </div>
            ) : image ? (
                <div className="relative w-full h-full p-4">
                    <img
                        src={image}
                        alt={t("controls.upload.ready")}
                        className="w-full h-full object-contain rounded-lg shadow-2xl"
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6 z-10 text-center max-w-sm">
                    <div className="w-28 h-28 rounded-full bg-purple-50 flex items-center justify-center mb-2 relative group-hover:scale-105 transition-transform duration-500 shadow-inner">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg shadow-purple-100/50">
                            <ImageIcon className="w-10 h-10 text-purple-600" />
                        </div>
                        <div className="absolute inset-0 bg-purple-500/5 blur-[40px] rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-gray-900 text-2xl font-bold tracking-tight">{t("preview.noResults")}</h2>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed px-4">
                            {t("preview.desc")}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

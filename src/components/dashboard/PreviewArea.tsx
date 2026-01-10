"use client";

import { Home, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { ComparisonSlider } from "@/components/ui/comparison-slider";

interface PreviewAreaProps {
    image: string | null;
    original?: string | null;
    loading: boolean;
}

export function PreviewArea({ image, original, loading }: PreviewAreaProps) {
    return (
        <div className="flex-1 bg-[#050505] rounded-2xl border border-[#1F1F1F] flex items-center justify-center overflow-hidden relative min-h-[600px]">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            {loading ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                    {/* If we have the original, show it as base for scanning */}
                    {original && (
                        <div className="absolute inset-4 overflow-hidden rounded-lg border border-[#A78BFA]/30">
                            <img
                                src={original}
                                alt="Scanning..."
                                className="w-full h-full object-contain opacity-50 blur-[2px]"
                            />
                            {/* The Scanline */}
                            <div className="scanline"></div>
                            {/* Grid Overlay for "Tech" feel */}
                            <div className="absolute inset-0 bg-[url('/grid.png')] opacity-20 bg-repeat" />
                        </div>
                    )}

                    <div className="z-30 flex flex-col items-center gap-4 bg-black/60 p-6 rounded-2xl backdrop-blur-md border border-[#A78BFA]/20">
                        <div className="w-16 h-16 rounded-full border-2 border-[#A78BFA] border-t-transparent animate-spin flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#A78BFA] animate-pulse" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-white font-bold text-lg tracking-wide">AI PROCESSING</p>
                            <p className="text-[#A78BFA] text-xs font-mono animate-pulse">Scanning geometry...</p>
                        </div>
                    </div>
                </div>
            ) : image && original ? (
                <div className="relative w-full h-full p-4">
                    <ComparisonSlider
                        original={original}
                        modified={image}
                        className="rounded-lg shadow-2xl"
                    />
                </div>
            ) : image ? (
                <div className="relative w-full h-full p-4">
                    <img
                        src={image}
                        alt="Generated Render"
                        className="w-full h-full object-contain rounded-lg shadow-2xl"
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 z-10 text-center max-w-sm">
                    <div className="w-24 h-24 rounded-full border border-[#1F1F1F] flex items-center justify-center mb-2">
                        <div className="w-20 h-20 rounded-full bg-[#1F1F1F] flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-[#A78BFA]" />
                        </div>
                    </div>
                    <h2 className="text-white text-xl font-bold">No Results Yet</h2>
                    <p className="text-gray-500 text-sm">
                        Fill in the form on the left by uploading an image and selecting a style to generate your first interior.
                    </p>
                    <div className="w-full h-full absolute inset-0 bg-[#A78BFA] opacity-[0.02] blur-[100px] pointer-events-none rounded-full" />
                </div>
            )}
        </div>
    );
}

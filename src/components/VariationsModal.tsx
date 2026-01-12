"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Wand2, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Variation {
    id: string;
    image_url: string;
    seed: number;
}

interface VariationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    variations: Variation[];
    isLoading: boolean;
    onUseVariation?: (variation: Variation) => void;
}

export function VariationsModal({ isOpen, onClose, variations, isLoading, onUseVariation }: VariationsModalProps) {
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const handleDownload = async (variation: Variation) => {
        try {
            setDownloadingId(variation.id);
            const response = await fetch(variation.image_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `spacely-variation-${variation.seed}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 p-6 md:p-8"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                    <Wand2 className="w-6 h-6 text-purple-600" />
                                    Design Variations
                                </h2>
                                <p className="text-gray-500 font-medium">
                                    Alternative versions generated with different seeds
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                                <div className="relative w-20 h-20">
                                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin" />
                                </div>
                                <p className="text-gray-500 font-medium animate-pulse">Generating mostly identical universes...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {variations.map((variation, idx) => (
                                    <motion.div
                                        key={variation.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-100 hover:border-purple-200 transition-all shadow-sm hover:shadow-lg"
                                    >
                                        <Image
                                            src={variation.image_url}
                                            alt={`Variation ${variation.seed}`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        {/* Overlay Action Bar */}
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-xs text-white/80 font-mono">Seed: {variation.seed}</span>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="h-8 w-8 p-0 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-none"
                                                    onClick={() => handleDownload(variation)}
                                                >
                                                    {downloadingId === variation.id ? (
                                                        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                                                    ) : (
                                                        <Download className="w-4 h-4" />
                                                    )}
                                                </Button>
                                                {onUseVariation && (
                                                    <Button
                                                        size="sm"
                                                        className="h-8 px-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white border-none text-xs font-bold"
                                                        onClick={() => onUseVariation(variation)}
                                                    >
                                                        Use This
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-900"
                            >
                                Close
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

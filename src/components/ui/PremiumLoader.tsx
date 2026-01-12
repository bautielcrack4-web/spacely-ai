"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, CheckCircle2, Sparkles, Wand2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface PremiumLoaderProps {
    className?: string;
    text?: string;
}

export function PremiumLoader({ className, text }: PremiumLoaderProps) {
    const { t } = useLanguage();
    const [step, setStep] = useState<"scanning" | "processing" | "generating">("scanning");

    useEffect(() => {
        // Sequence logic
        const t1 = setTimeout(() => setStep("processing"), 2500); // Scan for 2.5s
        const t2 = setTimeout(() => setStep("generating"), 4000); // Process for 1.5s then generate

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    return (
        <div className={cn("flex flex-col items-center justify-center p-8", className)}>
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">

                {/* Background Pulse (Always active but changes color) */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className={cn(
                        "absolute inset-0 rounded-full blur-xl",
                        step === "scanning" ? "bg-blue-400/30" :
                            step === "processing" ? "bg-green-400/30" : "bg-purple-400/30"
                    )}
                />

                <AnimatePresence mode="wait">
                    {step === "scanning" && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="relative w-full h-full flex items-center justify-center"
                        >
                            <Scan className="w-12 h-12 text-blue-500 relative z-10" />
                            {/* Rotating Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-transparent border-t-blue-500 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 border-2 border-transparent border-b-blue-300 rounded-full opacity-50"
                            />
                        </motion.div>
                    )}

                    {step === "processing" && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="relative w-full h-full flex items-center justify-center"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                className="absolute inset-0 bg-green-400 rounded-full z-[-1]"
                            />
                        </motion.div>
                    )}

                    {step === "generating" && (
                        <motion.div
                            key="generating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative w-full h-full flex items-center justify-center"
                        >
                            <Sparkles className="w-12 h-12 text-purple-600 animate-pulse" />
                            {/* Fluid Morphing Blobs */}
                            <div className="absolute inset-0 animate-spin-slow">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full blur-sm" />
                                <div className="absolute bottom-0 right-1/2 w-3 h-3 bg-pink-400 rounded-full blur-sm" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Text Flow */}
            <div className="h-16 flex flex-col items-center">
                <AnimatePresence mode="wait">
                    {step === "scanning" && (
                        <motion.div
                            key="text-scan"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{t('loader.scanning')}</h3>
                            <div className="flex gap-1 justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </motion.div>
                    )}

                    {step === "processing" && (
                        <motion.div
                            key="text-proc"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{t('loader.processing')}</h3>
                            <p className="text-sm text-green-600 font-medium">Structure identified</p>
                        </motion.div>
                    )}

                    {step === "generating" && (
                        <motion.div
                            key="text-gen"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center w-64"
                        >
                            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                                {text || t('loader.generating')}
                            </h3>
                            {/* Progress Bar */}
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2.5, ease: "easeInOut" }}
                                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_100%] animate-shimmer"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

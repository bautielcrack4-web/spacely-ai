"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { STYLES } from "@/lib/constants";

interface StyleSelectorProps {
    selectedStyle: string;
    onSelect: (style: string) => void;
}

export function StyleSelector({ selectedStyle, onSelect }: StyleSelectorProps) {
    const { t } = useLanguage();
    return (
        <div className="grid grid-cols-2 gap-4">
            {STYLES.map((style) => (
                <button
                    key={style.id}
                    onClick={() => onSelect(style.id)}
                    className={cn(
                        "relative aspect-[4/5] rounded-[2rem] flex flex-col justify-end transition-all duration-700 overflow-hidden group border-2 shadow-sm",
                        selectedStyle === style.id
                            ? "border-purple-600 scale-[1.02] shadow-2xl shadow-purple-200 ring-4 ring-purple-500/10"
                            : "border-gray-100 hover:border-purple-300 hover:scale-[1.02] hover:shadow-xl"
                    )}
                >
                    {/* Background Image */}
                    <img
                        src={style.image}
                        alt={style.label}
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out",
                            selectedStyle === style.id ? "scale-110" : "group-hover:scale-110"
                        )}
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500",
                        selectedStyle === style.id ? "opacity-80" : "opacity-60 group-hover:opacity-75"
                    )} />

                    {/* Style Label with Frosted Glass Effect */}
                    <div className="relative z-10 w-full p-4">
                        <div className={cn(
                            "backdrop-blur-xl border rounded-[1.2rem] p-3 transition-all duration-500",
                            selectedStyle === style.id
                                ? "bg-white/20 border-white/40 shadow-lg"
                                : "bg-black/20 border-white/10 group-hover:bg-white/10 group-hover:border-white/20"
                        )}>
                            <p className={cn(
                                "text-[10px] font-black uppercase tracking-[0.2em] text-white text-center leading-none",
                            )}>
                                {t(style.labelKey)}
                            </p>
                        </div>
                    </div>

                    {/* Selected Indicator Badge */}
                    <AnimatePresence>
                        {selectedStyle === style.id && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0, rotate: 45 }}
                                className="absolute top-4 right-4 z-20 w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-2xl border border-purple-100"
                            >
                                <Check className="w-4 h-4 stroke-[4]" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Selection Glow Effect */}
                    {selectedStyle === style.id && (
                        <div className="absolute inset-0 bg-purple-500/10 animate-pulse pointer-events-none" />
                    )}
                </button>
            ))}
        </div>
    );
}

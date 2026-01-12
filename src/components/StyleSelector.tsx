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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STYLES.map((style) => (
                <button
                    key={style.id}
                    onClick={() => onSelect(style.id)}
                    className={cn(
                        "relative aspect-[4/5] rounded-[1.5rem] flex flex-col justify-end transition-all duration-500 overflow-hidden group border-2",
                        selectedStyle === style.id
                            ? "border-purple-600 scale-[1.02] shadow-xl shadow-purple-100"
                            : "border-transparent hover:border-purple-200 hover:scale-[1.02] hover:shadow-lg shadow-sm"
                    )}
                >
                    {/* Background Image */}
                    <img
                        src={style.image}
                        alt={style.label}
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out",
                            selectedStyle === style.id ? "scale-110" : "group-hover:scale-110"
                        )}
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300" />

                    {/* Style Label with Frosted Glass Effect */}
                    <div className="relative z-10 w-full p-3 pt-6">
                        <div className={cn(
                            "bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2.5 transition-all duration-300",
                            selectedStyle === style.id ? "bg-white/20" : "group-hover:bg-white/20"
                        )}>
                            <p className={cn(
                                "text-xs font-black uppercase tracking-widest text-white text-center",
                            )}>
                                {t(style.labelKey)}
                            </p>
                        </div>
                    </div>

                    {/* Selected Indicator Badge */}
                    <AnimatePresence>
                        {selectedStyle === style.id && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5, y: -10 }}
                                className="absolute top-3 right-3 z-20 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white"
                            >
                                <Check className="w-4 h-4 stroke-[3]" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Selection Pulse Effect */}
                    {selectedStyle === style.id && (
                        <motion.div
                            layoutId="pulse"
                            className="absolute inset-0 border-4 border-purple-500/30 rounded-[1.5rem] z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}

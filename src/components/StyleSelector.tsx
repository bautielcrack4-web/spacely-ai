"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { STYLES } from "@/lib/constants";

interface StyleSelectorProps {
    selectedStyle: string;
    onSelect: (style: string) => void;
    mode?: string;
}

export function StyleSelector({ selectedStyle, onSelect, mode = 'interior' }: StyleSelectorProps) {
    const { t } = useLanguage();

    const filteredStyles = STYLES.filter(s => {
        if (mode === 'exterior') return s.category === 'exterior' || s.category === 'all';
        if (mode === 'interior') return s.category === 'interior' || s.category === 'all';
        return true; // For other modes or "magic", show all or default
    });

    return (
        <div className="grid grid-cols-2 gap-4 pb-4">
            {filteredStyles.map((style) => (
                <button
                    key={style.id}
                    onClick={() => onSelect(style.id)}
                    className={cn(
                        "relative aspect-[4/5] rounded-[2.5rem] flex flex-col justify-end transition-all duration-500 overflow-hidden group border shadow-sm",
                        selectedStyle === style.id
                            ? "border-black shadow-lg ring-4 ring-gray-900/5 bg-gray-50"
                            : "border-gray-100/50 hover:border-gray-200 hover:shadow-md"
                    )}
                >
                    {/* Background Image */}
                    <img
                        src={style.image}
                        alt={style.label}
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out",
                            selectedStyle === style.id ? "scale-105" : "group-hover:scale-105"
                        )}
                    />

                    {/* Gradient Overlay */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500",
                        selectedStyle === style.id ? "opacity-90" : "opacity-40 group-hover:opacity-60"
                    )} />

                    {/* Style Label */}
                    <div className="relative z-10 w-full p-4">
                        <div className={cn(
                            "backdrop-blur-md border rounded-2xl p-3 transition-all duration-500",
                            selectedStyle === style.id
                                ? "bg-white/10 border-white/30"
                                : "bg-black/20 border-white/10 group-hover:bg-black/30"
                        )}>
                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white text-center leading-none">
                                {t(style.labelKey)}
                            </p>
                        </div>
                    </div>

                    {/* Selection Indicator */}
                    <AnimatePresence>
                        {selectedStyle === style.id && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="absolute top-3 right-3 z-20 w-8 h-8 bg-white rounded-full flex items-center justify-center text-black shadow-xl"
                            >
                                <Check className="w-4 h-4 stroke-[3]" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            ))}
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STYLES.map((style) => (
                <button
                    key={style.id}
                    onClick={() => onSelect(style.id)}
                    className={cn(
                        "relative h-20 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 overflow-hidden group",
                        selectedStyle === style.id
                            ? "ring-2 ring-purple-600 scale-[1.02] shadow-lg shadow-purple-200/50"
                            : "hover:scale-[1.02] hover:shadow-md border border-gray-100"
                    )}
                >
                    {/* Background Image */}
                    <img
                        src={style.image}
                        alt={style.label}
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover transition-all duration-500",
                            selectedStyle === style.id ? "scale-110 blur-[1px] opacity-40" : "opacity-20 group-hover:opacity-40 group-hover:scale-110"
                        )}
                    />

                    {/* Overlay for readability */}
                    <div className={cn(
                        "absolute inset-0 bg-white/20 transition-opacity",
                        selectedStyle === style.id ? "opacity-0" : "opacity-100"
                    )} />

                    <span className={cn(
                        "z-10 relative text-gray-900 group-hover:scale-105 transition-transform",
                    )}>{t(style.labelKey)}</span>

                    {/* Selected Indicator */}
                    {selectedStyle === style.id && (
                        <div className="absolute top-2 right-2 z-10 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white">
                            <Check className="w-3 h-3" />
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}

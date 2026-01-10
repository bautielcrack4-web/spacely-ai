"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const STYLES = [
    { id: "Modern Minimalist", label: "Minimalist", color: "bg-gray-100" },
    { id: "Industrial", label: "Industrial", color: "bg-stone-200" },
    { id: "Bohemian", label: "Bohemian", color: "bg-amber-100" },
    { id: "Scandinavian", label: "Scandi", color: "bg-neutral-100" },
    { id: "Cyberpunk", label: "Cyberpunk", color: "bg-purple-900 text-white" },
    { id: "Tropical", label: "Tropical", color: "bg-emerald-100" },
    { id: "Japanese Zen", label: "Zen", color: "bg-orange-50" },
    { id: "Mid-Century Modern", label: "Mid-Century", color: "bg-yellow-100" },
];

interface StyleSelectorProps {
    selectedStyle: string;
    onSelect: (style: string) => void;
}

export function StyleSelector({ selectedStyle, onSelect }: StyleSelectorProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STYLES.map((style) => (
                <button
                    key={style.id}
                    onClick={() => onSelect(style.id)}
                    className={cn(
                        "relative h-20 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 overflow-hidden group",
                        style.color,
                        selectedStyle === style.id
                            ? "ring-2 ring-purple-600 scale-[1.02] shadow-lg shadow-purple-200/50"
                            : "hover:scale-[1.02] hover:shadow-md border border-transparent"
                    )}
                >
                    <span className={cn(
                        "z-10 relative",
                        style.id === "Cyberpunk" ? "text-white" : "text-gray-900"
                    )}>{style.label}</span>

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

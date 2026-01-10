"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function StyleSelector() {
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

    const styles = [
        { name: "Modern Minimalist", emoji: "🏢", color: "from-slate-500 to-slate-700" },
        { name: "Scandinavian", emoji: "❄️", color: "from-blue-400 to-cyan-500" },
        { name: "Industrial", emoji: "🏭", color: "from-zinc-600 to-zinc-800" },
        { name: "Mid-Century Modern", emoji: "🪑", color: "from-orange-500 to-amber-600" },
        { name: "Bohemian", emoji: "🌺", color: "from-purple-500 to-pink-500" },
        { name: "Coastal", emoji: "🌊", color: "from-blue-300 to-teal-400" },
        { name: "Farmhouse", emoji: "🌾", color: "from-green-600 to-emerald-700" },
        { name: "Art Deco", emoji: "💎", color: "from-yellow-500 to-amber-500" },
        { name: "Japanese Zen", emoji: "🎋", color: "from-green-700 to-teal-800" },
        { name: "Mediterranean", emoji: "🏖️", color: "from-cyan-500 to-blue-600" },
        { name: "Rustic", emoji: "🪵", color: "from-amber-700 to-orange-800" },
        { name: "Contemporary", emoji: "✨", color: "from-indigo-500 to-purple-600" },
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 w-full py-24">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4">
                    Choose Your Style
                </h2>
                <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
                    32+ design styles to transform any space
                </p>
            </div>

            {/* Horizontal Scrollable Carousel */}
            <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                    {styles.map((style) => (
                        <button
                            key={style.name}
                            onClick={() => setSelectedStyle(style.name)}
                            className={cn(
                                "flex-shrink-0 w-48 snap-center group relative",
                                "transition-all duration-300 hover:-translate-y-1"
                            )}
                        >
                            {/* Card */}
                            <div
                                className={cn(
                                    "relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all duration-300",
                                    selectedStyle === style.name
                                        ? "border-brand shadow-lg shadow-brand/30 scale-105"
                                        : "border-[#27272A] hover:border-brand/50"
                                )}
                            >
                                {/* Gradient Background */}
                                <div className={cn("absolute inset-0 bg-gradient-to-br", style.color)} />

                                {/* Emoji Icon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                                        {style.emoji}
                                    </span>
                                </div>

                                {/* Selected Checkmark */}
                                {selectedStyle === style.name && (
                                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand flex items-center justify-center">
                                        <Check className="w-4 h-4 text-black" />
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Style Name */}
                            <p className="mt-3 text-sm font-semibold text-white text-center group-hover:text-brand transition-colors">
                                {style.name}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Scroll Indicators */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none" />
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    <span className="text-brand font-semibold">Scroll</span> to explore all styles →
                </p>
            </div>
        </section>
    );
}

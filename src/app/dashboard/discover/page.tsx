"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Compass,
    Search,
    Heart,
    Share2,
    Wand2,
    Home,
    Leaf,
    Layout,
    Paintbrush,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    { id: "all", label: "All", icon: Sparkles },
    { id: "home", label: "Interior", icon: Home },
    { id: "garden", label: "Garden", icon: Leaf },
    { id: "exterior", label: "Exterior", icon: Layout },
    { id: "paint", label: "Paint", icon: Paintbrush },
];

const INSPIRATIONS = [
    // Interior - Modern & Minimalist
    {
        id: 1,
        title: "Modern Minimalist Living",
        image: "/styles/modern_minimalist_realistic_style_1769246686431.png",
        category: "home",
        style: "Modern Minimalist",
        mode: "interior"
    },
    {
        id: 2,
        title: "Scandinavian Comfort",
        image: "/styles/scandinavian.png",
        category: "home",
        style: "Scandinavian",
        mode: "interior"
    },
    {
        id: 3,
        title: "Industrial Loft",
        image: "/styles/industrial.png",
        category: "home",
        style: "Industrial",
        mode: "interior"
    },
    {
        id: 4,
        title: "Bohemian Paradise",
        image: "/styles/bohemian_realistic_style_1769246700554.png",
        category: "home",
        style: "Bohemian",
        mode: "interior"
    },
    {
        id: 5,
        title: "Mid-Century Modern",
        image: "/styles/midcentury.png",
        category: "home",
        style: "Mid-Century Modern",
        mode: "interior"
    },
    {
        id: 6,
        title: "Art Deco Luxury",
        image: "/styles/luxury_art_deco.png",
        category: "home",
        style: "Luxury Art Deco",
        mode: "interior"
    },
    {
        id: 7,
        title: "Japandi Zen",
        image: "/styles/japandi.png",
        category: "home",
        style: "Japandi",
        mode: "interior"
    },
    {
        id: 8,
        title: "Japanese Zen",
        image: "/styles/zen.png",
        category: "home",
        style: "Japanese Zen",
        mode: "interior"
    },
    {
        id: 9,
        title: "Dark Minimalist",
        image: "/styles/minimalist_dark.png",
        category: "home",
        style: "Minimalist Dark",
        mode: "interior"
    },
    {
        id: 10,
        title: "Cyberpunk Future",
        image: "/styles/cyberpunk.png",
        category: "home",
        style: "Cyberpunk",
        mode: "interior"
    },

    // Exterior - Gardens & Facades
    {
        id: 11,
        title: "Modern Garden Oasis",
        image: "/styles/modern_garden_realistic_1769246620032.png",
        category: "garden",
        style: "Contemporary Garden",
        mode: "exterior"
    },
    {
        id: 12,
        title: "Rustic Backyard",
        image: "/styles/rustic_backyard_realistic_1769246633798.png",
        category: "garden",
        style: "Rustic Farmhouse",
        mode: "exterior"
    },
    {
        id: 13,
        title: "Tropical Paradise",
        image: "/styles/tropical.png",
        category: "garden",
        style: "Tropical",
        mode: "exterior"
    },
    {
        id: 14,
        title: "Coastal Retreat",
        image: "/styles/coastal.png",
        category: "garden",
        style: "Coastal Mediterranean",
        mode: "exterior"
    },
    {
        id: 15,
        title: "Luxury Pool Area",
        image: "/styles/pool_area_style_1769241579294.png",
        category: "garden",
        style: "Pool Area",
        mode: "exterior"
    },

    // Exterior - Facades
    {
        id: 16,
        title: "Modern Facade",
        image: "/styles/modern_facade_style_1769241535216.png",
        category: "exterior",
        style: "Modern Façade",
        mode: "exterior"
    },
    {
        id: 17,
        title: "Country House",
        image: "/styles/country_house_style_1769241550054.png",
        category: "exterior",
        style: "Rustic Farmhouse",
        mode: "exterior"
    },
    {
        id: 18,
        title: "Contemporary Garden",
        image: "/styles/contemporary_garden_style_1769241565538.png",
        category: "exterior",
        style: "Contemporary Garden",
        mode: "exterior"
    },

    // Paint
    {
        id: 19,
        title: "Accent Wall Magic",
        image: "/styles/accent_wall_paint_1769241591177.png",
        category: "paint",
        style: "Accent Wall",
        mode: "paint"
    },
    {
        id: 20,
        title: "Pastel Elegance",
        image: "/styles/pastel_room_paint_1769241603911.png",
        category: "paint",
        style: "Pastel Elegance",
        mode: "paint"
    },
];

import { useRouter } from "next/navigation";

export default function DiscoverPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const router = useRouter();

    const filteredInspirations = selectedCategory === "all"
        ? INSPIRATIONS
        : INSPIRATIONS.filter(item => item.category === selectedCategory);

    const handleTryStyle = (item: typeof INSPIRATIONS[0]) => {
        const params = new URLSearchParams({
            mode: item.mode,
            style: item.style,
            template: item.image
        });
        router.push(`/dashboard/create?${params.toString()}`);
    };

    return (
        <div className="space-y-8 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Discover</h1>
                    <p className="text-gray-500 font-medium text-sm">Get inspired by stunning AI-generated designs.</p>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-[2rem] w-fit overflow-x-auto scrollbar-none">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-500 whitespace-nowrap",
                            selectedCategory === cat.id
                                ? "bg-white text-black shadow-lg"
                                : "text-gray-500 hover:text-black"
                        )}
                    >
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Gallery Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        {selectedCategory === 'all' ? 'All Designs' :
                            selectedCategory === 'home' ? 'Interior Designs' :
                                selectedCategory === 'garden' ? 'Garden & Pools' :
                                    selectedCategory === 'exterior' ? 'Facades & Exteriors' :
                                        'Paint Transformations'}
                    </h2>
                    <span className="text-gray-400 font-bold text-sm">
                        {filteredInspirations.length} designs
                    </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredInspirations.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-shadow"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                            <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col gap-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <div>
                                    <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
                                    <p className="text-xs text-white/70 font-medium mt-1">{item.style}</p>
                                </div>
                                <button
                                    onClick={() => handleTryStyle(item)}
                                    className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest w-fit shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-left active:scale-95"
                                >
                                    <Wand2 className="w-3 h-3" />
                                    Try This Style
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

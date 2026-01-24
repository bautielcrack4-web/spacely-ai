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
    Layout
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    { id: "home", label: "Home", icon: Home },
    { id: "garden", label: "Garden", icon: Leaf },
    { id: "exterior", label: "Exterior", icon: Layout },
];

const INSPIRATIONS = [
    {
        id: 1,
        title: "Kitchen Design",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800",
        category: "home",
        style: "Modern Minimalist",
        mode: "interior"
    },
    {
        id: 2,
        title: "Scandinavian Kitchen",
        image: "https://images.unsplash.com/photo-1556909212-d5b604d5c524?auto=format&fit=crop&q=80&w=800",
        category: "home",
        style: "Scandinavian",
        mode: "interior"
    },
    {
        id: 3,
        title: "Zen Living Room",
        image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800",
        category: "home",
        style: "Zen",
        mode: "interior"
    },
    {
        id: 4,
        title: "Garden Design",
        image: "https://images.unsplash.com/photo-1558904541-efd6767de63d?auto=format&fit=crop&q=80&w=800",
        category: "garden",
        style: "Tropical",
        mode: "exterior"
    },
    {
        id: 5,
        title: "Patio",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
        category: "garden",
        style: "Mediterranean",
        mode: "exterior"
    },
    {
        id: 6,
        title: "Exterior Haus",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
        category: "exterior",
        style: "Modern",
        mode: "exterior"
    }
];

import { useRouter } from "next/navigation";

export default function DiscoverPage() {
    const [selectedCategory, setSelectedCategory] = useState("home");
    const router = useRouter();

    const filteredInspirations = INSPIRATIONS.filter(item => item.category === selectedCategory);

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
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Descubrir</h1>
                    <p className="text-gray-500 font-medium text-sm">Insírate con los mejores diseños de la comunidad.</p>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-[2rem] w-fit">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-500",
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

            {/* Section Grids */}
            <div className="space-y-12">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight capitalize">
                            {selectedCategory === 'home' ? 'Kitchens & Living Rooms' : selectedCategory}
                        </h2>
                        <button className="text-gray-400 font-black text-sm uppercase tracking-widest hover:text-black transition-colors">
                            Ver todo
                        </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {filteredInspirations.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-white shadow-xl"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col gap-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
                                    <button
                                        onClick={() => handleTryStyle(item)}
                                        className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest w-fit shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-left"
                                    >
                                        <Wand2 className="w-3 h-3" />
                                        ¡Probar estilo!
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

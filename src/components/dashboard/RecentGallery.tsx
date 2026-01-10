"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Generation {
    id: string;
    image_url: string;
    prompt: string;
    created_at: string;
}

interface RecentGalleryProps {
    onSelectImage: (url: string) => void;
    refreshTrigger: number;
}

export function RecentGallery({ onSelectImage, refreshTrigger }: RecentGalleryProps) {
    const { t } = useLanguage();
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGenerations = async () => {
            try {
                const res = await fetch('/api/generations');
                if (res.ok) {
                    const data = await res.json();
                    setGenerations(data.generations || []);
                }
            } catch (error) {
                console.error("Failed to fetch gallery:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenerations();
    }, [refreshTrigger]);

    return (
        <div className="w-72 flex-shrink-0 border-l border-gray-100 pl-8 flex flex-col h-full bg-transparent">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t("gallery.dashboard.title")}</h3>
                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                    <LayoutGrid className="w-3.5 h-3.5 text-purple-600" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-surface-200">
                {loading ? (
                    <div className="space-y-6 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-video bg-gray-200/50 rounded-2xl" />
                        ))}
                    </div>
                ) : generations.length > 0 ? (
                    <div className="space-y-6">
                        {generations.map((gen) => (
                            <button
                                key={gen.id}
                                onClick={() => onSelectImage(gen.image_url)}
                                className={cn(
                                    "w-full group relative aspect-video rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-300 shadow-sm hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/10"
                                )}
                            >
                                <img
                                    src={gen.image_url}
                                    alt={gen.prompt || "Generated interior"}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                                    <span className="text-[10px] text-white font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 uppercase tracking-widest">
                                        {t("gallery.view")}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center space-y-6 h-64">
                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50/50">
                            <ImageIcon className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest max-w-[150px]">
                            {t("gallery.empty")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

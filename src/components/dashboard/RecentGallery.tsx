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
        <div className="w-72 flex-shrink-0 border-l border-[#1F1F1F] pl-6 flex flex-col h-full bg-[#0A0A0A]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-400">{t("gallery.dashboard.title")}</h3>
                <LayoutGrid className="w-4 h-4 text-gray-600" />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-surface-200">
                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-video bg-[#1F1F1F] rounded-lg" />
                        ))}
                    </div>
                ) : generations.length > 0 ? (
                    <div className="space-y-4">
                        {generations.map((gen) => (
                            <button
                                key={gen.id}
                                onClick={() => onSelectImage(gen.image_url)}
                                className={cn(
                                    "w-full group relative aspect-video rounded-lg overflow-hidden border border-[#1F1F1F] hover:border-[#B2F042] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B2F042]/50"
                                )}
                            >
                                <img
                                    src={gen.image_url}
                                    alt={gen.prompt || "Generated interior"}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-xs text-white font-medium bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                                        {t("gallery.view")}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center opacity-50 space-y-4 h-64">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#2F2F2F] flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        <p className="text-xs text-gray-500 max-w-[150px]">
                            {t("gallery.empty")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

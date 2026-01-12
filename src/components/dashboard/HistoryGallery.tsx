"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "../ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Sparkles, Trash2, Download, Search, Copy, ExternalLink, Filter } from "lucide-react";
import { VariationsModal } from "../VariationsModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Generation {
    id: string;
    image_url: string;
    prompt: string;
    created_at: string;
    style?: string; // "Magic Edit", "Furniture Placement", "Color Match", or specific style
    is_variation?: boolean;
}

export function HistoryGallery() {
    const { t } = useLanguage();
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'render' | 'furniture' | 'color' | 'magic'>('all');
    const [searchQuery, setSearchQuery] = useState("");

    // Variations Logic
    const [selectedGen, setSelectedGen] = useState<Generation | null>(null);
    const [variationsResults, setVariationsResults] = useState<any[]>([]);
    const [isVariationsLoading, setIsVariationsLoading] = useState(false);
    const [showVariationsModal, setShowVariationsModal] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    async function fetchHistory() {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data, error } = await supabase
                .from('generations')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) {
                setGenerations(data);
            }
        }
        setLoading(false);
    }

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm(t("gallery.delete_confirm"))) return;

        // Optimistic update
        setGenerations(prev => prev.filter(g => g.id !== id));
        toast.success("Design deleted");

        try {
            await fetch("/api/generations/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, image_url: imageUrl })
            });
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete permanently");
            fetchHistory(); // Revert
        }
    };

    const handleDownload = async (url: string, prompt: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = `spacely-${prompt.slice(0, 20).replace(/\s+/g, '-')}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (e) {
            console.error(e);
            window.open(url, '_blank');
        }
    };

    const handleCopyPrompt = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
        toast.success("Prompt copied to clipboard");
    };

    const handleGenerateVariations = async (gen: Generation) => {
        setIsVariationsLoading(true);
        setSelectedGen(gen);
        setShowVariationsModal(true);
        setVariationsResults([]);

        try {
            const response = await fetch("/api/variations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageUrl: gen.image_url,
                    originalPrompt: gen.prompt,
                    id: gen.id
                })
            });

            const data = await response.json();
            if (data.variations) {
                setVariationsResults(data.variations);
            }
        } catch (error) {
            console.error("Failed to generate variations", error);
        } finally {
            setIsVariationsLoading(false);
        }
    };

    // Filter Logic
    const filteredGenerations = generations.filter(gen => {
        const matchesSearch = gen.prompt?.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === 'all') return true;

        // Infer type from style or meta
        // We will improve this by ensuring DB saves correct 'style'
        const style = gen.style || "";

        if (filter === 'magic') return style === 'Magic Edit';
        if (filter === 'furniture') return style === 'Furniture Placement';
        if (filter === 'color') return style === 'Color Match';

        // Renders are everything else (Standard styles)
        if (filter === 'render') {
            return style !== 'Magic Edit' && style !== 'Furniture Placement' && style !== 'Color Match';
        }

        return true;
    });

    if (loading) {
        return (
            <div className="mt-12">
                <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="aspect-[4/3] rounded-2xl w-full" />
                    ))}
                </div>
            </div>
        );
    }

    const isHistoryEmpty = generations.length === 0;

    return (
        <section className="mt-12 pb-24">

            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {isHistoryEmpty ? (
                        <>
                            <Sparkles className="w-5 h-5 text-purple-600" />
                            {t('dashboard.community.title')}
                        </>
                    ) : (
                        <>
                            <ImageIcon className="w-5 h-5 text-purple-600" />
                            {t("gallery.dashboard.title")}
                        </>
                    )}
                </h2>

                {!isHistoryEmpty && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t("gallery.search_placeholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-purple-100 outline-none w-full sm:w-64"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto">
                            {[
                                { id: 'all', label: t('gallery.filter.all') },
                                { id: 'render', label: t('gallery.filter.render') },
                                { id: 'furniture', label: t('gallery.filter.furniture') },
                                { id: 'color', label: t('gallery.filter.color') },
                                { id: 'magic', label: t('gallery.filter.magic') },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilter(tab.id as any)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                                        filter === tab.id
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {isHistoryEmpty && (
                <p className="text-sm text-gray-500 italic">{t('dashboard.community.empty_hint')}</p>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredGenerations.map((gen) => (
                        <motion.div
                            key={gen.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group relative aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
                        >
                            <img
                                src={gen.image_url}
                                alt={gen.prompt}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between backdrop-blur-[2px]">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => handleCopyPrompt(gen.prompt)}
                                        className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                                        title="Copy Prompt"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDownload(gen.image_url, gen.prompt)}
                                        className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(gen.id, gen.image_url)}
                                        className="p-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div>
                                    <p className="text-white text-xs line-clamp-2 leading-relaxed italic mb-3 opacity-90">
                                        "{gen.prompt}"
                                    </p>

                                    {/* Only show Variations button for standard renders or variations */}
                                    {(!gen.style || !['Furniture Placement', 'Color Match', 'Magic Edit'].includes(gen.style)) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleGenerateVariations(gen);
                                            }}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                                        >
                                            <Sparkles className="w-3 h-3" />
                                            {t("gallery.view") || "Variations"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Badges */}
                            {gen.style === 'Magic Edit' && (
                                <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-pink-500 text-white text-[10px] font-bold shadow-sm">
                                    MAGIC
                                </div>
                            )}
                            {gen.style === 'Furniture Placement' && (
                                <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-blue-500 text-white text-[10px] font-bold shadow-sm">
                                    FURNITURE
                                </div>
                            )}
                            {gen.style === 'Color Match' && (
                                <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-orange-500 text-white text-[10px] font-bold shadow-sm">
                                    COLOR
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <VariationsModal
                isOpen={showVariationsModal}
                onClose={() => setShowVariationsModal(false)}
                isLoading={isVariationsLoading}
                variations={variationsResults}
            />
        </section>
    );
}

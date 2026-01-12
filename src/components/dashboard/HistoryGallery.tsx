"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "../ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { ComparisonSlider } from "../ui/comparison-slider";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Sparkles } from "lucide-react";

interface Generation {
    id: string;
    image_url: string;
    prompt: string;
    created_at: string;
    // Potentially original image too if we store it
}

export function HistoryGallery() {
    const { t } = useLanguage();
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="mt-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    {t("gallery.dashboard.title")}
                </h2>
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
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
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
            {isHistoryEmpty && (
                <p className="text-sm text-gray-500 italic">{t('dashboard.community.empty_hint')}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {generations.map((gen) => (
                        <motion.div
                            key={gen.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            layout
                            className="group relative aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
                        >
                            <img
                                src={gen.image_url}
                                alt={gen.prompt}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                <p className="text-white text-xs line-clamp-2 leading-relaxed italic">
                                    "{gen.prompt}"
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
}

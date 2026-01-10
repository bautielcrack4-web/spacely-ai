"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface Example {
    id: string;
    room_type: string;
    style_name: string;
    before_url: string;
    after_url: string;
    title: string;
    description: string;
    badge: string | null;
}

const CATEGORIES = (t: any) => [
    { id: 'all', label: t('gallery.filter.all') },
    { id: 'kitchen', label: t('gallery.filter.kitchens') },
    { id: 'bedroom', label: t('gallery.filter.bedrooms') },
    { id: 'bathroom', label: t('gallery.filter.bathrooms') },
    { id: 'living', label: t('gallery.filter.living') },
];

const FALLBACK_EXAMPLES: Example[] = [
    {
        id: '1',
        room_type: 'living',
        style_name: 'Modern Minimalist',
        before_url: '/examples/assets/sala-estar-vacia-muebles-puerta_305343-47672.avif',
        after_url: '/examples/assets/replicate-prediction-1sgrm7zxr9rmr0cvmqcstqdv04.jpeg',
        title: 'De Vacío a Minimalista Moderno',
        description: 'Una sala vacía transformada en un espacio elegante con líneas limpias y luz natural.',
        badge: 'WOW FACTOR'
    },
    {
        id: '2',
        room_type: 'kitchen',
        style_name: 'Scandinavian Wood',
        before_url: '/examples/assets/please-dont-kill-me-painting-revitalizing-old-kitchen-v0-pshezzqc7qjd1.webp',
        after_url: '/examples/assets/replicate-prediction-cfcty851k5rmr0cvmqe9q2sffr.jpeg',
        title: 'Calidez Escandinava Renovada',
        description: 'Moderniza la madera con diseño luminoso, open shelving y subway tiles.',
        badge: null
    },
    {
        id: '3',
        room_type: 'bathroom',
        style_name: 'Industrial Black',
        before_url: '/examples/assets/what-in-the-world-to-do-with-this-50s-pink-burgundy-tile-v0-3ni6qfjcclka1.webp',
        after_url: '/examples/assets/replicate-prediction-r7aescnddhrmw0cvmqmb698qmw.jpeg',
        title: 'De Rosa Retro a Industrial Negro',
        description: 'El contraste más dramático: azulejos rosa años 50 convertidos en baño industrial completamente negro.',
        badge: 'TRENDING'
    }
];

export function ExampleGallery() {
    const { t } = useLanguage();
    const [examples, setExamples] = useState<Example[]>([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchExamples() {
            setLoading(true);
            const { data, error } = await supabase
                .from('examples')
                .select('*')
                .order('priority', { ascending: false });

            if (data && data.length > 0) {
                setExamples(data);
            } else {
                setExamples(FALLBACK_EXAMPLES);
            }
            setLoading(false);
        }
        fetchExamples();
    }, []);

    const filteredExamples = filter === 'all'
        ? examples
        : examples.filter(e => e.room_type === filter);

    return (
        <section id="gallery" className="py-24 bg-[#F9FAFB]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {t("gallery.new_title")}
                    </h2>
                    <p className="text-xl text-gray-600">
                        {t("gallery.new_subtitle")}
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {CATEGORIES(t).map((cat: any) => (
                        <Button
                            key={cat.id}
                            variant={filter === cat.id ? "accent" : "outline"}
                            onClick={() => setFilter(cat.id)}
                            className={`rounded-full px-6 transition-all border-none ${filter === cat.id
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                : "bg-white text-gray-600 border-gray-200 hover:border-purple-200"
                                }`}
                        >
                            {cat.label}
                        </Button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredExamples.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={item.before_url}
                                        alt="Before"
                                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                                    />
                                    <img
                                        src={item.after_url}
                                        alt="After"
                                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    />

                                    {/* Labels */}
                                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm group-hover:hidden transition-all">
                                        {t("gallery.label.before")}
                                    </div>
                                    <div className="absolute top-4 left-4 bg-purple-600 text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm hidden group-hover:block transition-all animate-in fade-in zoom-in duration-300">
                                        {t("gallery.label.after")}
                                    </div>

                                    {item.badge && (
                                        <div className="absolute top-4 right-4">
                                            <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold border-none">
                                                {item.badge}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 h-10">
                                        {item.description}
                                    </p>
                                    <Link href="/login">
                                        <Button variant="link" className="p-0 h-auto text-purple-600 hover:text-pink-600 font-bold flex items-center gap-2 group/btn transition-colors">
                                            {t("gallery.cta_try")}
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {loading && (
                    <div className="flex justify-center mt-12">
                        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>
        </section>
    );
}

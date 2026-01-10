"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export function MultipleStyles() {
    const { t } = useLanguage();
    const beforeUrl = "/examples/assets/what-in-the-world-to-do-with-this-50s-pink-burgundy-tile-v0-3ni6qfjcclka1.webp";

    const styles = [
        {
            url: "/examples/assets/replicate-prediction-r7aescnddhrmw0cvmqmb698qmw.jpeg",
            name: "Industrial Black"
        },
        {
            url: "/examples/assets/replicate-prediction-rpjfwrgc71rmr0cvmqmbgkv0b8.jpeg",
            name: "Spa Luxury"
        },
        {
            url: "/examples/assets/replicate-prediction-zckthr70vhrmt0cvmqm87jhyec.jpeg",
            name: "Scandinavian Brass"
        }
    ];

    return (
        <section className="py-24 bg-[#F9FAFB] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {t("styles.multi.title")}
                    </h2>
                    <p className="text-xl text-gray-600">
                        {t("styles.multi.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {/* Before */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-4">
                            <img src={beforeUrl} alt="Original" className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" />
                            <div className="relative z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                                <span className="text-sm font-bold text-gray-900 uppercase tracking-widest leading-none">
                                    {t("styles.multi.before")}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Styles */}
                    {styles.map((style, idx) => (
                        <motion.div
                            key={style.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * (idx + 1) }}
                            className="group"
                        >
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 relative">
                                <img src={style.url} alt={style.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <span className="text-white font-bold text-lg">{style.name}</span>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-purple-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    {t("styles.multi.after")} {idx + 1}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/login">
                        <Button size="lg" className="h-14 px-10 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-xl shadow-lg border-none">
                            {t("styles.multi.cta")}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

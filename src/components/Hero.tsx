"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ComparisonSlider } from "@/components/ui/comparison-slider";

export function Hero() {
    const { t } = useLanguage();

    // Empty House to Furnished Example for Hero
    const beforeUrl = "/sequence/first frame.jpg";
    const afterUrl = "/sequence/last frame.png";

    return (
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-24 overflow-hidden bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-left"
                    >
                        <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-gray-900 leading-[1.05] mb-6">
                            {t("hero.new_title_1")} <br />
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {t("hero.new_title_2")}
                            </span>
                        </h1>

                        <p className="max-w-xl text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
                            {t("hero.new_subtitle")}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 mb-10">
                            {[
                                t("hero.pill.free"),
                                t("hero.pill.no_reg"),
                                t("hero.pill.one_sec")
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Link href="/login" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full h-14 px-8 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-xl shadow-lg shadow-purple-200 transition-all border-none">
                                    {t("hero.cta_main")}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <ComparisonSlider
                                original={beforeUrl}
                                modified={afterUrl}
                                className="w-full h-full"
                            />
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-100 rounded-full blur-3xl -z-10 opacity-60" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-100 rounded-full blur-3xl -z-10 opacity-60" />
                    </motion.div>
                </div>
            </div>
        </section >
    );
}

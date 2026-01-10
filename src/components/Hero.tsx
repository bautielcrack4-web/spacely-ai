"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Hero() {
    const { t } = useLanguage();
    return (
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/20 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >

                    <h1 className="text-5xl md:text-[80px] font-medium tracking-[-0.02em] mb-6 leading-[1.1]">
                        <span className="text-white">{t("hero.title").split(" ")[0]} {t("hero.title").split(" ").slice(1, -2).join(" ")}</span> <br />
                        <span className="text-gradient">{t("hero.title").split(" ").slice(-2).join(" ")}</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl mb-8" style={{ color: 'var(--text-muted)' }}>
                        {t("hero.subtitle")}
                    </p>

                    {/* Trust Signals */}
                    <div className="flex items-center justify-center gap-8 mb-12 text-sm" style={{ color: 'var(--text-muted)' }}>
                        <div className="flex items-center gap-2">
                            <span className="text-brand font-semibold">500K+</span> {t("hero.trust.users")}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                        <div className="flex items-center gap-2">
                            <span className="text-brand font-semibold">2M+</span> {t("hero.trust.rooms")}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                        <div className="flex items-center gap-1">
                            <span className="text-brand font-semibold">4.8★</span> {t("hero.trust.rating")}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button size="lg" variant="accent" className="w-full text-white px-8 py-4 hover:scale-[1.02] transition-transform duration-300">
                                {t("hero.upload")} →
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                        <Link href="#gallery" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-4 border-zinc-700 hover:border-brand/50 transition-all duration-300">
                                {t("hero.viewExamples")}
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Floating Preview (Simplified) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-border bg-surface-100 p-2 shadow-2xl"
                >
                    <div className="aspect-video rounded-xl bg-neutral-900 overflow-hidden flex items-center justify-center border border-border">
                        <div className="flex flex-col items-center gap-4 p-8">
                            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <p className="text-gray-500 font-medium">{t("hero.rendering")}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

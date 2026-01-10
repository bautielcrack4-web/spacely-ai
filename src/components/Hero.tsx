"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/20 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-100 border border-brand/20 text-brand text-xs font-medium mb-6">
                        <Sparkles className="w-3 h-3" />
                        <span>Nueva Versión 2.0 disponible</span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6">
                        <span className="text-white">Upscale Your</span> <br />
                        <span className="text-gradient">Interior Design</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10">
                        Transforma cualquier habitación en segundos. Sube la foto de tu casa o jardín y deja que nuestra IA cree el diseño de tus sueños.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="#design-tool" className="w-full sm:w-auto">
                            <Button size="lg" variant="accent" className="w-full text-black">
                                Generate Now
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                            View Examples
                        </Button>
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
                            <p className="text-gray-500 font-medium">Renderizando tu futuro hogar...</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

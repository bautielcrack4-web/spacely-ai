"use client";

import { useScroll, useTransform, useMotionValueEvent, motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useImageSequence } from "@/lib/useImageSequence";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";

export function RoomTransformScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Scroll progress 0 -> 1
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Load Sequence: 30 frames from public/sequence/frames/ezgif-frame-XXX.jpg
    const { loaded, progress, getImageAt } = useImageSequence({
        totalFrames: 30, // We have 30 frames
        basePath: "/sequence/frames",
        fileNamePattern: (i) => `ezgif-frame-${(i + 1).toString().padStart(3, '0')}.jpg`
    });

    // High-Res Final Image for crisp finish
    const [finalImage, setFinalImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = "/sequence/last frame.png";
        img.onload = () => setFinalImage(img);
    }, []);

    // Draw to Canvas on Scroll
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx || !loaded) return;

        // Scaling logic to cover screen
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);

        // Calculate aspect ratio specifically for drawing
        const drawImageCover = (img: HTMLImageElement) => {
            const canvasRatio = window.innerWidth / window.innerHeight;
            const imgRatio = img.width / img.height;
            let renderWidth, renderHeight, offsetX, offsetY;

            if (canvasRatio > imgRatio) {
                renderWidth = window.innerWidth;
                renderHeight = window.innerWidth / imgRatio;
                offsetX = 0;
                offsetY = (window.innerHeight - renderHeight) / 2;
            } else {
                renderWidth = window.innerHeight * imgRatio;
                renderHeight = window.innerHeight;
                offsetX = (window.innerWidth - renderWidth) / 2;
                offsetY = 0;
            }
            ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
        };

        // If we are at the very end (> 0.98), use the High-Res Image if available
        if (latest > 0.98 && finalImage) {
            drawImageCover(finalImage);
        } else {
            // Otherwise use the sequence frame
            const frame = getImageAt(latest);
            if (frame) {
                drawImageCover(frame);
            }
        }

        // Optional: Vignette overlay for depth
        const gradient = ctx.createRadialGradient(
            window.innerWidth / 2, window.innerHeight / 2, window.innerHeight * 0.3,
            window.innerWidth / 2, window.innerHeight / 2, window.innerHeight * 0.8
        );
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(1, "rgba(0,0,0,0.2)"); // 20% dark edges
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    });

    // Text Opacities based on Scroll
    const opacityTitle = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const opacityStep1 = useTransform(scrollYProgress, [0.15, 0.25, 0.35], [0, 1, 0]); // Upload
    const opacityStep2 = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1, 0]);    // AI Processing
    const opacityStep3 = useTransform(scrollYProgress, [0.65, 0.75, 0.85], [0, 1, 0]); // Multiple Styles
    const opacityFinal = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);          // CTA

    // Add a blur filter during the "processing" phase (mid-scroll)
    const blurAmount = useTransform(scrollYProgress, [0.3, 0.5, 0.7], ["0px", "8px", "0px"]);

    // Scale effect for the text to give it momentum
    const scaleText = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0.9, 1.1, 0.9]);

    if (!loaded && typeof window !== "undefined") {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FAFBFC]">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Loading Experience... {progress}%</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="h-[400vh] relative bg-[#FAFBFC]">
            <canvas ref={canvasRef} className="sticky top-0 h-screen w-full object-cover" />

            {/* Sticky Overlay Container for Texts */}
            <div className="fixed top-0 left-0 w-full h-screen pointer-events-none flex flex-col items-center justify-center z-10">

                {/* 0% Start */}
                <motion.div style={{ opacity: opacityTitle }} className="absolute text-center max-w-4xl px-4">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-gray-800 tracking-wide uppercase">New Features 2.0</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500">
                        Tu Espacio.<br />Reimaginado.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 font-light max-w-xl mx-auto">
                        Scroll to transform your reality
                    </p>
                    <div className="mt-12 animate-bounce text-gray-400">
                        <ArrowRight className="w-6 h-6 rotate-90 mx-auto" />
                    </div>
                </motion.div>

                {/* 25% Step 1 */}
                <motion.div style={{ opacity: opacityStep1, x: "-10%" }} className="absolute left-[10%] max-w-md">
                    <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-100">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">1. Sube una foto</h2>
                        <p className="text-lg text-gray-600">
                            Simplemente toma una foto de tu habitación actual. No necesitas limpiar.
                        </p>
                    </div>
                </motion.div>

                {/* 50% Step 2 - Processing */}
                <motion.div style={{ opacity: opacityStep2, scale: scaleText, filter: `blur(${blurAmount})` }} className="absolute text-center">
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 rounded-full" />
                        <h2 className="relative text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight">
                            La IA analiza<br />cada píxel
                        </h2>
                    </div>
                </motion.div>

                {/* 75% Step 3 */}
                <motion.div style={{ opacity: opacityStep3, x: "10%" }} className="absolute right-[10%] max-w-md text-right">
                    <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-100">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">30+ Estilos</h2>
                        <p className="text-lg text-gray-600">
                            Desde Minimalista hasta Industrial. Visualiza cualquier estética en segundos.
                        </p>
                    </div>
                </motion.div>

                {/* 95% Final CTA */}
                <motion.div style={{ opacity: opacityFinal }} className="absolute text-center pointer-events-auto">
                    <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 tracking-tighter">
                        Tu Nuevo Hogar<br />Te Espera.
                    </h2>
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 py-4 bg-gray-900 text-white text-xl font-medium rounded-full overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative flex items-center gap-3">
                                Start Transforming <ArrowRight className="w-5 h-5" />
                            </span>
                        </motion.button>
                    </Link>
                </motion.div>
            </div>

            {/* Skip Button (Bottom Right) */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                onClick={() => window.scrollTo({ top: window.innerHeight * 3.5, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 z-50 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors bg-white/50 backdrop-blur px-4 py-2 rounded-full pointer-events-auto"
            >
                Skip Animation
            </motion.button>

        </div>
    );
}

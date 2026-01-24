"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Wand2, ArrowLeft, ArrowRight, Download, X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { usePaywall } from "@/contexts/PaywallContext";

interface MagicEditToolProps {
    onBack?: () => void;
}

export function MagicEditTool({ onBack }: MagicEditToolProps) {
    const { isPro, loading: proLoading } = useSubscriptionStatus();
    const { openPaywall } = usePaywall();

    const [file, setFile] = useState<File | null>(null);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [showTransition, setShowTransition] = useState(false);
    const [newImage, setNewImage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            setFile(selected);
            const url = URL.createObjectURL(selected);
            setCurrentImage(url);
            setHistory([url]);
            setHistoryIndex(0);
            e.target.value = "";
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selected = e.dataTransfer.files[0];
            setFile(selected);
            const url = URL.createObjectURL(selected);
            setCurrentImage(url);
            setHistory([url]);
            setHistoryIndex(0);
        }
    };

    // Convert image to base64
    const imageToBase64 = async (imageUrl: string): Promise<string> => {
        if (imageUrl.startsWith('data:')) return imageUrl;

        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    };

    // Handle magic edit generation
    const handleGenerate = async () => {
        if (!currentImage || !prompt.trim()) {
            toast.error("Please upload an image and describe your change");
            return;
        }

        setLoading(true);

        try {
            const base64 = await imageToBase64(currentImage);

            const res = await fetch("/api/edit/magic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: base64,
                    prompt: `${prompt}. Photorealistic, 8k, high-end interior design, maintain lighting and perspective.`
                }),
            });

            if (res.status === 403 || res.status === 429) {
                openPaywall();
                setLoading(false);
                return;
            }

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.details || error.error || "Generation failed");
            }

            const data = await res.json();

            if (data.result) {
                setNewImage(data.result);
                setShowTransition(true);

                // After animation, update state
                setTimeout(() => {
                    const newHistory = [...history.slice(0, historyIndex + 1), data.result];
                    setHistory(newHistory);
                    setHistoryIndex(newHistory.length - 1);
                    setCurrentImage(data.result);
                    setShowTransition(false);
                    setNewImage(null);
                    setPrompt("");
                    toast.success("Transformation complete!");
                }, 2500);
            }

        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to generate";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // History navigation
    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setCurrentImage(history[newIndex]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setCurrentImage(history[newIndex]);
        }
    };

    const handleClear = () => {
        setFile(null);
        setCurrentImage(null);
        setHistory([]);
        setHistoryIndex(-1);
        setPrompt("");
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Premium Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900" />
            <div className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onBack || (() => window.location.href = '/dashboard')}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold">Back</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <Wand2 className="w-6 h-6 text-purple-400" />
                        <h1 className="text-2xl font-black text-white">Magic Edit</h1>
                    </div>
                    <div className="w-20" /> {/* Spacer */}
                </div>

                {/* Main Content */}
                <div className="flex flex-col items-center gap-8">
                    {/* Image Canvas */}
                    <div
                        className="relative w-full max-w-3xl aspect-[4/3] rounded-[2rem] overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {currentImage ? (
                            <>
                                {/* Current Image */}
                                <motion.img
                                    key={currentImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    src={currentImage}
                                    alt="Current"
                                    className="w-full h-full object-contain"
                                />

                                {/* Transition Animation */}
                                <AnimatePresence>
                                    {showTransition && newImage && (
                                        <motion.div
                                            initial={{ clipPath: 'inset(0 100% 0 0)' }}
                                            animate={{ clipPath: 'inset(0 0% 0 0)' }}
                                            exit={{ opacity: 0 }}
                                            transition={{
                                                duration: 2,
                                                ease: [0.22, 1, 0.36, 1]
                                            }}
                                            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent"
                                        >
                                            <motion.img
                                                initial={{ filter: 'blur(20px)' }}
                                                animate={{ filter: 'blur(0px)' }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                                src={newImage}
                                                alt="New"
                                                className="w-full h-full object-contain"
                                            />

                                            {/* Magic Sparkle Effect */}
                                            <motion.div
                                                initial={{ left: '0%' }}
                                                animate={{ left: '100%' }}
                                                transition={{ duration: 2, ease: 'linear' }}
                                                className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white to-transparent shadow-[0_0_30px_10px_rgba(255,255,255,0.5)]"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Loading Overlay */}
                                <AnimatePresence>
                                    {loading && !showTransition && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-4"
                                        >
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
                                                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-purple-400" />
                                            </div>
                                            <p className="text-white/80 font-bold animate-pulse">Transforming your space...</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* History Navigation */}
                                {history.length > 1 && !loading && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-4 py-2">
                                        <button
                                            onClick={handleUndo}
                                            disabled={historyIndex <= 0}
                                            className={cn(
                                                "p-2 rounded-full transition-all",
                                                historyIndex <= 0 ? "opacity-30" : "hover:bg-white/10 text-white"
                                            )}
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </button>
                                        <span className="text-white/60 text-xs font-bold">{historyIndex + 1} / {history.length}</span>
                                        <button
                                            onClick={handleRedo}
                                            disabled={historyIndex >= history.length - 1}
                                            className={cn(
                                                "p-2 rounded-full transition-all",
                                                historyIndex >= history.length - 1 ? "opacity-30" : "hover:bg-white/10 text-white"
                                            )}
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Watermark for Free Users */}
                                {!isPro && !proLoading && historyIndex > 0 && (
                                    <div className="absolute bottom-4 right-4 z-50">
                                        <div className="bg-black/70 backdrop-blur-md text-white/90 text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg border border-white/20 select-none">
                                            RoomCraft.app
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={handleClear}
                                        className="p-3 rounded-xl bg-black/40 backdrop-blur-md text-white/60 hover:text-white hover:bg-black/60 transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    {historyIndex > 0 && (
                                        <button
                                            onClick={() => {
                                                const a = document.createElement('a');
                                                a.href = currentImage;
                                                a.download = 'magic-edit-result.png';
                                                a.click();
                                            }}
                                            className="p-3 rounded-xl bg-black/40 backdrop-blur-md text-white/60 hover:text-white hover:bg-black/60 transition-all"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Upload Placeholder */
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-full flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-colors group"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8 text-white/40 group-hover:text-purple-400 transition-colors" />
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-bold text-lg">Drop your image here</p>
                                    <p className="text-white/40 text-sm">or click to browse</p>
                                </div>
                            </button>
                        )}
                    </div>

                    {/* Prompt Input */}
                    {currentImage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-3xl"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerate()}
                                    placeholder="Describe the change you want... (e.g., 'Add plants', 'Change sofa to blue', 'Make it modern')"
                                    className="w-full h-16 pl-6 pr-40 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-medium"
                                    disabled={loading}
                                />
                                <Button
                                    onClick={handleGenerate}
                                    disabled={loading || !prompt.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold shadow-lg shadow-purple-500/30 border-none transition-all"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Transform
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-2 mt-4 justify-center">
                                {["Add plants", "Modern style", "Change lighting", "Blue walls", "Wooden floor", "Minimalist"].map((action) => (
                                    <button
                                        key={action}
                                        onClick={() => setPrompt(action)}
                                        className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-semibold transition-all border border-white/10 hover:border-white/20"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

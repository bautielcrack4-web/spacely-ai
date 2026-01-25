"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Wand2, Sparkles, ImageIcon, Download, X, History, Zap, MessageSquare, Lock, Loader2, Settings, Camera, Maximize2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StyleSelector } from "./StyleSelector";
import { cn } from "@/lib/utils";
import { ComparisonSlider } from "./ui/comparison-slider";
import { useLanguage } from "@/contexts/LanguageContext";
import { PremiumLoader } from "./ui/PremiumLoader";
import { PremiumLockOverlay } from "./ui/PremiumLockOverlay";

interface DesignToolProps {
    onGenerate: (image: File | null, prompt: string, style: string, currentPreview?: string, mode?: string) => Promise<void>;
    onClear?: () => void;
    loading: boolean;
    generatedImage: string | null;
    isLocked?: boolean;
    mode?: string;
    initialState?: {
        preview: string | null;
        prompt: string;
        style: string;
    } | null;
}

import { TEMPLATES } from "@/lib/constants";
import { usePaywall } from "@/contexts/PaywallContext";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

export function DesignTool({ onGenerate, onClear, loading, generatedImage, isLocked = false, mode = "interior", initialState }: DesignToolProps) {
    const { t } = useLanguage();
    const { openPaywall } = usePaywall();
    const { isPro } = useSubscriptionStatus();
    const [file, setFile] = useState<File | null>(null);
    // ... existing state ...
    const [preview, setPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("");
    const [style, setStyle] = useState("Modern Minimalist");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isDirectMode = mode === 'magic' || mode === 'paint';

    useEffect(() => {
        if (initialState) {
            setPreview(initialState.preview);
            setPrompt(initialState.prompt);
            setStyle(initialState.style);
            setCurrentStep(4); // Jump to summary if coming from a template/preset

            if (initialState.preview) {
                setHistory([initialState.preview]);
                setHistoryIndex(0);
            }
        }
    }, [initialState]);

    // Handle history initialization when a preview is first set (e.g. upload)
    useEffect(() => {
        if (preview && history.length === 0) {
            setHistory([preview]);
            setHistoryIndex(0);
        }
    }, [preview, history.length]);

    // Handle new generated images for iteration
    useEffect(() => {
        if (generatedImage && !isLocked) {
            // Update history and local preview
            const newHistory = [...history.slice(0, historyIndex + 1), generatedImage];
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
            setPreview(generatedImage);

            // If in direct mode, immediately move back to Step 3 for quick iteration
            if (isDirectMode) {
                // Short delay to let the user see the result if they want, or just jump
                setTimeout(() => {
                    setCurrentStep(3);
                    setPrompt(""); // Clear prompt for next iteration
                }, 100);
            }
        }
    }, [generatedImage, isLocked]);

    const handleUndo = () => {
        if (historyIndex > 0) {
            const nextIndex = historyIndex - 1;
            setHistoryIndex(nextIndex);
            setPreview(history[nextIndex]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            setHistoryIndex(nextIndex);
            setPreview(history[nextIndex]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            // Reset input so the same file selection triggers again
            e.target.value = "";
        }
    };
    // ... other handlers ...
    const handleTemplateSelect = (imageUrl: string) => {
        setFile(null); // Clear manual file
        setPreview(imageUrl);
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selected = e.dataTransfer.files[0];
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };
    const handleClearLocal = () => {
        setFile(null);
        setPreview(null);
        setPrompt("");
        setHistory([]);
        setHistoryIndex(-1);
        onClear?.();
    };


    const renderControlContent = () => (
        <div className="flex flex-col gap-8 relative">
            {/* Close Button */}
            <button
                onClick={() => window.location.href = '/dashboard'}
                className="absolute -top-12 right-0 p-2 text-gray-400 hover:text-black transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Step Indicator - Only show if NOT in direct mode */}
            {!isDirectMode && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">
                        <span>{t('dashboard.form.step')} {currentStep} / 4</span>
                        <span className="text-purple-600">
                            {currentStep === 1 && "Image"}
                            {currentStep === 2 && "Style"}
                            {currentStep === 3 && "Details"}
                            {currentStep === 4 && "Generate"}
                        </span>
                    </div>
                    <div className="flex gap-2 h-1.5 px-1">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={cn(
                                    "flex-1 rounded-full transition-all duration-500",
                                    s <= currentStep ? "bg-purple-600 shadow-sm shadow-purple-200" : "bg-gray-100"
                                )}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Header for Direct Mode */}
            {isDirectMode && (
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className={cn("p-2.5 rounded-xl text-white", mode === 'paint' ? "bg-pink-500" : "bg-purple-600")}>
                        {mode === 'paint' ? <Sparkles className="w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                    </div>
                    <div>
                        <h2 className="font-black text-gray-900 text-xl tracking-tight leading-none">
                            {mode === 'paint' ? "Instant Paint" : "Magic Edit"}
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                            {mode === 'paint' ? "Change colors in an eye blink" : "Modify your space with AI"}
                        </p>
                    </div>
                </div>
            )}

            {/* STEP 1: UPLOAD */}
            {currentStep === 1 && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div className="space-y-2 px-1">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Add a photo</h3>
                        <p className="text-gray-500 text-xs font-medium">Start by uploading or taking a room photo.</p>
                    </div>

                    <div
                        className="relative group cursor-pointer apple-card p-1 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                handleFileChange(e);
                                if (e.target.files?.[0]) {
                                    if (isDirectMode) {
                                        // In direct mode, we stay in the same view (conceptually step 1+2 combined)
                                        // or move to a "ready" state, but we don't need step 2 (styles).
                                        // Let's toggle to "step 3" directly which is Prompt/Edit for us.
                                        setCurrentStep(3);
                                    } else {
                                        setCurrentStep(2);
                                    }
                                }
                            }}
                        />

                        <div className={cn(
                            "aspect-[4/3] rounded-[2.3rem] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500",
                            preview ? "border-purple-200 bg-purple-50/10" : "border-gray-100 bg-gray-50/50 hover:bg-gray-50/80"
                        )}>
                            {preview ? (
                                <div className="relative w-full h-full rounded-[2.3rem] overflow-hidden group/img">
                                    <img src={preview} alt="Upload" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-500">
                                        <div className="bg-white/95 backdrop-blur-md px-8 py-3.5 rounded-2xl flex items-center gap-3 shadow-xl text-gray-900 font-bold text-sm">
                                            <Upload className="w-4 h-4 text-purple-600" />
                                            {t('dashboard.upload.change')}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8 relative z-10">
                                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30 flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">
                                        Drop to start with <span className="text-purple-600">RoomCraft.app</span>
                                    </h3>
                                    <p className="text-sm text-gray-500 max-w-[220px] mx-auto leading-relaxed font-medium">
                                        Transform your space instantly with AI.
                                    </p>

                                    {/* Decorative Elements */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Source Selector (Buttons) */}
                    {!preview && (
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-[1.8rem] hover:bg-gray-50 transition-all group"
                            >
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none mb-1">Gallery</p>
                                    <p className="text-[10px] font-bold text-gray-400">Select from your reel</p>
                                </div>
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()} // Camera fallback for now
                                className="w-full flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-[1.8rem] hover:bg-gray-50 transition-all group"
                            >
                                <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Maximize2 className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none mb-1">Take Photo</p>
                                    <p className="text-[10px] font-bold text-gray-400">Use your camera</p>
                                </div>
                            </button>
                        </div>
                    )}

                    {!preview && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-1">
                                <label className="text-xs font-black text-gray-900 uppercase tracking-widest">{t('dashboard.templates.or_start')}</label>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                                {TEMPLATES.filter(tmpl => tmpl.category === mode || tmpl.category === 'all').map((tmpl) => (
                                    <button
                                        key={tmpl.id}
                                        onClick={() => {
                                            handleTemplateSelect(tmpl.image);
                                            setCurrentStep(2);
                                        }}
                                        className={cn(
                                            "flex-shrink-0 w-24 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-500 relative group snap-start",
                                            preview === tmpl.image ? "border-purple-600 scale-[1.05]" : "border-gray-50"
                                        )}
                                    >
                                        <img src={tmpl.image} alt={t(tmpl.labelKey)} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {preview && (
                        <Button
                            onClick={() => setCurrentStep(isDirectMode ? 3 : 2)}
                            className="w-full h-16 rounded-[1.8rem] bg-black text-white font-black uppercase tracking-widest"
                        >
                            Continue
                        </Button>
                    )}
                </motion.div>
            )
            }

            {/* STEP 2: STYLE SELECTION */}
            {
                currentStep === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2 px-1">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Choose style</h3>
                            <p className="text-gray-500 text-xs font-medium">What vibe do you want for your room?</p>
                        </div>

                        <div className="max-h-[450px] overflow-y-auto pr-2 scrollbar-none">
                            <StyleSelector
                                selectedStyle={style}
                                mode={mode}
                                onSelect={(s) => {
                                    setStyle(s);
                                    // Auto-advance some delay for better feel?
                                    setTimeout(() => setCurrentStep(3), 300);
                                }}
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(1)}
                                className="flex-1 h-14 rounded-2xl text-xs font-black uppercase tracking-widest"
                            >
                                Back
                            </Button>
                        </div>
                    </motion.div>
                )
            }

            {/* STEP 3: PROMPT MAGIC */}
            {
                currentStep === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2 px-1">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Describe the change</h3>
                            <p className="text-gray-500 text-xs font-medium">Optional: you can be specific about colors or furniture.</p>
                        </div>

                        <div className="relative group">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={t('dashboard.form.prompt_placeholder')}
                                className="w-full h-40 p-6 rounded-[2.5rem] bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-purple-500/5 focus:border-purple-300 outline-none transition-all duration-500 resize-none text-gray-700 font-medium placeholder:text-gray-400"
                            />
                            <div className="absolute bottom-6 right-6 p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                                <Sparkles className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Magic Quick Actions */}
                        {mode === 'magic' && (
                            <div className="flex gap-2 flex-wrap justify-center">
                                {[
                                    "Make it modern", "Add plants", "Change floor to wood",
                                    "Blue walls", "Sunset lighting"
                                ].map((action) => (
                                    <button
                                        key={action}
                                        onClick={() => setPrompt(action)}
                                        className="px-4 py-2 rounded-full bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-600 text-xs font-bold transition-all border border-transparent hover:border-purple-200"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(isDirectMode ? 1 : 2)}
                                className="flex-1 h-16 rounded-[1.8rem] text-xs font-black uppercase tracking-widest"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={() => setCurrentStep(4)}
                                className="flex-[2] h-16 rounded-[1.8rem] bg-black text-white font-black uppercase tracking-widest"
                            >
                                {isDirectMode ? "Generate Now" : "Review Summary"}
                            </Button>
                        </div>
                    </motion.div>
                )
            }

            {/* STEP 4: GENERATE AND SUMMARY (Modified for direct mode to auto-trigger or look different) */}
            {
                currentStep === 4 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2 px-1">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Ready</h3>
                            <p className="text-gray-500 text-xs font-medium">Review your settings before transforming the space.</p>
                        </div>

                        {/* Summary Cards */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                                    <img src={preview!} alt="Original" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Imagen base</span>
                                    <span className="font-bold text-gray-700">Tu habitación</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                    <Wand2 className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estilo seleccionado</span>
                                    <span className="font-bold text-gray-700">{style}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={() => onGenerate(file, prompt, style, preview || undefined, mode)}
                                disabled={loading}
                                className={cn(
                                    "w-full h-20 rounded-[2rem] text-lg font-black tracking-widest uppercase shadow-xl transition-all duration-700 border-none relative overflow-hidden group",
                                    loading
                                        ? "bg-gray-100 text-gray-400"
                                        : "bg-black hover:bg-black/90 text-white active:scale-[0.98]"
                                )}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {t('dashboard.form.analyzing')}
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-6 h-6" />
                                            Generar Cambio
                                        </>
                                    )}
                                </span>
                            </Button>
                            <Button
                                variant="ghost"
                                disabled={loading}
                                onClick={() => setCurrentStep(3)}
                                className="h-14 font-bold text-gray-400"
                            >
                                Ajustar detalles
                            </Button>
                        </div>
                    </motion.div>
                )
            }
        </div >
    );

    return (
        <div className="flex flex-col lg:flex-row h-full min-h-screen lg:h-[calc(100vh-80px)] gap-0 lg:gap-8 p-4 md:p-6 lg:p-8 pb-32 lg:pb-8 max-w-[1700px] mx-auto overflow-y-auto lg:overflow-hidden relative">
            {/* LEFT CONTROL PANEL (Desktop Only) */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="hidden lg:flex w-[420px] shrink-0 flex-col gap-6 h-full overflow-y-auto pb-10 scrollbar-none"
            >
                {renderControlContent()}
            </motion.div>

            {/* MOBILE PERSISTENT BOTTOM SHEET */}
            <motion.div
                initial={{ y: "calc(100% - 100px)" }}
                animate={{ y: isDrawerOpen ? 0 : "calc(100% - 100px)" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                    if (info.offset.y < -50) setIsDrawerOpen(true);
                    if (info.offset.y > 50) setIsDrawerOpen(false);
                }}
                className="lg:hidden fixed inset-x-0 bottom-0 z-[80] bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col h-[85vh]"
            >
                {/* Drag Handle & Header */}
                <div
                    className="flex-shrink-0 pt-4 pb-6 px-6 bg-white rounded-t-[2.5rem] cursor-grab active:cursor-grabbing border-b border-gray-50"
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                >
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                                {currentStep === 1 ? "Start Here" : `Step ${currentStep} of 4`}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 mt-1">
                                {currentStep === 1 ? "Upload Photo" : isDrawerOpen ? "Customize Design" : "Swipe to Edit"}
                            </h3>
                        </div>
                        <div className="flex items-center gap-3">
                            {currentStep === 1 && !isDrawerOpen && (
                                <Button
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                    className="h-9 px-4 rounded-full bg-black text-white text-xs font-bold shadow-lg active:scale-95 transition-transform"
                                >
                                    <Upload className="w-3 h-3 mr-2" />
                                    Upload
                                </Button>
                            )}
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all bg-gray-100 text-gray-600",
                                isDrawerOpen ? "rotate-180 bg-gray-200" : ""
                            )}>
                                <Settings className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 pb-24 bg-white">
                    {renderControlContent()}
                </div>
            </motion.div>


            {/* RIGHT PREVIEW PANEL (Artboard) */}
            <div className="w-full lg:flex-1 h-[40vh] lg:min-h-[500px] lg:h-full bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/60 overflow-hidden relative shadow-2xl shadow-purple-500/10 group mb-4 lg:mb-0">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-purple-50/30 to-pink-50/20 z-0" />

                {/* Background Text Label (Apple Style) - REMOVED per user request */}

                {generatedImage && preview ? (
                    <div className="w-full h-full p-4 md:p-8 lg:p-12 relative z-10 group/preview">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                filter: isLocked ? 'blur(25px)' : 'blur(0px)'
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full h-full rounded-[2.5rem] overflow-hidden bg-white shadow-2xl relative"
                        >
                            {/* History Navigation Arrows */}
                            <div className="absolute top-1/2 -translate-y-1/2 inset-x-8 z-50 flex justify-between pointer-events-none opacity-0 group-hover/preview:opacity-100 transition-all duration-300">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUndo();
                                    }}
                                    disabled={historyIndex <= 0}
                                    className={cn(
                                        "w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center transition-all pointer-events-auto",
                                        historyIndex <= 0 ? "opacity-30 cursor-not-allowed" : "hover:scale-110 active:scale-95 text-purple-600"
                                    )}
                                    title="Previous version"
                                >
                                    <History className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRedo();
                                    }}
                                    disabled={historyIndex >= history.length - 1}
                                    className={cn(
                                        "w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center transition-all pointer-events-auto",
                                        historyIndex >= history.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:scale-110 active:scale-95 text-purple-600"
                                    )}
                                    title="Next version"
                                >
                                    <History className="w-5 h-5 rotate-180 flip-y" />
                                </button>
                            </div>

                            <ComparisonSlider
                                original={historyIndex > 0 ? history[historyIndex - 1] : preview}
                                modified={preview}
                                className="w-full h-full"
                                priority={true}
                            >
                                {/* Watermark for Free Users */}
                                {(!isPro || isLocked) && (
                                    <div className="absolute bottom-6 right-6 z-50 pointer-events-auto">
                                        <div className="relative group/watermark">
                                            <div className="bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-white/20 select-none shadow-2xl">
                                                RoomCraft.app
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openPaywall();
                                                }}
                                                className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover/watermark:scale-100 transition-all duration-200 cursor-pointer z-50"
                                            >
                                                <X className="w-3 h-3 stroke-[3]" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Success Reveal Badge (Appears briefly after generation) */}
                                {!loading && generatedImage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="absolute top-6 left-6 z-40 pointer-events-none"
                                    >
                                        <div className="bg-white/90 backdrop-blur-xl text-purple-900 px-4 py-2 rounded-xl shadow-2xl border border-white/50 flex items-center gap-2">
                                            <div className="bg-green-500 rounded-full p-0.5">
                                                <CheckCircle2 className="w-3 h-3 text-white" />
                                            </div>
                                            <span className="text-xs font-bold">Designed with <span className="font-black text-purple-600">RoomCraft AI</span></span>
                                        </div>
                                    </motion.div>
                                )}
                            </ComparisonSlider>
                        </motion.div>

                        {/* Teaser Overlay (Locked State) */}
                        {isLocked && <PremiumLockOverlay />}

                        {/* Download / Action Bar (Only if NOT locked) */}
                        {!isLocked && (
                            <div className="absolute top-8 right-8 flex gap-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button
                                    variant="outline"
                                    className="bg-white/90 backdrop-blur-md text-gray-600 hover:text-red-500 border-none shadow-xl rounded-2xl h-11 px-6 font-bold text-xs transition-all"
                                    onClick={handleClearLocal}
                                >
                                    {t('dashboard.preview.start_new')}
                                </Button>
                                {/* Download Button with Canvas Watermark Logic */}
                                <Button
                                    onClick={async () => {
                                        if (!isPro && !generatedImage) return;

                                        try {
                                            // Create a canvas to merge image and watermark
                                            const canvas = document.createElement('canvas');
                                            const ctx = canvas.getContext('2d');
                                            const img = new Image();

                                            // Use proxy or CORS enabled URL if needed, here assuming same-origin or CORS allowed
                                            img.crossOrigin = "anonymous";
                                            img.src = preview!;

                                            await new Promise((resolve, reject) => {
                                                img.onload = resolve;
                                                img.onerror = reject;
                                            });

                                            canvas.width = img.width;
                                            canvas.height = img.height;

                                            if (ctx) {
                                                // Draw main image
                                                ctx.drawImage(img, 0, 0);

                                                // Draw Watermark if NOT PRO
                                                if (!isPro) {
                                                    const fontSize = Math.max(20, img.width * 0.03); // Responsive font size
                                                    const padding = Math.max(20, img.width * 0.03);

                                                    ctx.font = `900 ${fontSize}px "Inter", sans-serif`;
                                                    const text = "ROOMCRAFT.APP";
                                                    const textWidth = ctx.measureText(text).width;

                                                    // Background for text
                                                    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                                                    const bgPadding = fontSize * 0.6;
                                                    ctx.roundRect(
                                                        img.width - textWidth - padding - bgPadding * 2,
                                                        img.height - fontSize - padding - bgPadding,
                                                        textWidth + bgPadding * 2,
                                                        fontSize + bgPadding,
                                                        10
                                                    );
                                                    ctx.fill();

                                                    // Text
                                                    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                                                    ctx.fillText(
                                                        text,
                                                        img.width - textWidth - padding - bgPadding,
                                                        img.height - padding - bgPadding * 0.5
                                                    );
                                                }

                                                // Trigger Download
                                                const link = document.createElement('a');
                                                link.download = `roomcraft-${Date.now()}.png`;
                                                link.href = canvas.toDataURL('image/png');
                                                link.click();
                                            }
                                        } catch (e) {
                                            console.error("Download failed:", e);
                                            // Fallback to simple download
                                            const link = document.createElement('a');
                                            link.href = preview!;
                                            link.download = 'roomcraft-design.png';
                                            link.click();
                                        }
                                    }}
                                    className="flex-1 bg-black text-white h-14 rounded-2xl font-bold hover:bg-gray-900 transition-colors"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download {isPro ? "HQ" : "Watermarked"}
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-6 relative z-10">
                        <div className="w-24 h-24 rounded-[2.5rem] apple-card flex items-center justify-center relative group">
                            <ImageIcon className="w-10 h-10 opacity-20 group-hover:opacity-40 transition-opacity" />
                            {preview && (
                                <button
                                    onClick={handleClearLocal}
                                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        <p className="font-bold text-lg text-gray-400 tracking-tight">{t('dashboard.preview.empty')}</p>
                    </div>
                )}

                {/* Loading Process Overlay */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center rounded-[32px]"
                        >
                            <PremiumLoader />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

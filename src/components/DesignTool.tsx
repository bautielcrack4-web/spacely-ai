"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Wand2, Sparkles, ImageIcon, Download, X, History, Zap, MessageSquare, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StyleSelector } from "./StyleSelector";
import { cn } from "@/lib/utils";
import { ComparisonSlider } from "./ui/comparison-slider";
import { useLanguage } from "@/contexts/LanguageContext";
import { PremiumLoader } from "./ui/PremiumLoader";
import { PremiumLockOverlay } from "./ui/PremiumLockOverlay";

interface DesignToolProps {
    onGenerate: (image: File | null, prompt: string, style: string, currentPreview?: string) => Promise<void>;
    onClear?: () => void;
    loading: boolean;
    generatedImage: string | null;
    isLocked?: boolean;
    initialState?: {
        preview: string | null;
        prompt: string;
        style: string;
    } | null;
}

import { TEMPLATES } from "@/lib/constants";
import { usePaywall } from "@/contexts/PaywallContext";

export function DesignTool({ onGenerate, onClear, loading, generatedImage, isLocked = false, initialState }: DesignToolProps) {
    const { t } = useLanguage();
    const { openPaywall } = usePaywall();
    const [file, setFile] = useState<File | null>(null);
    // ... existing state ...
    const [preview, setPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("");
    const [style, setStyle] = useState("Modern Minimalist");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialState) {
            setPreview(initialState.preview);
            setPrompt(initialState.prompt);
            setStyle(initialState.style);
        }
    }, [initialState]);

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
        onClear?.();
    };


    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6 p-4 md:p-6 overflow-hidden max-w-[1920px] mx-auto">
            {/* LEFT CONTROL PANEL */}
            <div className="w-full lg:w-[460px] flex flex-col gap-6 h-full overflow-y-auto pr-4 pb-20 lg:pb-0 scrollbar-thin scrollbar-thumb-purple-100 scrollbar-track-transparent">

                {/* Upload Section */}
                <div
                    className="relative group cursor-pointer bg-white rounded-[3rem] p-1.5 shadow-sm hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500 border border-gray-100"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    <div className={cn(
                        "aspect-[4/3] rounded-[2.8rem] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500 bg-gray-50/50",
                        preview ? "border-purple-200 bg-purple-50/20" : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"
                    )}>
                        {preview ? (
                            <div className="relative w-full h-full rounded-[2.8rem] overflow-hidden group/img">
                                <img src={preview} alt="Upload" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-300">
                                    <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-2 transform translate-y-4 group-hover/img:translate-y-0 transition-transform duration-300 shadow-xl text-gray-900 font-bold">
                                        <Upload className="w-5 h-5 text-purple-600" />
                                        {t('dashboard.upload.change')}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center mx-auto mb-6 text-purple-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.upload.click')}</h3>
                                <p className="text-sm text-gray-500 max-w-[200px] mx-auto leading-relaxed">{t('dashboard.upload.drag')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Settings Panel - Glassmorphism Ultra */}
                <div className="flex-1 bg-white/60 backdrop-blur-3xl rounded-[3rem] p-8 border border-white/50 shadow-2xl shadow-purple-500/10 flex flex-col gap-10 transition-all duration-500 hover:shadow-purple-500/20">

                    {/* Templates Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100/50">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <label className="text-sm font-black text-gray-900 uppercase tracking-[0.15em]">{t('dashboard.templates.or_start')}</label>
                            </div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
                            {TEMPLATES.map((tmpl) => (
                                <button
                                    key={tmpl.id}
                                    onClick={() => handleTemplateSelect(tmpl.image)}
                                    className={cn(
                                        "flex-shrink-0 w-32 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-500 relative group snap-start",
                                        preview === tmpl.image
                                            ? "border-purple-600 scale-[1.05] shadow-xl shadow-purple-200"
                                            : "border-gray-100 hover:border-purple-300 hover:scale-[1.02]"
                                    )}
                                >
                                    <img src={tmpl.image} alt={t(tmpl.labelKey)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-md text-[10px] text-white py-1.5 text-center font-black uppercase tracking-widest leading-none transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        {t(tmpl.labelKey)}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Style Selector */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-pink-50 text-pink-600 shadow-sm border border-pink-100/50">
                                <Wand2 className="w-5 h-5" />
                            </div>
                            <label className="text-sm font-black text-gray-900 uppercase tracking-[0.15em]">{t('dashboard.styles.choose_title')}</label>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-100 scrollbar-track-transparent">
                            <StyleSelector selectedStyle={style} onSelect={setStyle} />
                        </div>
                    </div>

                    {/* Input Prompt */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 shadow-sm border border-purple-100/50">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <label className="text-sm font-black text-gray-900 uppercase tracking-[0.15em]">{t('dashboard.form.prompt_label')}</label>
                        </div>
                        <div className="relative group">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={t('dashboard.form.prompt_placeholder')}
                                className="w-full h-36 p-5 rounded-[2rem] bg-gray-50/50 border border-gray-100 focus:ring-[12px] focus:ring-purple-500/10 focus:border-purple-400 outline-none transition-all duration-500 resize-none text-base text-gray-700 font-medium placeholder:text-gray-400 shadow-inner"
                            />
                            <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity duration-500">
                                AI Powered ✨
                            </div>
                        </div>
                    </div>

                    {/* Generate Action */}
                    <div className="mt-8">
                        <Button
                            onClick={() => (file || preview) && onGenerate(file, prompt, style, preview || undefined)}
                            disabled={(!file && !preview) || loading}
                            className={cn(
                                "w-full h-20 rounded-[2rem] text-xl font-black tracking-widest uppercase shadow-2xl transition-all duration-700 border-none relative overflow-hidden group",
                                loading
                                    ? "bg-gray-100 text-gray-400"
                                    : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] animate-gradient-x shadow-purple-200"
                            )}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        {t('dashboard.form.analyzing')}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-6 h-6 animate-pulse" />
                                        {t('dashboard.form.generate_btn')}
                                    </>
                                )}
                            </span>
                            {/* Animated Background Ray */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full duration-1000 transition-transform ease-in-out" />
                        </Button>
                    </div>
                </div>
            </div>


            {/* RIGHT PREVIEW PANEL */}
            <div className="flex-1 bg-gray-50 rounded-[32px] border border-gray-100 overflow-hidden relative shadow-inner">
                {generatedImage && preview ? (
                    <div className="w-full h-full p-4 md:p-8 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                filter: isLocked ? 'blur(25px)' : 'blur(0px)'
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full h-full rounded-[32px] overflow-hidden bg-white shadow-2xl relative"
                        >
                            <ComparisonSlider
                                original={preview}
                                modified={generatedImage}
                                className="w-full h-full"
                                priority={true}
                            />
                        </motion.div>

                        {/* Teaser Overlay (Locked State) */}
                        {isLocked && <PremiumLockOverlay />}

                        {/* Download / Action Bar (Only if NOT locked) */}
                        {!isLocked && (
                            <div className="absolute top-6 right-6 flex gap-3 z-30">
                                <Button
                                    variant="outline"
                                    className="bg-white/90 backdrop-blur text-gray-600 hover:text-red-600 border-0 shadow-lg rounded-xl h-10 px-4 font-bold text-xs"
                                    onClick={handleClearLocal}
                                >
                                    {t('dashboard.preview.start_new')}
                                </Button>
                                <Button
                                    className="bg-purple-600 text-white hover:bg-purple-700 border-0 shadow-lg rounded-xl h-10 px-4 font-bold text-xs"
                                    onClick={() => {
                                        const a = document.createElement('a');
                                        a.href = generatedImage;
                                        a.download = 'roomcraft-app-design.png';
                                        a.click();
                                    }}
                                >
                                    {t('dashboard.preview.download')}
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-6">
                        <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center relative group">
                            <ImageIcon className="w-10 h-10 opacity-20 group-hover:opacity-40 transition-opacity" />
                            {preview && (
                                <Button
                                    onClick={handleClearLocal}
                                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg"
                                >
                                    ×
                                </Button>
                            )}
                        </div>
                        <p className="font-medium text-lg text-gray-400">{t('dashboard.preview.empty')}</p>
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
        </div >
    );
}

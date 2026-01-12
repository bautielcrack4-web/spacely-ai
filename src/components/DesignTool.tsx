"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Wand2, Sparkles, ImageIcon, Download, X, History, Zap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StyleSelector } from "./StyleSelector";
import { cn } from "@/lib/utils";
import { ComparisonSlider } from "./ui/comparison-slider";
import { useLanguage } from "@/contexts/LanguageContext";
import { PremiumLoader } from "./ui/PremiumLoader";

interface DesignToolProps {
    onGenerate: (image: File | null, prompt: string, style: string, currentPreview?: string) => Promise<void>;
    onClear?: () => void;
    loading: boolean;
    generatedImage: string | null;
    initialState?: {
        preview: string | null;
        prompt: string;
        style: string;
    } | null;
}

import { TEMPLATES } from "@/lib/constants";

export function DesignTool({ onGenerate, onClear, loading, generatedImage, initialState }: DesignToolProps) {
    const { t } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
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
            <div className="w-full lg:w-[480px] flex flex-col gap-6 h-full overflow-y-auto pr-2 pb-20 lg:pb-0 scrollbar-none">

                {/* Upload Section */}
                <div
                    className="relative group cursor-pointer bg-white rounded-[32px] p-1 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
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
                        "aspect-[4/3] rounded-[28px] border-2 border-dashed flex flex-col items-center justify-center transition-all bg-gray-50",
                        preview ? "border-purple-200 bg-purple-50/10" : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/20"
                    )}>
                        {preview ? (
                            <div className="relative w-full h-full rounded-[28px] overflow-hidden group/img">
                                <img src={preview} alt="Upload" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                    <p className="text-white font-bold flex items-center gap-2">
                                        <Upload className="w-5 h-5" /> {t('dashboard.upload.change')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4 text-purple-600 group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{t('dashboard.upload.click')}</h3>
                                <p className="text-sm text-gray-500">{t('dashboard.upload.drag')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Settings Panel - Glassmorphism */}
                <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[32px] p-6 border border-gray-100 shadow-xl shadow-purple-500/5 flex flex-col gap-8 transition-all hover:shadow-purple-500/10">

                    {/* Templates Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                <ImageIcon className="w-4 h-4" />
                            </div>
                            <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('dashboard.templates.or_start')}</label>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                            {TEMPLATES.map((tmpl) => (
                                <button
                                    key={tmpl.id}
                                    onClick={() => handleTemplateSelect(tmpl.image)}
                                    className={cn(
                                        "flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all relative group",
                                        preview === tmpl.image ? "border-purple-600 ring-2 ring-purple-100" : "border-transparent hover:border-purple-300"
                                    )}
                                >
                                    <img src={tmpl.image} alt={t(tmpl.labelKey)} className="w-full h-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[8px] text-white py-0.5 text-center font-bold">
                                        {t(tmpl.labelKey)}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Style Selector */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-pink-50 text-pink-600">
                                <Wand2 className="w-4 h-4" />
                            </div>
                            <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('dashboard.styles.choose_title')}</label>
                        </div>
                        <StyleSelector selectedStyle={style} onSelect={setStyle} />
                    </div>

                    {/* Input Prompt */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('dashboard.form.prompt_label')}</label>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t('dashboard.form.prompt_placeholder')}
                            className="w-full h-32 p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all resize-none text-sm text-gray-700 font-medium placeholder:text-gray-400"
                        />
                    </div>

                    {/* Generate Action */}
                    <div className="mt-auto">
                        <Button
                            onClick={() => (file || preview) && onGenerate(file, prompt, style, preview || undefined)}
                            disabled={(!file && !preview) || loading}
                            className={cn(
                                "w-full h-16 rounded-2xl text-lg font-bold shadow-xl transition-all border-none relative overflow-hidden group",
                                loading ? "bg-gray-100 text-gray-400" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] shadow-purple-200"
                            )}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                                {loading ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {t('dashboard.form.analyzing')}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        {t('dashboard.form.generate_btn')}
                                    </>
                                )}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* RIGHT PREVIEW PANEL */}
            <div className="flex-1 bg-gray-50 rounded-[32px] border border-gray-100 overflow-hidden relative shadow-inner">
                {generatedImage && preview ? (
                    <div className="w-full h-full p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full h-full rounded-[32px] overflow-hidden bg-white shadow-2xl relative"
                        >
                            <ComparisonSlider
                                original={preview}
                                modified={generatedImage}
                                className="w-full h-full"
                                priority={true}
                            />

                            {/* Download / Action Bar */}
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
                                        a.download = 'spacely-design.png';
                                        a.click();
                                    }}
                                >
                                    {t('dashboard.preview.download')}
                                </Button>
                            </div>
                        </motion.div>
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

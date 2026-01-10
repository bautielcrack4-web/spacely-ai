"use client";

import { useState, useRef } from "react";
import { StyleSelector } from "./StyleSelector";
import { Button } from "./ui/button";
import { Upload, Sparkles, Image as ImageIcon, Zap, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComparisonSlider } from "./ui/comparison-slider";
import { motion, AnimatePresence } from "framer-motion";

interface DesignToolProps {
    onGenerate: (image: File, prompt: string, style: string) => Promise<void>;
    loading: boolean;
    generatedImage: string | null;
}

export function DesignTool({ onGenerate, loading, generatedImage }: DesignToolProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("");
    const [style, setStyle] = useState("Modern Minimalist");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selected = e.dataTransfer.files[0];
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
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
                        file ? "border-purple-200 bg-purple-50/10" : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/20"
                    )}>
                        {preview ? (
                            <div className="relative w-full h-full rounded-[28px] overflow-hidden group/img">
                                <img src={preview} alt="Upload" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                    <p className="text-white font-bold flex items-center gap-2">
                                        <Upload className="w-5 h-5" /> Change Photo
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4 text-purple-600 group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Click to Upload</h3>
                                <p className="text-sm text-gray-500">or drag and drop your photo here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Settings Panel - Glassmorphism */}
                <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col gap-8">

                    {/* Style Selector */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-pink-50 text-pink-600">
                                <Wand2 className="w-4 h-4" />
                            </div>
                            <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Choose Style</label>
                        </div>
                        <StyleSelector selectedStyle={style} onSelect={setStyle} />
                    </div>

                    {/* Prompt Input */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                Custom Prompt <span className="normal-case text-gray-400 font-normal">(Optional)</span>
                            </label>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. Add a leather sofa, make it brighter..."
                            className="w-full h-24 bg-gray-50 border-0 rounded-2xl p-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all resize-none font-medium"
                        />
                    </div>

                    {/* Generate Action */}
                    <div className="mt-auto">
                        <Button
                            onClick={() => file && onGenerate(file, prompt, style)}
                            disabled={!file || loading}
                            className={cn(
                                "w-full h-16 rounded-2xl text-lg font-bold shadow-xl transition-all border-none relative overflow-hidden group",
                                loading ? "bg-gray-100 text-gray-400" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] shadow-purple-200"
                            )}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        Designing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-6 h-6 fill-white" />
                                        Generate Design
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
                    <div className="w-full h-full p-4">
                        <div className="w-full h-full rounded-[24px] overflow-hidden bg-white shadow-2xl relative">
                            <ComparisonSlider
                                original={preview}
                                modified={generatedImage}
                                className="w-full h-full"
                            />

                            {/* Download / Action Bar */}
                            <div className="absolute top-6 right-6 flex gap-3 z-30">
                                <Button
                                    className="bg-white/90 backdrop-blur text-gray-900 hover:bg-white border-0 shadow-lg rounded-xl h-10 px-4 font-bold text-xs"
                                    onClick={() => {
                                        const a = document.createElement('a');
                                        a.href = generatedImage;
                                        a.download = 'spacely-design.png';
                                        a.click();
                                    }}
                                >
                                    Download
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-6">
                        <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 opacity-20" />
                        </div>
                        <p className="font-medium text-lg">Your masterpiece will appear here</p>
                    </div>
                )}

                {/* Loading Process Overlay */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center"
                        >
                            <div className="relative w-32 h-32 mb-8">
                                <div className="absolute inset-0 rounded-full border-4 border-purple-100 animate-pulse" />
                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" />
                                <div className="absolute inset-4 rounded-full bg-white shadow-lg flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Space...</h3>
                            <p className="text-gray-500">Applying {style} style</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

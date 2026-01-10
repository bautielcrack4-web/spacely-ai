"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Building2,
    Home,
    Leaf,
    Layout,
    Zap,
    ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface RenderControlsProps {
    onGenerate: (data: any) => void;
    loading: boolean;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    file: File | null;
    prompt: string;
    setPrompt: (val: string) => void;
}

export function RenderControls({
    onGenerate,
    loading,
    onFileChange,
    file,
    prompt,
    setPrompt
}: RenderControlsProps) {
    const { t } = useLanguage();
    const [roomType, setRoomType] = useState<"commercial" | "residential">("residential");
    const [sceneType, setSceneType] = useState<"interior" | "exterior">("interior");
    const [renderCount, setRenderCount] = useState(1);
    const [quality, setQuality] = useState<"fast" | "pro">("pro");

    return (
        <div className="w-80 flex-shrink-0 flex flex-col gap-6 h-full overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-surface-200">
            {/* Upload Section */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm shadow-purple-50/50">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t("controls.upload.title")}</h3>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase">{t("controls.upload.tips")}</span>
                </div>

                <div className="relative group cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                    />
                    <div className={cn(
                        "h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-4 transition-all duration-300",
                        file ? "border-purple-500/50 bg-purple-50/30" : "border-gray-200 bg-gray-50 group-hover:bg-purple-50/20 group-hover:border-purple-300/50"
                    )}>
                        {file ? (
                            <>
                                <p className="text-purple-600 text-sm font-bold truncate max-w-[200px]">{file.name}</p>
                                <p className="text-gray-500 text-[10px] mt-1 font-medium">{t("controls.upload.ready")}</p>
                            </>
                        ) : (
                            <>
                                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Layout className="w-5 h-5" />
                                </div>
                                <span className="text-gray-900 text-sm font-bold">{t("controls.upload.button")}</span>
                                <p className="text-[10px] text-gray-500 font-medium leading-tight mt-1">
                                    {t("controls.upload.desc")}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">{t("controls.settings.roomType")}</label>
                    <div className="grid grid-cols-2 gap-1.5 bg-gray-100/50 p-1 rounded-2xl border border-gray-100">
                        <button
                            onClick={() => setRoomType("commercial")}
                            className={cn(
                                "text-xs font-bold py-2.5 rounded-xl transition-all duration-300",
                                roomType === "commercial" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {t("controls.settings.commercial")}
                        </button>
                        <button
                            onClick={() => setRoomType("residential")}
                            className={cn(
                                "text-xs font-bold py-2.5 rounded-xl transition-all duration-300",
                                roomType === "residential" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-200" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {t("controls.settings.residential")}
                        </button>
                    </div>
                </div>

                {/* Interior/Exterior */}
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">{t("controls.settings.perspective")}</label>
                    <div className="grid grid-cols-2 gap-1.5 bg-gray-100/50 p-1 rounded-2xl border border-gray-100">
                        <button
                            onClick={() => setSceneType("interior")}
                            className={cn(
                                "text-xs font-bold py-2.5 rounded-xl transition-all duration-300",
                                sceneType === "interior" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-200" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {t("controls.settings.interior")}
                        </button>
                        <button
                            onClick={() => setSceneType("exterior")}
                            className={cn(
                                "text-xs font-bold py-2.5 rounded-xl transition-all duration-300",
                                sceneType === "exterior" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-200" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {t("controls.settings.exterior")}
                        </button>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between mb-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{t("controls.settings.aesthetic")}</label>
                    </div>

                    <div className="relative group">
                        <select
                            className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500/50 transition-all font-medium shadow-sm group-hover:bg-gray-50"
                            onChange={(e) => setPrompt(`${e.target.value}, ${prompt}`)} // Appending style for now
                        >
                            <option value="Modern Minimalist">{t("styles.modern")}</option>
                            <option value="Scandinavian">{t("styles.scandinavian")}</option>
                            <option value="Industrial">{t("styles.industrial")}</option>
                            <option value="Bohemian">{t("styles.bohemian")}</option>
                            <option value="Mid-Century Modern">{t("styles.midcentury")}</option>
                            <option value="Cyberpunk">{t("styles.cyberpunk")}</option>
                            <option value="Tropical">{t("styles.tropical")}</option>
                        </select>
                        <div className="absolute right-3 top-3 text-gray-500 pointer-events-none">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Prompt Input */}
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">{t("controls.settings.promptLabel")}</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t("controls.settings.promptPlaceholder")}
                        className="w-full h-24 bg-white border border-gray-100 rounded-2xl p-4 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500/50 transition-all resize-none shadow-sm font-medium"
                    />
                </div>

                {/* Render Button */}
                <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold h-16 rounded-2xl text-lg shadow-xl shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border-none outline-none ring-0"
                    onClick={() => onGenerate({ roomType, sceneType, quality })}
                    disabled={loading || !file}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{t("controls.btn.rendering")}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 fill-white" />
                            <span>{t("controls.btn.render")}</span>
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
}

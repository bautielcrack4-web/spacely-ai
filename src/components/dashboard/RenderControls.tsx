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
            <div className="bg-[#121212] rounded-2xl p-4 border border-[#1F1F1F]">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t("controls.upload.title")}</h3>
                    <span className="text-[10px] text-gray-500 bg-[#2F2F2F] px-1.5 py-0.5 rounded">{t("controls.upload.tips")}</span>
                </div>

                <div className="relative group cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                    />
                    <div className={cn(
                        "h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-2 transition-colors",
                        file ? "border-[#A78BFA]/50 bg-[#A78BFA]/5" : "border-[#3F3F3F] hover:border-[#A78BFA]/30"
                    )}>
                        {file ? (
                            <>
                                <p className="text-[#A78BFA] text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                                <p className="text-gray-500 text-xs">{t("controls.upload.ready")}</p>
                            </>
                        ) : (
                            <>
                                <span className="text-[#A78BFA] text-sm font-medium mb-1">{t("controls.upload.button")}</span>
                                <p className="text-[10px] text-gray-500 leading-tight">
                                    {t("controls.upload.desc")}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {/* Room Type */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 block">{t("controls.settings.roomType")}</label>
                    <div className="grid grid-cols-2 gap-2 bg-[#0F0F0F] p-1 rounded-xl border border-[#1F1F1F]">
                        <button
                            onClick={() => setRoomType("commercial")}
                            className={cn(
                                "text-xs font-medium py-2 rounded-md transition-colors",
                                roomType === "commercial" ? "bg-[#2F2F2F] text-white" : "text-gray-500 hover:text-white"
                            )}
                        >
                            {t("controls.settings.commercial")}
                        </button>
                        <button
                            onClick={() => setRoomType("residential")}
                            className={cn(
                                "text-xs font-medium py-2 rounded-md transition-colors",
                                roomType === "residential" ? "bg-[#A78BFA] text-white shadow-lg shadow-[#A78BFA]/20" : "text-gray-500 hover:text-white"
                            )}
                        >
                            {t("controls.settings.residential")}
                        </button>
                    </div>
                </div>

                {/* Interior/Exterior */}
                <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block">{t("controls.settings.perspective")}</label>
                    <div className="grid grid-cols-2 gap-2 bg-[#0F0F0F] p-1 rounded-xl border border-[#1F1F1F]">
                        <button
                            onClick={() => setSceneType("interior")}
                            className={cn(
                                "text-xs font-bold py-2 rounded-lg transition-all duration-300",
                                sceneType === "interior" ? "bg-[#A78BFA] text-white shadow-lg shadow-[#A78BFA]/20" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {t("controls.settings.interior")}
                        </button>
                        <button
                            onClick={() => setSceneType("exterior")}
                            className={cn(
                                "text-xs font-bold py-2 rounded-lg transition-all duration-300",
                                sceneType === "exterior" ? "bg-[#A78BFA] text-white shadow-lg shadow-[#A78BFA]/20" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {t("controls.settings.exterior")}
                        </button>
                    </div>
                </div>

                {/* Style Selector */}
                <div>
                    <div className="flex justify-between mb-3">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block">Design Aesthetic</label>
                    </div>

                    <div className="relative">
                        <select
                            className="w-full bg-[#1F1F1F] border border-[#2F2F2F] rounded-lg p-3 text-sm text-white appearance-none focus:outline-none focus:border-[#A78BFA]"
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
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">{t("controls.settings.promptLabel")}</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t("controls.settings.promptPlaceholder")}
                        className="w-full h-24 bg-[#1F1F1F] border border-[#2F2F2F] rounded-lg p-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#A78BFA] resize-none"
                    />
                </div>

                {/* Render Button */}
                <Button
                    className="w-full bg-[#A78BFA] hover:bg-[#9775FA] text-white font-bold py-6 rounded-xl text-md shadow-[0_0_20px_rgba(167,139,250,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => onGenerate({ roomType, sceneType, quality })}
                    disabled={loading || !file}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{t("controls.btn.rendering")}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 fill-white" />
                            <span>{t("controls.btn.render")}</span>
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
}

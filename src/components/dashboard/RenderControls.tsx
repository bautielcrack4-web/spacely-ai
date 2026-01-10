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
    const [roomType, setRoomType] = useState<"commercial" | "residential">("residential");
    const [sceneType, setSceneType] = useState<"interior" | "exterior">("interior");
    const [renderCount, setRenderCount] = useState(1);
    const [quality, setQuality] = useState<"fast" | "pro">("pro");

    return (
        <div className="w-80 flex-shrink-0 flex flex-col gap-6 h-full overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-surface-200">
            {/* Upload Section */}
            <div className="bg-[#121212] rounded-2xl p-4 border border-[#1F1F1F]">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Upload a photo</h3>
                    <span className="text-[10px] text-gray-500 bg-[#2F2F2F] px-1.5 py-0.5 rounded">Tips 💡</span>
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
                        file ? "border-[#B2F042]/50 bg-[#B2F042]/5" : "border-[#3F3F3F] hover:border-[#B2F042]/30"
                    )}>
                        {file ? (
                            <>
                                <p className="text-[#B2F042] text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                                <p className="text-gray-500 text-xs">Ready to render</p>
                            </>
                        ) : (
                            <>
                                <span className="text-[#B2F042] text-sm font-medium mb-1">Upload a file</span>
                                <p className="text-[10px] text-gray-500 leading-tight">
                                    Click to select or drag & drop.<br />JPG, PNG up to 10MB
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
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 block">Select room type</label>
                    <div className="grid grid-cols-2 gap-2 bg-[#0F0F0F] p-1 rounded-xl border border-[#1F1F1F]">
                        <button
                            onClick={() => setRoomType("commercial")}
                            className={cn(
                                "text-xs font-medium py-2 rounded-md transition-colors",
                                roomType === "commercial" ? "bg-[#2F2F2F] text-white" : "text-gray-500 hover:text-white"
                            )}
                        >
                            Commercial
                        </button>
                        <button
                            onClick={() => setRoomType("residential")}
                            className={cn(
                                "text-xs font-medium py-2 rounded-md transition-colors",
                                roomType === "residential" ? "bg-[#B2F042] text-black" : "text-gray-500 hover:text-white"
                            )}
                        >
                            Residential
                        </button>
                    </div>
                </div>

                {/* Interior/Exterior */}
                <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block">Perspective</label>
                    <div className="grid grid-cols-2 gap-2 bg-[#0F0F0F] p-1 rounded-xl border border-[#1F1F1F]">
                        <button
                            onClick={() => setSceneType("interior")}
                            className={cn(
                                "text-xs font-bold py-2 rounded-lg transition-all duration-300",
                                sceneType === "interior" ? "bg-[#B2F042] text-black shadow-lg shadow-[#B2F042]/20" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            Interior
                        </button>
                        <button
                            onClick={() => setSceneType("exterior")}
                            className={cn(
                                "text-xs font-bold py-2 rounded-lg transition-all duration-300",
                                sceneType === "exterior" ? "bg-[#B2F042] text-black shadow-lg shadow-[#B2F042]/20" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            Exterior
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
                            className="w-full bg-[#1F1F1F] border border-[#2F2F2F] rounded-lg p-3 text-sm text-white appearance-none focus:outline-none focus:border-[#B2F042]"
                            onChange={(e) => setPrompt(`${e.target.value}, ${prompt}`)} // Appending style for now
                        >
                            <option value="Modern Minimalist">Modern Minimalist</option>
                            <option value="Scandinavian">Scandinavian</option>
                            <option value="Industrial">Industrial</option>
                            <option value="Bohemian">Bohemian</option>
                            <option value="Mid-Century Modern">Mid-Century Modern</option>
                            <option value="Cyberpunk">Cyberpunk Neon</option>
                            <option value="Tropical">Tropical Oasis</option>
                        </select>
                        <div className="absolute right-3 top-3 text-gray-500 pointer-events-none">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Prompt Input */}
                <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Additional Prompt (Optional)</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Write your prompt here..."
                        className="w-full h-24 bg-[#1F1F1F] border border-[#2F2F2F] rounded-lg p-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#B2F042] resize-none"
                    />
                </div>

                {/* Render Button */}
                <Button
                    className="w-full bg-[#B2F042] hover:bg-[#a2da3a] text-black font-bold py-6 rounded-xl text-md shadow-[0_0_20px_rgba(178,240,66,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => onGenerate({ roomType, sceneType, quality })}
                    disabled={loading || !file}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span>Rendering...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 fill-black" />
                            <span>Render Interior</span>
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Upload, ImageIcon, ArrowRight, Download, Wand2, Armchair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { PremiumLoader } from "@/components/ui/PremiumLoader";

export default function FurniturePage() {
    const { t } = useLanguage();
    const [roomImage, setRoomImage] = useState<string | null>(null);
    const [furnitureImage, setFurnitureImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("");

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'room' | 'furniture') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File is too large. Max 10MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            if (type === 'room') setRoomImage(base64);
            else setFurnitureImage(base64);
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async () => {
        if (!roomImage || !furnitureImage) {
            toast.error("Please upload both a room and a furniture image.");
            return;
        }

        setIsGenerating(true);
        setResultImage(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const response = await fetch("/api/edit/furniture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomImage,
                    furnitureImage,
                    prompt,
                    userId: user?.id
                })
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("API Error Body:", text);
                let errorMessage = response.statusText;
                try {
                    const errorJson = JSON.parse(text);
                    errorMessage = errorJson.error || errorMessage;
                } catch {
                    errorMessage = `Error ${response.status}: ${text.slice(0, 100)}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            setResultImage(data.result);
            toast.success("Furniture placed successfully!");

        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : "Failed to place furniture. Please try again.";
            toast.error(message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 mb-2">
                    <Armchair className="w-8 h-8 text-purple-600" />
                    {t("furniture.title")}
                </h1>
                <p className="text-gray-500 font-medium text-lg">
                    {t("furniture.subtitle")}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Inputs Section */}
                <div className="space-y-6">
                    {/* Room Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">1</span>
                            {t("furniture.room_label")}
                        </label>
                        <div className="relative aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden hover:border-purple-300 transition-colors group">
                            {roomImage ? (
                                <>
                                    <Image src={roomImage} alt="Room" fill className="object-cover" />
                                    <button
                                        onClick={() => setRoomImage(null)}
                                        className="absolute top-2 right-2 bg-white/80 backdrop-blur text-xs font-bold px-2 py-1 rounded-lg hover:bg-white"
                                    >
                                        Change
                                    </button>
                                </>
                            ) : (
                                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <span className="text-gray-500 font-medium">{t("furniture.upload_room")}</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'room')} />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Furniture Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">2</span>
                            {t("furniture.object_label")}
                        </label>
                        <div className="relative aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden hover:border-purple-300 transition-colors group">
                            {furnitureImage ? (
                                <>
                                    <Image src={furnitureImage} alt="Furniture" fill className="object-contain p-8" />
                                    <button
                                        onClick={() => setFurnitureImage(null)}
                                        className="absolute top-2 right-2 bg-white/80 backdrop-blur text-xs font-bold px-2 py-1 rounded-lg hover:bg-white"
                                    >
                                        Change
                                    </button>
                                </>
                            ) : (
                                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <span className="text-gray-500 font-medium">{t("furniture.upload_object")}</span>
                                    <p className="text-xs text-gray-400 mt-1">Accepts images with transparency</p>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'furniture')} />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={!roomImage || !furnitureImage || isGenerating}
                        className="w-full h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg shadow-lg hover:opacity-95 disabled:opacity-50 transition-all"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                Placing Object...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Wand2 className="w-5 h-5" />
                                {t("furniture.generate")}
                            </span>
                        )}
                    </Button>
                </div>

                {/* Result Section */}
                <div className="lg:col-span-7 h-full">
                    <div className="bg-gray-50 rounded-[2.5rem] border border-gray-100 p-6 h-full min-h-[500px] flex items-center justify-center relative overflow-hidden">
                        {resultImage ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                            >
                                <Image src={resultImage} alt="Result" fill className="object-cover" />
                                <a
                                    href={resultImage}
                                    download="spacely-furniture.png"
                                    target="_blank"
                                    className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-2 font-bold flex items-center gap-2 hover:bg-white/30 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download High Res
                                </a>
                            </motion.div>
                        ) : (
                            <div className="text-center text-gray-400">
                                {isGenerating ? (
                                    <PremiumLoader />
                                ) : (
                                    <>
                                        <Armchair className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                        <p className="font-medium">Result will appear here</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

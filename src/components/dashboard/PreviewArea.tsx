"use client";

import { Home, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface PreviewAreaProps {
    image: string | null;
    loading: boolean;
}

export function PreviewArea({ image, loading }: PreviewAreaProps) {
    return (
        <div className="flex-1 bg-[#050505] rounded-2xl border border-[#1F1F1F] flex items-center justify-center overflow-hidden relative min-h-[600px]">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            {loading ? (
                <div className="flex flex-col items-center gap-4 z-10 animate-pulse">
                    <div className="w-24 h-24 rounded-full bg-[#B2F042]/10 flex items-center justify-center">
                        <Home className="w-10 h-10 text-[#B2F042] animate-bounce" />
                    </div>
                    <p className="text-gray-400 font-medium">AI is redesigning your space...</p>
                </div>
            ) : image ? (
                <div className="relative w-full h-full p-4">
                    <img
                        src={image}
                        alt="Generated Render"
                        className="w-full h-full object-contain rounded-lg shadow-2xl"
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 z-10 text-center max-w-sm">
                    <div className="w-24 h-24 rounded-full border border-[#1F1F1F] flex items-center justify-center mb-2">
                        <div className="w-20 h-20 rounded-full bg-[#1F1F1F] flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-[#B2F042]" />
                        </div>
                    </div>
                    <h2 className="text-white text-xl font-bold">No Results Yet</h2>
                    <p className="text-gray-500 text-sm">
                        Fill in the form on the left by uploading an image and selecting a style to generate your first interior.
                    </p>
                    <div className="w-full h-full absolute inset-0 bg-[#B2F042] opacity-[0.02] blur-[100px] pointer-events-none rounded-full" />
                </div>
            )}
        </div>
    );
}

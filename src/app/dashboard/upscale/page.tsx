"use client";

import { Maximize2 } from "lucide-react";

export default function UpscalePage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 rounded-full bg-[#1F1F1F] flex items-center justify-center mb-6">
                <Maximize2 className="w-10 h-10 text-[#B2F042]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">AI Upscaler</h1>
            <p className="text-gray-400 max-w-md mb-8">
                Enhance the resolution of your generated designs up to 4K. This feature is currently in development.
            </p>
            <span className="px-4 py-2 rounded-full bg-[#B2F042]/10 text-[#B2F042] text-sm font-medium border border-[#B2F042]/20">
                Coming Soon
            </span>
        </div>
    );
}

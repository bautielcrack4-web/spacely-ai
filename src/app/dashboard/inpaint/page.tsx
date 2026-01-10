"use client";

import { Brush } from "lucide-react";

export default function InpaintPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 rounded-full bg-[#1F1F1F] flex items-center justify-center mb-6">
                <Brush className="w-10 h-10 text-[#B2F042]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Inpaint Tool</h1>
            <p className="text-gray-400 max-w-md mb-8">
                Edit specific parts of your image with our magic brush. This feature is currently in development and will be available soon.
            </p>
            <span className="px-4 py-2 rounded-full bg-[#B2F042]/10 text-[#B2F042] text-sm font-medium border border-[#B2F042]/20">
                Coming Soon
            </span>
        </div>
    );
}

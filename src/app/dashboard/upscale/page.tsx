"use client";

import { Maximize2 } from "lucide-react";

export default function UpscalePage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-transparent">
            <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center mb-8 shadow-inner">
                <Maximize2 className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">AI Upscaler</h1>
            <p className="text-gray-500 max-w-md mb-10 text-lg font-medium leading-relaxed">
                Enhance the resolution of your generated designs up to 4K. This feature is currently in development.
            </p>
            <span className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 text-sm font-bold border border-purple-200 uppercase tracking-widest shadow-sm">
                Coming Soon
            </span>
        </div>
    );
}

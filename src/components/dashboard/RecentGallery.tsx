"use client";

import { LayoutGrid } from "lucide-react";

export function RecentGallery() {
    return (
        <div className="w-72 flex-shrink-0 border-l border-[#1F1F1F] pl-6 flex flex-col h-full bg-[#0A0A0A]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-400">Renders Gallery</h3>
                <LayoutGrid className="w-4 h-4 text-gray-600" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#2F2F2F] flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-1">
                        <div className="w-2 h-2 bg-[#B2F042] rounded-full" />
                        <div className="w-2 h-2 bg-[#B2F042] rounded-full" />
                        <div className="w-2 h-2 bg-[#B2F042] rounded-full" />
                        <div className="w-2 h-2 bg-[#B2F042] rounded-full" />
                    </div>
                </div>
                <p className="text-xs text-gray-500 max-w-[150px]">
                    Here you can view all renders that you generate.
                </p>
            </div>
        </div>
    );
}

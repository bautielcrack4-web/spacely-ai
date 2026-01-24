"use client";

import { Suspense } from "react";
import { MagicEditTool } from "@/components/MagicEditTool";

export default function MagicEditPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white/60 font-bold animate-pulse">Loading Magic Edit...</div>
            </div>
        }>
            <MagicEditTool />
        </Suspense>
    );
}

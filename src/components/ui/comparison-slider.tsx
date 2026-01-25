"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonSliderProps {
    original: string;
    modified: string;
    className?: string;
    priority?: boolean;
    children?: React.ReactNode;
}

export function ComparisonSlider({ original, modified, className, priority, children }: ComparisonSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPosition(percent);
    }, []);

    const handleMouseDown = useCallback(() => setIsDragging(true), []);
    const handleMouseUp = useCallback(() => setIsDragging(false), []);
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) handleMove(e.clientX);
    }, [isDragging, handleMove]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (isDragging) handleMove(e.touches[0].clientX);
    }, [isDragging, handleMove]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchmove", handleTouchMove);
            window.addEventListener("touchend", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full h-full select-none overflow-hidden cursor-ew-resize group", className)}
            onMouseDown={(e) => {
                handleMove(e.clientX);
                setIsDragging(true);
            }}
            onTouchStart={(e) => {
                handleMove(e.touches[0].clientX);
                setIsDragging(true);
            }}
        >
            {/* Modified Image (Background/Underneath) */}
            <img
                src={modified}
                alt="After"
                loading={priority ? "eager" : "lazy"}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Original Image (Foreground/Clipped) */}
            <div
                className="absolute inset-0 w-full h-full pointer-events-none border-r-2 border-white/50"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={original}
                    alt="Before"
                    loading={priority ? "eager" : "lazy"}
                    className="absolute inset-0 w-full h-full object-contain"
                />
            </div>

            {/* Slider Handle with Branding */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize z-20 hover:bg-white transition-colors"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-full shadow-[0_0_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-[#0A0A0A] border-4 border-white">
                        <MoveHorizontal size={20} className="text-purple-600" />
                    </div>
                    {/* Brand Tag that moves with slider */}
                    <div className="bg-black/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap border border-white/20 shadow-xl pointer-events-none">
                        RoomCraft.app
                    </div>
                </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-xl text-gray-900 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-xl border border-white/50">
                Original
            </div>
            <div className="absolute bottom-6 right-6 bg-black/90 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-xl">
                Redesign
            </div>

            {children}
        </div>
    );
}

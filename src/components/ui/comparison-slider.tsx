"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonSliderProps {
    original: string;
    modified: string;
    className?: string;
}

export function ComparisonSlider({ original, modified, className }: ComparisonSliderProps) {
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
                    className="absolute inset-0 w-full h-full object-contain"
                />
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize z-20 hover:bg-white transition-colors"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-[#0A0A0A]">
                    <MoveHorizontal size={20} />
                </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Original
            </div>
            <div className="absolute bottom-4 right-4 bg-[#B2F042]/80 backdrop-blur-md text-black font-bold text-xs px-2 py-1 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                AI Redesign
            </div>
        </div>
    );
}

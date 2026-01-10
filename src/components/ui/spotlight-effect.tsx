"use client";

import { useEffect, useState } from "react";

export function SpotlightEffect() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setOpacity(1);
        };

        const handleMouseLeave = () => {
            setOpacity(0);
        };

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
            style={{ opacity }}
        >
            <div
                className="absolute w-[500px] h-[500px] bg-[#B2F042] rounded-full blur-[100px] opacity-[0.07] -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{
                    left: position.x,
                    top: position.y,
                }}
            />
        </div>
    );
}

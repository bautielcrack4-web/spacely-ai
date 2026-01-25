"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Home,
    PlusCircle,
    Compass,
    Wand2,
    User,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileSidebar() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Auto-hide dock on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show if at top or scrolling up
            if (currentScrollY < 50 || currentScrollY < lastScrollY) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Hide dock on Create/Editor pages to prevent overlap with bottom sheet controls
    const isEditor = pathname.includes('/dashboard/create') || pathname.includes('/dashboard/magic');

    const navItems = [
        { icon: Home, label: "Home", href: "/dashboard", active: pathname === "/dashboard" },
        { icon: Compass, label: "Explore", href: "/dashboard/discover", active: pathname.includes("/discover") },
        {
            icon: PlusCircle,
            label: "Create",
            href: "/dashboard/create",
            active: pathname === "/dashboard/create" && !pathname.includes("mode="),
            highlight: true
        },
        // { icon: Wand2, label: "Magic", href: "/dashboard/magic", active: pathname.includes("/magic") },
        { icon: User, label: "Profile", href: "/dashboard/profile", active: pathname.includes("/profile") },
    ];

    return (
        <div className="md:hidden">
            {/* Mobile Top Header (Minimal) - Hide on Editor too for immersion? No, keep context */}
            <div className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md z-30 flex items-center justify-center border-b border-gray-100/50">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-lg flex items-center justify-center text-white">
                        <Sparkles className="w-3 h-3 is-filled" />
                    </div>
                    <span className="font-black text-sm tracking-widest uppercase">RoomCraft</span>
                </div>
            </div>

            {/* Spacer for Top Header */}
            <div className="h-14" />

            {/* Floating Glass Dock - HIDDEN ON EDITOR */}
            <AnimatePresence>
                {isVisible && !isEditor && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed bottom-6 left-4 right-4 z-50 py-3 px-6 bg-black/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10 flex items-center justify-between"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 relative group p-2 transition-all duration-300",
                                    item.highlight ? "-mt-8" : ""
                                )}
                            >
                                {item.highlight ? (
                                    // Highlighted 'Create' Button
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 shadow-[0_4px_16px_rgba(168,85,247,0.5)] flex items-center justify-center text-white border-[4px] border-[#121212] transform active:scale-90 transition-transform">
                                        <item.icon className="w-6 h-6" strokeWidth={2.5} />
                                    </div>
                                ) : (
                                    // Standard Icon
                                    <>
                                        <div className={cn(
                                            "p-2 rounded-xl transition-all duration-300",
                                            item.active
                                                ? "bg-white/10 text-white"
                                                : "text-white/40 group-active:text-white/80"
                                        )}>
                                            <item.icon
                                                className="w-6 h-6"
                                                strokeWidth={item.active ? 2.5 : 2}
                                            />
                                        </div>
                                        {item.active && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute -bottom-2 w-1 h-1 bg-white rounded-full"
                                            />
                                        )}
                                    </>
                                )}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

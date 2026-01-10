"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar"; // Resusing the sidebar content structure if possible, but Sidebar is fixed.
// Since Sidebar has fixed positioning, we might need to duplicate the content structure slightly or refactor. 
// For speed/safety, I'll reimplement the simple nav list here or conditionally render Sidebar.
// Actually, I can wrap Sidebar in a way, but Sidebar has "fixed" class. 
// Let's create a dedicated MobileSidebar that renders a Header + An overlay menu.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutGrid, Brush, Maximize2, Image as ImageIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { icon: ImageIcon, label: "Render", href: "/dashboard", active: pathname === "/dashboard" },
        { icon: Brush, label: "Inpaint", href: "/dashboard/inpaint", active: pathname === "/dashboard/inpaint" },
        { icon: Maximize2, label: "Upscale", href: "/dashboard/upscale", active: pathname === "/dashboard/upscale" },
    ];

    return (
        <div className="md:hidden flex flex-col">
            {/* Mobile Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-[#1F1F1F] bg-[#0A0A0A] fixed top-0 w-full z-40">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 relative">
                        <Image src="/logo.png" alt="Logo" fill className="object-contain invert" />
                    </div>
                    <span className="font-bold text-white">Design Sense</span>
                </div>
                <button onClick={() => setIsOpen(true)} className="p-2 text-gray-400 hover:text-white">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Spacer for Header */}
            <div className="h-16" />

            {/* Overlay Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Sidebar Content */}
                    <div className="relative w-64 bg-[#0A0A0A] border-r border-[#1F1F1F] h-full flex flex-col p-4 animate-in slide-in-from-left duration-200">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <span className="font-bold text-white text-lg">Menu</span>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-2 flex-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                                        item.active
                                            ? "bg-[#1F1F1F] text-[#B2F042] border border-[#B2F042]/20"
                                            : "text-gray-400 hover:text-white hover:bg-[#1F1F1F]/50"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-[#1F1F1F]">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-[#1F1F1F] to-black border border-[#2F2F2F]">
                                <div className="flex items-center gap-2 mb-2 text-[#B2F042]">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Pro Plan</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-3">Get unlimited renders & higher quality.</p>
                                <Button size="sm" variant="brand" className="w-full text-black font-bold h-8 text-xs">
                                    Upgrade
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

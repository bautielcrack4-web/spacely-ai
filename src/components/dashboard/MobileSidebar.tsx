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
import { useLanguage } from "@/contexts/LanguageContext";

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { t } = useLanguage();

    const navItems = [
        { icon: ImageIcon, label: t("nav.render"), href: "/dashboard", active: pathname === "/dashboard" },
    ];

    return (
        <div className="md:hidden flex flex-col">
            {/* Mobile Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white fixed top-0 w-full z-40 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 relative">
                        <Image src="/logo-pixel.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <span className="font-bold text-gray-900 uppercase tracking-tighter">Spacely AI</span>
                </div>
                <button onClick={() => setIsOpen(true)} className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
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
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Sidebar Content */}
                    <div className="relative w-72 bg-white h-full flex flex-col p-6 shadow-2xl animate-in slide-in-from-left duration-300">
                        <div className="flex items-center justify-between mb-10">
                            <span className="font-bold text-gray-900 text-xl tracking-tight uppercase">Menu</span>
                            <button onClick={() => setIsOpen(false)} className="bg-gray-50 p-2 rounded-xl text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4 flex-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 font-semibold text-sm border border-transparent",
                                        item.active
                                            ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 border-purple-100 shadow-sm"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5",
                                        item.active ? "text-purple-600" : "text-gray-400"
                                    )} />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100/50 shadow-inner">
                                <div className="flex items-center gap-2 mb-2 text-purple-600">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">PRO MEMBER</span>
                                </div>
                                <p className="text-xs text-gray-500 font-medium mb-4 leading-relaxed">{t("nav.upgrade")}</p>
                                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold h-10 rounded-xl shadow-lg shadow-purple-200">
                                    {t("nav.upgrade")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

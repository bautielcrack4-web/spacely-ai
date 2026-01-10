"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sparkles, Crown, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/dashboard", label: "Render", icon: <Sparkles className="w-3.5 h-3.5" /> },
        { href: "#pricing", label: "Pricing" },
        { href: "#faq", label: "FAQ" },
    ];

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30"
                    : "bg-black/50"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 relative">
                            <Image src="/logo-pixel.png" alt="Spacely AI" fill className="object-contain" />
                        </div>
                        <span className="font-semibold text-white text-base">Spacely AI</span>
                    </Link>

                    {/* Center Nav Links - Desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                    pathname === link.href
                                        ? "text-white bg-brand/10"
                                        : "text-zinc-400 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Language Selector */}
                        <select className="flex items-center gap-2 px-3 py-2 rounded-md border border-zinc-800 bg-transparent text-zinc-400 text-sm hover:border-brand transition-colors cursor-pointer">
                            <option value="en">🇬🇧 EN</option>
                            <option value="es">🇪🇸 ES</option>
                            <option value="zh">🇨🇳 中文</option>
                            <option value="hi">🇮🇳 हिन्दी</option>
                            <option value="ar">🇸🇦 العربية</option>
                        </select>

                        {/* PRO Button */}
                        <Link href="/pricing">
                            <Button className="bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#9775FA] hover:to-[#7C3AED] text-white font-semibold px-5 py-2 rounded-lg shadow-lg shadow-brand/20 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand/30 transition-all duration-200 flex items-center gap-2">
                                <Crown className="w-4 h-4 fill-white" />
                                Upgrade to PRO
                            </Button>
                        </Link>

                        {/* User Avatar */}
                        <button className="w-8 h-8 rounded-full border-2 border-zinc-800 hover:border-brand transition-colors overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                U
                            </div>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-zinc-400 hover:text-white"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                                    pathname === link.href
                                        ? "text-white bg-brand/10"
                                        : "text-zinc-400 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-zinc-800">
                            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] text-white font-semibold">
                                    <Crown className="w-4 h-4 fill-white mr-2" />
                                    Upgrade to PRO
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

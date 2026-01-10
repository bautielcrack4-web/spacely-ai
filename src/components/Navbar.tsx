"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sparkles, Crown, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { language, setLanguage, t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/dashboard", label: t("nav.render"), icon: <Sparkles className="w-3.5 h-3.5" /> },
        { href: "/#pricing", label: t("nav.pricing") },
        { href: "/#faq", label: t("nav.faq") },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-xl border-b shadow-sm",
                scrolled
                    ? "border-gray-200"
                    : "border-gray-100"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 relative">
                            <Image src="/logo-pixel.png" alt="Spacely AI" fill className="object-contain" />
                        </div>
                        <span className="font-bold text-gray-900 text-lg">Spacely AI</span>
                    </Link>

                    {/* Center Nav Links - Desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                                    pathname === link.href
                                        ? "text-purple-600 bg-purple-50"
                                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                                )}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Selector */}
                        <div className="relative group">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as any)}
                                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
                            >
                                <option value="en">🇺🇸 EN</option>
                                <option value="es">🇪🇸 ES</option>
                                <option value="zh">🇨🇳 ZH</option>
                                <option value="hi">🇮🇳 HI</option>
                                <option value="ar">🇸🇦 AR</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-purple-500 transition-colors" />
                        </div>

                        {/* PRO Button */}
                        <Link href="/pricing">
                            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-purple-200 hover:scale-[1.02] transition-all duration-200 flex items-center gap-2 border-none h-11">
                                <Crown className="w-4 h-4 fill-white" />
                                {t("nav.upgrade")}
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-purple-600"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                    pathname === link.href
                                        ? "text-purple-600 bg-purple-50"
                                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                                )}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-gray-100">
                            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-6 rounded-xl border-none">
                                    <Crown className="w-4 h-4 fill-white mr-2" />
                                    {t("nav.upgrade")}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

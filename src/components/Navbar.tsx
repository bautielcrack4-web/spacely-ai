"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 relative">
                            <Image src="/spacely-logo.png" alt="Logo" fill className="object-contain invert" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Spacely <span className="text-brand">AI</span> <span className="text-[10px] text-gray-500 ml-1">v2.0</span>
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Features
                        </Link>
                        <Link href="#gallery" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Gallery
                        </Link>
                        <Link href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Pricing
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link href="/login">
                            <Button size="sm" variant="brand" className="font-bold text-black">
                                Start Now
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1F1F1F]">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            href="#features"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#1F1F1F]"
                        >
                            Features
                        </Link>
                        <Link
                            href="#gallery"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#1F1F1F]"
                        >
                            Gallery
                        </Link>
                        <Link
                            href="#pricing"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#1F1F1F]"
                        >
                            Pricing
                        </Link>
                        <div className="pt-4 flex flex-col gap-2">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start text-gray-300">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="brand" className="w-full font-bold text-black">
                                    Start Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

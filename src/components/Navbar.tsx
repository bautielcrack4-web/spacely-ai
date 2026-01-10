"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 relative">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain invert" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Design Sense <span className="text-brand">AI</span>
                        </span>
                    </div>

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

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Button size="sm" variant="brand" className="font-bold text-black">
                            Start Now
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

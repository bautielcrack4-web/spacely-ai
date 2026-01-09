"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-slate-900 rounded-sm" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Spacely <span className="text-brand">AI</span>
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
                        <Button size="sm" className="bg-accent text-slate-900 hover:bg-accent/90 font-bold">
                            Start Now
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

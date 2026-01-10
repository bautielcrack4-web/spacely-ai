"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    CreditCard,
    HelpCircle,
    Globe,
    Crown,
    Zap,
    Image as ImageIcon,
    Brush,
    Maximize2,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const navItems = [
        { icon: ImageIcon, label: "Render", href: "/dashboard", active: pathname === "/dashboard" },
        { icon: Brush, label: "Inpaint", href: "/dashboard/inpaint", active: pathname === "/dashboard/inpaint" },
        { icon: Maximize2, label: "Upscale", href: "/dashboard/upscale", active: pathname === "/dashboard/upscale" },
    ];

    return (
        <aside className="w-64 h-screen bg-[#0A0A0A] border-r border-[#1F1F1F] flex flex-col fixed left-0 top-0 z-50">
            {/* Logo */}
            <div className="p-6">
                <div className="flex items-center gap-2 text-white font-bold text-xl">
                    <div className="w-8 h-8 relative">
                        <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <span>Design Sense</span>
                </div>
            </div>

            {/* Main Nav */}
            <div className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    {
                        navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 group border border-transparent",
                                    item.active
                                        ? "bg-[#1F1F1F] text-[#B2F042] border-[#B2F042]/20"
                                        : "text-gray-400 hover:text-white hover:bg-[#1F1F1F]/50"
                                )}
                            >
                                <item.icon className="w-6 h-6 mb-2" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        ))
                    }
            </div>

            {/* Bottom Actions */}
            <div className="px-4 py-6 space-y-4 border-t border-[#1F1F1F]">
                <Button
                    className="w-full bg-[#6C25FF] hover:bg-[#5810EF] text-white font-bold py-6 rounded-xl flex items-center justify-center gap-2"
                >
                    <Crown className="w-5 h-5" fill="currentColor" />
                    Upgrade to PRO
                </Button>

                <div className="flex items-center justify-between px-2 text-gray-400">
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-white"><CreditCard className="w-5 h-5" /></Link>
                        <Link href="#" className="hover:text-white"><HelpCircle className="w-5 h-5" /></Link>
                    </div>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-white flex items-center gap-1 text-xs">
                            <Globe className="w-4 h-4" /> EN
                        </Link>
                        <button onClick={handleLogout} className="hover:text-red-500">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

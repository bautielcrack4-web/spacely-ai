"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutGrid,
    PlusCircle,
    Compass,
    User,
    Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export function MobileDock() {
    const pathname = usePathname();

    const navItems = [
        { icon: LayoutGrid, label: "Herramientas", href: "/dashboard" },
        { icon: PlusCircle, label: "Crear", href: "/dashboard/create" },
        { icon: Compass, label: "Descubrir", href: "/dashboard/discover" },
        { icon: User, label: "Perfil", href: "/dashboard/profile" },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2 pointer-events-none">
            <div className="max-w-md mx-auto bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-2xl shadow-black/10 flex items-center justify-around p-2 pointer-events-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center gap-1 p-2 flex-1 group"
                        >
                            <div className={cn(
                                "p-2 rounded-2xl transition-all duration-300",
                                isActive
                                    ? "bg-black text-white scale-110"
                                    : "text-gray-400 group-active:scale-95"
                            )}>
                                <item.icon className="w-6 h-6" />
                            </div>

                            <span className={cn(
                                "text-[10px] font-bold tracking-tight transition-colors transition-opacity duration-300",
                                isActive ? "text-black opacity-100" : "text-gray-400 opacity-60"
                            )}>
                                {item.label}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="dock-active"
                                    className="absolute -top-1 w-1 h-1 bg-black rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

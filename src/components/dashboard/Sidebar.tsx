"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import {
    LogOut,
    Settings,
    LayoutGrid,
    PlusCircle,
    Compass,
    User,
    Zap,
    Crown,
    HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePaywall } from "@/contexts/PaywallContext";
import { useSupport } from "@/contexts/SupportContext";
import { motion, AnimatePresence } from "framer-motion";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { openPaywall } = usePaywall();
    const { t, language, setLanguage } = useLanguage();
    const { isPro } = useSubscriptionStatus();
    const { openSupport } = useSupport();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const navItems = [
        { icon: LayoutGrid, label: "Herramientas", href: "/dashboard", active: pathname === "/dashboard" },
        { icon: PlusCircle, label: "Crear", href: "/dashboard/create", active: pathname === "/dashboard/create" },
        { icon: Compass, label: "Descubrir", href: "/dashboard/discover", active: pathname === "/dashboard/discover" },
        { icon: User, label: "Mi Perfil", href: "/dashboard/profile", active: pathname === "/dashboard/profile" },
    ];

    return (
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-white/70 backdrop-blur-xl border-r border-gray-100/50">
            {/* Logo Section */}
            <div className="h-20 flex items-center px-8">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 relative transition-transform duration-500 group-hover:scale-110">
                        <Image src="/logo-pixel.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 leading-none">RoomCraft</span>
                        <span className="text-[10px] font-bold text-purple-600 tracking-[0.2em] uppercase mt-1">Studio</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group text-sm font-medium",
                            item.active
                                ? "bg-white shadow-sm ring-1 ring-gray-100 text-purple-600"
                                : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5 transition-colors",
                            item.active ? "text-purple-600" : "text-gray-400 group-hover:text-gray-900"
                        )} />
                        <span>{item.label}</span>
                        {item.active && (
                            <motion.div
                                layoutId="active-pill"
                                className="ml-auto w-1 h-4 rounded-full bg-purple-600"
                            />
                        )}
                    </Link>
                ))}
            </div>

            {/* User & Settings Section */}
            <div className="p-4 space-y-4">
                {!isPro && (
                    <div className="p-4 rounded-[2rem] bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-xl shadow-purple-200/50 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Unleash Pro</h4>
                            <p className="text-[10px] text-white/80 mb-3 leading-relaxed">Unlock unlimited renders & premium styles today.</p>
                            <Button
                                onClick={openPaywall}
                                className="w-full bg-white text-purple-600 hover:bg-gray-50 font-bold h-9 rounded-xl text-[11px] shadow-sm border-none"
                            >
                                <Zap className="w-3 h-3 fill-purple-600 mr-2" />
                                Upgrade Now
                            </Button>
                        </div>
                        <Crown className="absolute -bottom-2 -right-2 w-20 h-20 text-white/10 rotate-12" />
                    </div>
                )}

                <div className="flex items-center justify-between px-2 bg-white rounded-2xl p-2 border border-gray-100 shadow-sm relative z-[60]">
                    <div className="flex gap-1">
                        <Link
                            href="/dashboard/profile"
                            className="p-2 text-gray-400 hover:text-purple-600 transition-colors rounded-xl hover:bg-purple-50 cursor-pointer"
                        >
                            <Settings className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                openSupport("Other", "Support request from Sidebar Footer");
                            }}
                            className="p-2 text-gray-400 hover:text-purple-600 transition-colors rounded-xl hover:bg-purple-50 cursor-pointer"
                        >
                            <HelpCircle className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="bg-transparent text-[10px] font-bold text-gray-400 hover:text-gray-900 border-none focus:ring-0 cursor-pointer appearance-none px-1 uppercase tracking-widest"
                        >
                            <option value="en">EN</option>
                            <option value="es">ES</option>
                        </select>
                        <div className="w-[1px] h-3 bg-gray-200" />
                        <button
                            onClick={async (e) => {
                                e.preventDefault();
                                try {
                                    await handleLogout();
                                } catch (err) {
                                    console.error("Logout failed", err);
                                    window.location.href = "/login";
                                }
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50 cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

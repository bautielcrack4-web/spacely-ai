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
import { useLanguage } from "@/contexts/LanguageContext";
import { usePaywall } from "@/contexts/PaywallContext";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { openPaywall } = usePaywall();
    const { t, language, setLanguage } = useLanguage();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const navItems = [
        { icon: ImageIcon, label: t("nav.render"), href: "/dashboard", active: pathname === "/dashboard" },
        { icon: CreditCard, label: t("nav.pricing"), href: "/#pricing", active: false },
        { icon: HelpCircle, label: t("nav.faq"), href: "/#faq", active: false },
    ];

    return (
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-white border-r border-gray-100 shadow-xl shadow-purple-50/20">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-50">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-xl uppercase tracking-tighter">
                    <div className="w-8 h-8 relative">
                        <Image src="/logo-pixel.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <span>Spacely AI</span>
                </div>
            </div>

            <div className="flex-1 px-4 py-8 space-y-4">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 group border border-transparent font-semibold text-sm",
                            item.active
                                ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 border-purple-100/50 shadow-sm"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/80"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5 transition-colors",
                            item.active ? "text-purple-600" : "text-gray-400 group-hover:text-gray-900"
                        )} />
                        <span>{item.label}</span>
                        {item.active && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                        )}
                    </Link>
                ))}
            </div>

            {/* Bottom Actions */}
            <div className="px-4 py-6 space-y-6 border-t border-gray-50">
                <Button
                    onClick={openPaywall}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
                >
                    <Crown className="w-4 h-4 fill-white" />
                    {t("nav.upgrade")}
                </Button>

                <div className="flex items-center justify-between px-2">
                    <div className="flex gap-4">
                        <Link href="#" className="text-gray-400 hover:text-purple-600 transition-colors"><CreditCard className="w-5 h-5" /></Link>
                        <Link href="#" className="text-gray-400 hover:text-purple-600 transition-colors"><HelpCircle className="w-5 h-5" /></Link>
                    </div>
                    <div className="flex gap-2 items-center">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="bg-transparent text-xs font-bold text-gray-500 hover:text-gray-900 border-none focus:ring-0 cursor-pointer appearance-none px-2"
                        >
                            <option value="en">EN</option>
                            <option value="es">ES</option>
                            <option value="zh">ZH</option>
                            <option value="hi">HI</option>
                            <option value="ar">AR</option>
                        </select>
                        <div className="w-[1px] h-4 bg-gray-100 mx-1" />
                        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 p-2 rounded-xl">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

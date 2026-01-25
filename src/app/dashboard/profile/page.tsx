"use client";

import { motion } from "framer-motion";
import {
    User,
    Settings,
    CreditCard,
    HelpCircle,
    LogOut,
    Shield,
    ChevronRight,
    Zap,
    Crown
} from "lucide-react";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSupport } from "@/contexts/SupportContext";

import { usePaywall } from "@/contexts/PaywallContext";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const { isPro } = useSubscriptionStatus();
    const { t } = useLanguage();
    const router = useRouter();
    const { openSupport } = useSupport();
    const { openPaywall } = usePaywall();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-10 pb-24">
            {/* User Header */}
            <div className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                    <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-purple-100 to-indigo-50 flex items-center justify-center border-4 border-white shadow-xl">
                        <User className="w-12 h-12 text-purple-600" />
                    </div>
                    {isPro && (
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-500 p-2.5 rounded-2xl shadow-lg border-4 border-white">
                            <Crown className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Profile</h1>
                    <p className="text-gray-500 font-medium">Manage your account and preferences.</p>
                </div>
            </div>

            {/* Subscription Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/50 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 border border-purple-100">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Current Plan</span>
                            <span className="text-lg font-bold text-gray-500">
                                {isPro ? "PRO Active" : "Free Version"}
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => window.open('https://bagasystudio.lemonsqueezy.com/billing', '_blank')}
                        className="rounded-2xl font-black text-xs uppercase tracking-widest h-11 px-6"
                    >
                        Manage
                    </Button>
                </div>

                {!isPro && (
                    <div
                        onClick={openPaywall}
                        className="p-6 rounded-[2rem] bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-between group cursor-pointer shadow-xl shadow-purple-200 active:scale-95 transition-transform"
                    >
                        <div className="space-y-1">
                            <h4 className="font-black text-sm uppercase tracking-widest">Upgrade to PRO</h4>
                            <p className="text-white/80 text-xs">Unlock unlimited renders and all styles.</p>
                        </div>
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </div>
                )}
            </div>

            {/* Menu Sections */}
            <div className="space-y-4">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-2 shadow-xl shadow-gray-200/50">
                    {[
                        { icon: Settings, label: "Account Settings", color: "text-blue-500", action: () => { } },
                        { icon: Shield, label: "Privacy & Security", color: "text-emerald-500", action: () => router.push('/legal/privacy') },
                        { icon: HelpCircle, label: "Help & Support", color: "text-amber-500", action: () => openSupport("Other", "Support request from Profile") },
                    ].map((item, idx, arr) => (
                        <button
                            key={item.label}
                            onClick={item.action}
                            className={cn(
                                "w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left",
                                idx === 0 ? "rounded-t-[2.3rem]" : "",
                                idx === arr.length - 1 ? "rounded-b-[2.3rem]" : "border-b border-gray-50"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon className={cn("w-5 h-5", item.color)} />
                                <span className="font-bold text-gray-700">{item.label}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-600 p-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-red-100 transition-colors shadow-sm active:scale-95"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

"use client";

import { Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePaywall } from "@/contexts/PaywallContext";

export function PremiumLockOverlay() {
    const { t } = useLanguage();
    const { openPaywall } = usePaywall();

    return (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-8 text-center bg-black/20 backdrop-blur-[25px] rounded-[inherit] transition-all duration-500">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl max-w-md border border-white/50 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                    <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                    {t('dashboard.teaser.title') || "Unlock Your Design"}
                </h3>
                <p className="text-gray-600 mb-8 font-medium leading-relaxed">
                    {t('dashboard.teaser.subtitle') || "This high-quality render is ready. Upgrade to PRO to view your result instantly."}
                </p>
                <Button
                    onClick={openPaywall}
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-xl shadow-purple-200 hover:scale-[1.02] transition-transform"
                >
                    <Zap className="w-5 h-5 mr-2 fill-current" />
                    {t('dashboard.teaser.button') || "Unlock Now"}
                </Button>
            </div>
        </div>
    );
}

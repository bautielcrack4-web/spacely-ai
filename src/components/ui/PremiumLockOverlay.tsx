"use client";

import { Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePaywall } from "@/contexts/PaywallContext";

export function PremiumLockOverlay() {
    const { t } = useLanguage();
    const { openPaywall } = usePaywall();

    return (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 md:p-8 text-center bg-black/20 backdrop-blur-[25px] rounded-[inherit] transition-all duration-500">
            <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-2xl max-w-md w-full border border-white/50 animate-in fade-in zoom-in duration-500">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg shadow-purple-500/30">
                    <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
                    Unlock Your Professional Design
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 font-medium leading-relaxed">
                    Your masterpiece is ready. Upgrade to PRO to view the high-quality result instantly.
                </p>
                <Button
                    onClick={openPaywall}
                    className="w-full h-12 md:h-14 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base md:text-lg shadow-xl shadow-purple-200 hover:scale-[1.02] transition-transform"
                >
                    <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2 fill-current" />
                    Unlock Design Now
                </Button>
            </div>
        </div>
    );
}

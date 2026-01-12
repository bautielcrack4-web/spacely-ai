"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Coins, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function DashboardHeader() {
    const { t } = useLanguage();
    const [credits, setCredits] = useState<number | null>(null);
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data } = await supabase
                    .from('profiles')
                    .select('credits, subscription_status')
                    .eq('id', session.user.id)
                    .single();
                if (data) {
                    setCredits(data.credits);
                    setIsPro(data.subscription_status === 'active');
                }
            }
        };
        fetchProfile();
    }, []);

    return (
        <header className="h-16 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Sparkles className="w-5 h-5" />
                </div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                    {t("nav.render")} Workspace
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {isPro ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-200">
                        <Crown className="w-4 h-4 text-white fill-white" />
                        <span className="text-sm font-bold text-white uppercase tracking-wider">
                            PRO Member
                        </span>
                    </div>
                ) : (
                    credits !== null && (
                        /* Credits exist but hidden from UI per user request */
                        <div className="hidden items-center gap-2 px-4 py-2 rounded-2xl bg-white shadow-sm border border-gray-100">
                            <div className="w-6 h-6 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
                                <Coins className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-bold text-gray-700">
                                {credits} {credits === 1 ? 'Credit' : 'Credits'}
                            </span>
                        </div>
                    )
                )}
            </div>
        </header>
    );
}

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useSubscriptionStatus() {
    const [isPro, setIsPro] = useState(false);
    const [credits, setCredits] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
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
            } catch (error) {
                console.error("Error fetching subscription status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    return { isPro, credits, loading };
}

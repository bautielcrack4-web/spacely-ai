"use client";

import { Check, X, Crown, Zap, Sparkles, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState("monthly");

    if (!isOpen) return null;

    const handleCheckout = async (plan: string) => {
        setLoading(plan);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan }),
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setLoading(null);
        }
    };

    const plans = [
        {
            id: "weekly",
            name: "Weekly",
            price: "$5.99",
            period: "/week",
            savings: null,
            popular: false,
        },
        {
            id: "monthly",
            name: "Monthly",
            price: "$14.99",
            period: "/month",
            savings: "SAVE 60%",
            popular: true,
        },
        {
            id: "yearly",
            name: "Yearly",
            price: "$119.99",
            period: "/year",
            savings: "BEST VALUE",
            popular: false,
            subtitle: "Just $9.99/month"
        },
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-md bg-gradient-to-b from-white to-gray-50/80 rounded-3xl shadow-2xl max-h-[95vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 z-10 rounded-full p-1.5 bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white transition-all shadow-sm"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto max-h-[95vh] pb-6">
                        {/* Hero Section */}
                        <div className="relative pt-12 pb-8 px-6 text-center bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white">
                            {/* Decorative Glow */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative z-10"
                            >
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                                    <Crown className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                                    <span className="text-sm font-bold uppercase tracking-wider">Go Premium</span>
                                </div>

                                <h2 className="text-3xl font-black mb-3 leading-tight">
                                    Get <span className="text-yellow-300">UNLIMITED</span><br />
                                    Designs Now 🚀
                                </h2>

                                <p className="text-white/90 text-base font-medium max-w-xs mx-auto">
                                    Join 12,000+ users creating stunning interiors without limits
                                </p>
                            </motion.div>
                        </div>

                        {/* Features - iOS Style */}
                        <div className="px-6 py-6 space-y-3">
                            {[
                                { icon: Zap, text: "UNLIMITED designs every day", highlight: "UNLIMITED" },
                                { icon: Sparkles, text: "All 32+ premium styles", highlight: "32+" },
                                { icon: Crown, text: "4K quality exports", highlight: "4K" },
                                { icon: Check, text: "No watermarks ever", highlight: "No watermarks" },
                                { icon: Users, text: "Priority support 24/7", highlight: "Priority" },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + i * 0.05 }}
                                    className="flex items-center gap-4 p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-100/50"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                        <feature.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-gray-800 font-semibold text-sm">
                                        {feature.text.split(feature.highlight)[0]}
                                        <span className="text-purple-600">{feature.highlight}</span>
                                        {feature.text.split(feature.highlight)[1]}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pricing Plans - iOS Card Style */}
                        <div className="px-6 space-y-3 mb-6">
                            <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                                Choose Your Plan
                            </p>

                            {plans.map((plan, index) => (
                                <motion.button
                                    key={plan.id}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    onClick={() => setSelectedPlan(plan.id)}
                                    className={cn(
                                        "w-full relative rounded-2xl p-4 transition-all duration-300 border-2",
                                        selectedPlan === plan.id
                                            ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg shadow-purple-200/50 scale-[1.02]"
                                            : "border-gray-200 bg-white hover:border-purple-300"
                                    )}
                                >
                                    {/* Popular Badge */}
                                    {plan.popular && (
                                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                            ⭐ Most Popular
                                        </div>
                                    )}

                                    {/* Savings Badge */}
                                    {plan.savings && (
                                        <div className="absolute -top-2.5 -right-2 bg-green-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                                            {plan.savings}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="text-left flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">
                                                    {plan.name} <span className="text-purple-600">UNLIMITED</span>
                                                </h3>
                                            </div>
                                            {plan.subtitle && (
                                                <p className="text-xs text-gray-500 font-semibold">{plan.subtitle}</p>
                                            )}
                                        </div>

                                        <div className="text-right">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-gray-900">{plan.price}</span>
                                                <span className="text-sm text-gray-500 font-medium">{plan.period}</span>
                                            </div>
                                        </div>

                                        {/* Radio Indicator */}
                                        <div className={cn(
                                            "ml-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                            selectedPlan === plan.id
                                                ? "border-purple-500 bg-purple-500"
                                                : "border-gray-300"
                                        )}>
                                            {selectedPlan === plan.id && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                            )}
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {/* CTA Button - iOS Style */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="px-6 space-y-4"
                        >
                            <Button
                                className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:opacity-90 text-white font-black text-lg py-7 rounded-2xl shadow-xl shadow-purple-300/50 transition-all active:scale-[0.98]"
                                onClick={() => handleCheckout(selectedPlan)}
                                disabled={!!loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Lock className="w-5 h-5" />
                                        START FREE TRIAL
                                    </span>
                                )}
                            </Button>

                            {/* Trust Indicators */}
                            <div className="space-y-2">
                                <p className="text-center text-xs text-gray-600 font-semibold">
                                    ✓ Cancel anytime • No commitments
                                </p>
                                <p className="text-center text-xs text-gray-500">
                                    🔒 Secure payment with Lemon Squeezy
                                </p>
                            </div>

                            {/* Money Back Guarantee - High Conversion Element */}
                            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-3 text-center">
                                <p className="text-xs font-black text-green-700 uppercase tracking-wide">
                                    💰 7-Day Money-Back Guarantee
                                </p>
                                <p className="text-[10px] text-green-600 font-medium mt-1">
                                    Not satisfied? Get a full refund, no questions asked
                                </p>
                            </div>

                            {/* Restore Purchases */}
                            <button className="w-full text-gray-400 text-xs hover:text-gray-600 transition-colors font-medium">
                                Restore Purchases
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

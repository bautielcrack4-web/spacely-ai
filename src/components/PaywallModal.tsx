"use client";

import { Check, X, Crown, Zap, Sparkles, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 z-20 rounded-full p-2 bg-black/5 hover:bg-black/10 transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>

                    {/* LEFT SIDE: Hero & Value Prop */}
                    <div className="w-full md:w-5/12 bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 text-white p-8 md:p-12 flex flex-col relative overflow-hidden">
                        {/* Abstract Background Shapes */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                            <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] rounded-full bg-purple-500 blur-[80px]" />
                            <div className="absolute bottom-[-20%] right-[-20%] w-[300px] h-[300px] rounded-full bg-pink-500 blur-[60px]" />
                        </div>

                        <div className="relative z-10 flex-1 flex flex-col justify-center">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-8 border border-white/20">
                                    <Crown className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/90">Go Premium</span>
                                </div>

                                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.1] tracking-tight">
                                    Unlock <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">UNLIMITED</span> <br />
                                    Potential
                                </h2>

                                <p className="text-lg text-purple-100 font-medium mb-10 leading-relaxed opacity-90">
                                    Join 12,000+ designers creating stunning interiors without limits.
                                </p>
                            </motion.div>

                            {/* Features List */}
                            <div className="space-y-5">
                                {[
                                    { icon: Zap, text: "Unlimited generations", sub: "Create without boundaries" },
                                    { icon: Sparkles, text: "All 32+ premium styles", sub: "Access exclusive content" },
                                    { icon: Crown, text: "4K Ultra-HD exports", sub: "Print-ready quality" },
                                    { icon: Check, text: "No watermarks", sub: "Professional branding" },
                                ].map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        className="flex items-center gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors border border-white/10">
                                            <feature.icon className="w-6 h-6 text-yellow-300" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-base">{feature.text}</p>
                                            <p className="text-sm text-purple-200">{feature.sub}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Trust Footer */}
                        <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-purple-900 relative overflow-hidden">
                                            <Image
                                                src={`/testimonials/user${i}.jpg`}
                                                alt={`Happy customer ${i}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm text-purple-100">
                                    <span className="font-bold text-white">4.9/5</span> from 2,000+ reviews
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Plans & Checkout */}
                    <div className="w-full md:w-7/12 bg-gray-50 p-6 md:p-10 flex flex-col overflow-y-auto">
                        <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose the plan that fits you</h3>

                            <div className="space-y-4 mb-8">
                                {plans.map((plan, index) => (
                                    <motion.button
                                        key={plan.id}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={cn(
                                            "w-full relative group rounded-2xl p-0.5 transition-all duration-300",
                                            selectedPlan === plan.id ? "scale-[1.02] shadow-xl shadow-purple-200" : "hover:scale-[1.01]"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute inset-0 rounded-2xl bg-gradient-to-r transition-opacity duration-300",
                                            selectedPlan === plan.id ? "from-purple-500 to-pink-500 opacity-100" : "opacity-0"
                                        )} />

                                        <div className="relative bg-white rounded-[14px] p-5 h-full flex items-center justify-between">
                                            {/* Popular Badge */}
                                            {plan.popular && (
                                                <div className="absolute -top-3 left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md z-10">
                                                    Most Popular
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                                    selectedPlan === plan.id ? "border-purple-500" : "border-gray-200"
                                                )}>
                                                    {selectedPlan === plan.id && <div className="w-3 h-3 rounded-full bg-purple-500" />}
                                                </div>
                                                <div className="text-left">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-gray-900">{plan.name}</h4>
                                                        {plan.savings && (
                                                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{plan.savings}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500">{plan.subtitle || "Cancel anytime"}</p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="font-black text-xl text-gray-900">{plan.price}</div>
                                                <div className="text-xs text-gray-400 font-medium">{plan.period}</div>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="space-y-6"
                            >
                                <Button
                                    className="w-full bg-gray-900 hover:bg-black text-white font-bold text-lg h-16 rounded-2xl shadow-lg shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                    onClick={() => handleCheckout(selectedPlan)}
                                    disabled={!!loading}
                                >
                                    {loading ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <span>Continue</span>
                                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                                <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                                            </div>
                                        </>
                                    )}
                                </Button>

                                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium pb-2">
                                    <Lock className="w-3 h-3" />
                                    Secured by Lemon Squeezy
                                </div>

                                <div className="bg-green-50 rounded-xl p-4 flex items-center justify-center gap-3 border border-green-100">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xl">💰</div>
                                    <div className="text-left">
                                        <p className="text-green-800 font-bold text-xs uppercase">100% Money-back guarantee</p>
                                        <p className="text-green-600 text-[10px] leading-tight">Try risk-free for 7 days. If you're not happy, you get a full refund.</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

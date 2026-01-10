"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
    const [loading, setLoading] = useState<string | null>(null);

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 md:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Unlock Premium Features</h2>
                    <p className="text-lg text-gray-600">
                        Continue creating stunning designs with unlimited access
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Weekly Plan */}
                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col">
                        <h3 className="text-xl font-semibold text-slate-900 mb-4">WEEKLY UNLIMITED</h3>
                        <div className="text-3xl font-bold text-slate-900 mb-1">$5.99<span className="text-base font-normal text-gray-500">/week</span></div>

                        <ul className="space-y-3 my-6 flex-1">
                            {[
                                "Unlimited designs",
                                "All 32+ styles",
                                "HD quality exports",
                                "No watermarks",
                                "Priority processing"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center text-base text-gray-700">
                                    <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button
                            className="w-full bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#9775FA] hover:to-[#7C3AED] text-white font-semibold py-6 rounded-xl"
                            onClick={() => handleCheckout('weekly')}
                            disabled={loading === 'weekly'}
                        >
                            {loading === 'weekly' ? 'Processing...' : 'START 7-DAY FREE TRIAL'}
                        </Button>
                    </div>

                    {/* Monthly Plan - Highlighted */}
                    <div className="border-2 border-brand rounded-xl p-6 shadow-xl relative bg-white flex flex-col transform md:-translate-y-4">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            ⭐ Most Popular
                        </div>

                        <h3 className="text-xl font-semibold text-slate-900 mb-4">MONTHLY UNLIMITED</h3>
                        <div className="text-3xl font-bold text-slate-900 mb-1">$14.99<span className="text-base font-normal text-gray-500">/month</span></div>
                        <div className="text-green-600 text-sm font-medium mb-4">Save 60% vs Weekly</div>

                        <ul className="space-y-3 my-6 flex-1">
                            {[
                                "Everything in Weekly",
                                "Best value",
                                "Cancel anytime"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center text-base text-gray-700">
                                    <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button
                            className="w-full bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#9775FA] hover:to-[#7C3AED] text-white font-semibold py-6 rounded-xl shadow-lg shadow-brand/30"
                            onClick={() => handleCheckout('monthly')}
                            disabled={loading === 'monthly'}
                        >
                            {loading === 'monthly' ? 'Processing...' : 'START FREE TRIAL'}
                        </Button>
                    </div>

                    {/* Yearly Plan */}
                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col">
                        <h3 className="text-xl font-semibold text-slate-900 mb-4">YEARLY UNLIMITED</h3>
                        <div className="text-3xl font-bold text-slate-900 mb-1">$119.99<span className="text-base font-normal text-gray-500">/year</span></div>
                        <div className="text-gray-500 text-sm mb-4">($9.99/mo - Save $60/year)</div>

                        <ul className="space-y-3 my-6 flex-1">
                            {[
                                "Everything in Monthly",
                                "Biggest savings",
                                "Priority support"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center text-base text-gray-700">
                                    <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button
                            className="w-full bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#9775FA] hover:to-[#7C3AED] text-white font-semibold py-6 rounded-xl"
                            onClick={() => handleCheckout('yearly')}
                            disabled={loading === 'yearly'}
                        >
                            {loading === 'yearly' ? 'Processing...' : 'START FREE TRIAL'}
                        </Button>
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 text-sm text-gray-500">
                        <span>• Cancel anytime, no commitments</span>
                        <span>• Secure payment with Lemon Squeezy</span>
                    </div>

                    <button className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
                        [Restore Purchases]
                    </button>
                </div>
            </div>
        </div>
    );
}

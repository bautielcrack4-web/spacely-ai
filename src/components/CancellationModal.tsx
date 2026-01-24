"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Heart, DollarSign, Sparkles, Bug, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CancellationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CancellationModal({ isOpen, onClose, onSuccess }: CancellationModalProps) {
    const [step, setStep] = useState(1);
    const [reason, setReason] = useState("");
    const [feedback, setFeedback] = useState("");
    const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(true);
    const [loading, setLoading] = useState(false);

    const reasons = [
        { id: "expensive", label: "Too expensive", icon: DollarSign },
        { id: "not_using", label: "Not using enough", icon: Heart },
        { id: "missing_features", label: "Missing features", icon: Sparkles },
        { id: "found_alternative", label: "Found alternative", icon: HelpCircle },
        { id: "technical_issues", label: "Technical issues", icon: Bug },
        { id: "other", label: "Other reason", icon: HelpCircle },
    ];

    const handleCancel = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/subscription/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reason,
                    feedback,
                    cancelAtPeriodEnd
                })
            });

            if (response.ok) {
                toast.success("Subscription cancelled successfully");
                onSuccess();
                onClose();
            } else {
                const error = await response.json();
                toast.error(error.error || "Failed to cancel subscription");
            }
        } catch (error) {
            console.error("Cancellation error:", error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const resetModal = () => {
        setStep(1);
        setReason("");
        setFeedback("");
        setCancelAtPeriodEnd(true);
        setLoading(false);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100 p-6 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Cancel Subscription</h2>
                                <p className="text-sm text-gray-600">Step {step} of 3</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 rounded-full hover:bg-red-100 transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
                                    <p className="text-gray-600">
                                        You'll lose access to unlimited designs, all premium features, and priority support.
                                    </p>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                    <p className="text-sm text-purple-900 font-medium">
                                        💡 <strong>Did you know?</strong> Most users generate 10+ designs per week.
                                        That's just $0.60 per design with the monthly plan!
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleClose}
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        Keep Subscription
                                    </Button>
                                    <Button
                                        onClick={() => setStep(2)}
                                        variant="outline"
                                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        Continue Cancellation
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Help us improve</h3>
                                    <p className="text-gray-600 mb-4">Why are you cancelling? (Select one)</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {reasons.map((r) => (
                                            <button
                                                key={r.id}
                                                onClick={() => setReason(r.id)}
                                                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${reason === r.id
                                                        ? "border-purple-500 bg-purple-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <r.icon className="w-4 h-4 text-gray-600" />
                                                <span className="text-sm font-semibold text-gray-900">{r.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        What could we improve? (Optional)
                                    </label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Your feedback helps us improve..."
                                        className="w-full h-24 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none resize-none text-sm"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => setStep(1)}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={() => setStep(3)}
                                        disabled={!reason}
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        Continue
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Cancellation Options</h3>
                                    <p className="text-gray-600 mb-4">Choose when to end your subscription</p>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setCancelAtPeriodEnd(true)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${cancelAtPeriodEnd
                                                    ? "border-purple-500 bg-purple-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <p className="font-bold text-gray-900 mb-1">
                                                ✅ Cancel at period end (Recommended)
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Keep access until your current billing period ends
                                            </p>
                                        </button>
                                        <button
                                            onClick={() => setCancelAtPeriodEnd(false)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${!cancelAtPeriodEnd
                                                    ? "border-purple-500 bg-purple-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <p className="font-bold text-gray-900 mb-1">Cancel immediately</p>
                                            <p className="text-sm text-gray-600">
                                                Lose access now (no refund for unused time)
                                            </p>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => setStep(2)}
                                        variant="outline"
                                        className="flex-1"
                                        disabled={loading}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Cancelling...
                                            </>
                                        ) : (
                                            "Confirm Cancellation"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

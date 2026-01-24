"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Calendar, CreditCard, Download, AlertCircle, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CancellationModal } from "@/components/CancellationModal";

interface Subscription {
    plan_name: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    cancelled_at: string | null;
    created_at: string;
}

interface Transaction {
    id: string;
    amount: number;
    currency: string;
    status: string;
    plan_name: string;
    transaction_type: string;
    receipt_url: string | null;
    created_at: string;
}

export default function SubscriptionPage() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchSubscriptionData();
    }, []);

    const fetchSubscriptionData = async () => {
        try {
            const response = await fetch('/api/subscription/status');
            const data = await response.json();

            if (response.ok) {
                setSubscription(data.subscription);
                setTransactions(data.transactions || []);
            } else {
                toast.error("Failed to load subscription data");
            }
        } catch (error) {
            console.error("Error fetching subscription:", error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            active: { icon: CheckCircle, text: "Active", class: "bg-green-100 text-green-700" },
            cancelled: { icon: XCircle, text: "Cancelled", class: "bg-red-100 text-red-700" },
            expired: { icon: AlertCircle, text: "Expired", class: "bg-gray-100 text-gray-700" },
            paused: { icon: Clock, text: "Paused", class: "bg-yellow-100 text-yellow-700" },
        };

        const badge = badges[status as keyof typeof badges] || badges.expired;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badge.class}`}>
                <Icon className="w-3.5 h-3.5" />
                {badge.text}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase()
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading subscription...</p>
                </div>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Subscription</h2>
                    <p className="text-gray-600 mb-6">You don't have an active subscription yet.</p>
                    <Button
                        onClick={() => router.push('/#pricing')}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    >
                        View Plans
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Subscription Management</h1>
                    <p className="text-gray-600">Manage your subscription and view billing history</p>
                </div>

                {/* Current Plan Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6"
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Crown className="w-7 h-7 text-white fill-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">{subscription.plan_name} Plan</h2>
                                <div className="mt-1">{getStatusBadge(subscription.status)}</div>
                            </div>
                        </div>
                        {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                            <Button
                                variant="outline"
                                onClick={() => setShowCancelModal(true)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                Cancel Subscription
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Started</p>
                                <p className="text-base font-bold text-gray-900">{formatDate(subscription.created_at)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Current Period</p>
                                <p className="text-base font-bold text-gray-900">
                                    {subscription.current_period_start && formatDate(subscription.current_period_start)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CreditCard className="w-5 h-5 text-purple-600 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500 font-medium">
                                    {subscription.cancel_at_period_end ? "Expires" : "Renews"}
                                </p>
                                <p className="text-base font-bold text-gray-900">
                                    {subscription.current_period_end && formatDate(subscription.current_period_end)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {subscription.cancel_at_period_end && (
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                            <p className="text-sm text-yellow-800 font-medium">
                                ⚠️ Your subscription will end on {subscription.current_period_end && formatDate(subscription.current_period_end)}.
                                You'll retain access until then.
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Transaction History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                >
                    <h3 className="text-xl font-black text-gray-900 mb-6">Transaction History</h3>

                    {transactions.length === 0 ? (
                        <div className="text-center py-12">
                            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No transactions yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{transaction.plan_name}</p>
                                            <p className="text-sm text-gray-500">{formatDate(transaction.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-lg font-black text-gray-900">
                                            {formatCurrency(transaction.amount, transaction.currency)}
                                        </p>
                                        {transaction.receipt_url && (
                                            <a
                                                href={transaction.receipt_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-600 hover:text-purple-700"
                                            >
                                                <Download className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Cancellation Modal */}
            <CancellationModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onSuccess={() => {
                    fetchSubscriptionData();
                    setShowCancelModal(false);
                }}
            />
        </div>
    );
}

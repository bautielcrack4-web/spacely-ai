"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, CreditCard, Bug, Sparkles, HelpCircle, Mail, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSupport } from "@/contexts/SupportContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function SupportModal() {
    const { isOpen, closeSupport, initialCategory, initialDescription } = useSupport();
    const [category, setCategory] = useState(initialCategory);
    const [description, setDescription] = useState(initialDescription);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCategory(initialCategory || "Bug");
            setDescription(initialDescription || "");
        }
    }, [isOpen, initialCategory, initialDescription]);

    if (!isOpen) return null;

    const categories = [
        { id: "Bug", label: "Report a Bug", icon: Bug, color: "text-red-500", bg: "bg-red-50" },
        { id: "Billing", label: "Billing Issue", icon: CreditCard, color: "text-green-500", bg: "bg-green-50" },
        { id: "Feature", label: "Feature Request", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-50" },
        { id: "Other", label: "Other Question", icon: HelpCircle, color: "text-blue-500", bg: "bg-blue-50" },
    ];

    const generateEmailBody = () => {
        return `
Type: ${category}
User ID: (Please leave this for support)
--------------------------------------------------

Details:
${description}

--------------------------------------------------
OS: ${navigator.platform}
Agent: ${navigator.userAgent}
        `.trim();
    };

    const handleSendEmail = () => {
        const subject = encodeURIComponent(`[${category}] Support Request - RoomCraft App`);
        const body = encodeURIComponent(generateEmailBody());
        window.location.href = `mailto:bagasystudio@gmail.com?subject=${subject}&body=${body}`;
        toast.success("Opening your email client...");
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateEmailBody());
        setCopied(true);
        toast.success("Support details copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={closeSupport}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Contact Support</h2>
                                <p className="text-sm text-gray-500">We're here to help you</p>
                            </div>
                        </div>
                        <button onClick={closeSupport} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">
                        {/* Categories */}
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategory(cat.id)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                                        category === cat.id
                                            ? "border-purple-500 bg-purple-50/50"
                                            : "border-gray-100 hover:border-gray-200"
                                    )}
                                >
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", cat.bg)}>
                                        <cat.icon className={cn("w-4 h-4", cat.color)} />
                                    </div>
                                    <span className={cn("text-sm font-semibold", category === cat.id ? "text-purple-700" : "text-gray-600")}>
                                        {cat.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">What's happening?</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your issue or question..."
                                className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none resize-none text-gray-700 bg-gray-50/50"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleCopy}
                            className="bg-white hover:bg-gray-50 border-gray-200 text-gray-600 gap-2 h-12"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copied" : "Copy Info"}
                        </Button>
                        <Button
                            onClick={handleSendEmail}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold h-12 rounded-xl shadow-lg shadow-purple-200"
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Enviar Email
                        </Button>
                    </div>

                    <div className="px-6 pb-6 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em]">
                            O envía un correo directamente a: <span className="text-purple-600 select-all">bagasystudio@gmail.com</span>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

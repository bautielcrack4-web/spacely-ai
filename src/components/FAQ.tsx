"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
    question: string;
    answer: string;
}

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FAQItemProps[] = [
        {
            question: "How does it work?",
            answer: "Simply upload a photo of your room, select your preferred design style, and our AI will generate a professionally redesigned version in seconds. You can then download the result in high quality."
        },
        {
            question: "What image formats do you support?",
            answer: "We support JPG, PNG, and WebP formats. Images up to 10MB are accepted for best results."
        },
        {
            question: "Can I use this commercially?",
            answer: "Yes! All generated images are yours to use for both personal and commercial purposes, including client presentations, marketing materials, and social media."
        },
        {
            question: "How long does generation take?",
            answer: "Most transformations complete in 5-15 seconds. During peak times, it may take up to 30 seconds. You'll see real-time progress as your design generates."
        },
        {
            question: "Do you store my images?",
            answer: "Your uploaded images are processed securely and deleted from our servers after 24 hours. Generated results are saved to your account gallery for easy access."
        },
        {
            question: "What's included in the free trial?",
            answer: "The 3-day free trial includes unlimited generations, access to all 32+ design styles, 4K quality exports, and full access to all features. No credit card required to start."
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer: "Absolutely. You can cancel your subscription at any time with a single click from your account settings. No questions asked, and you'll retain access until the end of your billing period."
        },
        {
            question: "What if I'm not satisfied with the results?",
            answer: "We offer a 3-day money-back guarantee. If you're not completely satisfied, contact us within 3 days of purchase for a full refund."
        }
    ];

    return (
        <section id="faq" className="max-w-4xl mx-auto px-4 w-full py-24">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
                    Everything you need to know about Spacely AI
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-[#27272A] rounded-2xl overflow-hidden hover:border-brand/40 transition-colors"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                        >
                            <span className="text-base font-semibold text-white pr-8">
                                {faq.question}
                            </span>
                            <ChevronDown
                                className={cn(
                                    "w-5 h-5 text-brand flex-shrink-0 transition-transform duration-200",
                                    openIndex === index && "rotate-180"
                                )}
                            />
                        </button>
                        {openIndex === index && (
                            <div className="px-6 pb-5 pt-2">
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Still have questions CTA */}
            <div className="mt-16 text-center">
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                    Still have questions?
                </p>
                <a
                    href="mailto:bagasystudio@gmail.com"
                    className="inline-flex items-center gap-2 text-brand font-semibold text-sm hover:underline"
                >
                    Contact our support team →
                </a>
            </div>
        </section>
    );
}

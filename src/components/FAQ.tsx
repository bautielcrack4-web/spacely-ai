"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQItemProps {
    question: string;
    answer: string;
}

export function FAQ() {
    const { t } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FAQItemProps[] = [
        {
            question: t("faq.q1"),
            answer: t("faq.a1")
        },
        {
            question: t("faq.q2"),
            answer: t("faq.a2")
        },
        {
            question: t("faq.q3"),
            answer: t("faq.a3")
        },
        {
            question: t("faq.q4"),
            answer: t("faq.a4")
        },
        {
            question: t("faq.q5"),
            answer: t("faq.a5")
        },
        {
            question: t("faq.q6"),
            answer: t("faq.a6")
        },
        {
            question: t("faq.q7"),
            answer: t("faq.a7")
        },
        {
            question: t("faq.q8"),
            answer: t("faq.a8")
        }
    ];

    return (
        <section id="faq" className="max-w-4xl mx-auto px-4 w-full py-24">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4">
                    {t("faq.title")}
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

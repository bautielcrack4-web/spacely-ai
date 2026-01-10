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
        <section id="faq" className="max-w-4xl mx-auto px-4 w-full py-24 bg-white">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                    {t("faq.title")}
                </h2>
                <p className="text-xl text-gray-600">
                    {t("faq.subtitle")}
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-gray-100 rounded-2xl overflow-hidden hover:border-purple-200 hover:shadow-lg hover:shadow-purple-50 transition-all duration-300"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-purple-50/30 transition-colors"
                        >
                            <span className="text-lg font-bold text-gray-900 pr-8">
                                {faq.question}
                            </span>
                            <ChevronDown
                                className={cn(
                                    "w-5 h-5 text-purple-600 flex-shrink-0 transition-transform duration-300",
                                    openIndex === index && "rotate-180"
                                )}
                            />
                        </button>
                        {openIndex === index && (
                            <div className="px-8 pb-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                                <p className="text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Still have questions CTA */}
            <div className="mt-16 text-center">
                <p className="text-gray-600 font-medium mb-4">
                    {t("faq.cta.text")}
                </p>
                <a
                    href="mailto:bagasystudio@gmail.com"
                    className="inline-flex items-center gap-2 text-purple-600 font-bold hover:text-pink-600 transition-colors"
                >
                    {t("faq.cta.btn")} →
                </a>
            </div>
        </section>
    );
}

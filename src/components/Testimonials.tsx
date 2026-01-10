"use client";

import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Testimonials() {
    const { t } = useLanguage();
    const testimonials = [
        {
            name: t("testimonials.t1.name"),
            role: t("testimonials.t1.role"),
            location: t("testimonials.t1.location"),
            flag: "🇺🇸",
            avatar: "SM",
            content: t("testimonials.t1.content"),
            rating: 5,
            gradient: "from-purple-500 to-pink-500"
        },
        {
            name: t("testimonials.t2.name"),
            role: t("testimonials.t2.role"),
            location: t("testimonials.t2.location"),
            flag: "🇬🇧",
            avatar: "JT",
            content: t("testimonials.t2.content"),
            rating: 5,
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            name: t("testimonials.t3.name"),
            role: t("testimonials.t3.role"),
            location: t("testimonials.t3.location"),
            flag: "🇦🇷",
            avatar: "CR",
            content: t("testimonials.t3.content"),
            rating: 5,
            gradient: "from-amber-500 to-orange-500"
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 w-full py-24">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4">
                    {t("testimonials.title")}
                </h2>
                <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
                    {t("testimonials.subtitle")}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, i) => (
                    <div
                        key={i}
                        className="p-8 rounded-2xl bg-[#0A0A0A] border border-[#27272A] hover:border-brand/40 transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Rating Stars */}
                        <div className="flex gap-1 mb-4">
                            {[...Array(testimonial.rating)].map((_, idx) => (
                                <Star key={idx} className="w-4 h-4 fill-brand text-brand" />
                            ))}
                        </div>

                        {/* Testimonial Content */}
                        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                            "{testimonial.content}"
                        </p>

                        {/* Author Info */}
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center flex-shrink-0`}>
                                <span className="text-white font-bold text-sm">
                                    {testimonial.avatar}
                                </span>
                            </div>

                            {/* Name & Role */}
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-white flex items-center gap-2">
                                    {testimonial.name}
                                    <span className="text-base">{testimonial.flag}</span>
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                    {testimonial.role}
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                    {testimonial.location}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

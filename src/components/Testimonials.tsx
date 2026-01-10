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
            image: "/testimonials/user-2.jpg",
            content: t("testimonials.t1.content"),
            rating: 5,
        },
        {
            name: t("testimonials.t2.name"),
            role: t("testimonials.t2.role"),
            location: t("testimonials.t2.location"),
            flag: "🇬🇧",
            image: "/testimonials/user-1.jpg",
            content: t("testimonials.t2.content"),
            rating: 5,
        },
        {
            name: t("testimonials.t3.name"),
            role: t("testimonials.t3.role"),
            location: t("testimonials.t3.location"),
            flag: "🇦🇷",
            image: "/testimonials/user-3.jpg",
            content: t("testimonials.t3.content"),
            rating: 5,
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 w-full py-24 bg-white">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                    {t("testimonials.title")}
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    {t("testimonials.subtitle")}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, i) => (
                    <div
                        key={i}
                        className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-2xl hover:shadow-purple-50 transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Rating Stars */}
                        <div className="flex gap-1 mb-6">
                            {[...Array(testimonial.rating)].map((_, idx) => (
                                <Star key={idx} className="w-5 h-5 fill-purple-600 text-purple-600" />
                            ))}
                        </div>

                        {/* Testimonial Content */}
                        <p className="text-lg leading-relaxed text-gray-600 mb-8 font-medium italic">
                            "{testimonial.content}"
                        </p>

                        {/* Author Info */}
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-md border-2 border-purple-100">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Name & Role */}
                            <div className="flex-1">
                                <p className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    {testimonial.name}
                                    <span className="text-xl">{testimonial.flag}</span>
                                </p>
                                <p className="text-sm text-gray-500 font-medium">
                                    {testimonial.role}
                                </p>
                                <p className="text-xs text-purple-600 font-bold uppercase tracking-wider mt-1">
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

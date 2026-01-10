"use client";

import { Hero } from "@/components/Hero";
import { FAQ } from "@/components/FAQ";
import { StyleSelector } from "@/components/StyleSelector";
import { Testimonials } from "@/components/Testimonials";
import { Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-24 pb-24">
      <Hero />

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center mb-12 md:col-span-3">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4">
              {t("features.title")}
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
              {t("features.subtitle")}
            </p>
          </div>
          {[
            { title: t("features.f1.title"), desc: t("features.f1.desc") },
            { title: t("features.f2.title"), desc: t("features.f2.desc") },
            { title: t("features.f3.title"), desc: t("features.f3.desc") }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-2xl bg-[#0A0A0A] border border-[#27272A] hover:border-brand/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Style Selector */}
      <StyleSelector />

      {/* Real Transformations Gallery */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 w-full py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4">
            {t("gallery.title")}
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            {t("gallery.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { style: t("styles.modern") },
            { style: t("styles.scandinavian") },
            { style: t("styles.industrial") },
            { style: t("styles.midcentury") },
            { style: t("styles.bohemian") },
            { style: t("styles.coastal") },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#27272A] hover:border-brand/40 transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              {/* Placeholder for before/after image */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-3">🏠 ✨</div>
                  <p className="text-white font-semibold text-sm">{item.style}</p>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-6 gap-3">
                <span className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-white/10 backdrop-blur">
                  {item.style}
                </span>
                <button className="text-brand text-sm font-semibold hover:underline">
                  Try this style →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live activity indicator */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0F0F0F] border border-[#27272A]">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              <span className="text-brand font-semibold">123</span> {t("gallery.indicator")}
            </span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 w-full py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4">
            {t("pricing.title")}
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            {t("pricing.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              name: t("pricing.weekly"),
              price: '$5.99',
              period: '/week',
              trial: '7-DAY FREE TRIAL',
              description: 'Perfect for trying out',
              features: ['Unlimited generations', '4K quality exports', 'All room types', 'Email support'],
              highlighted: false
            },
            {
              name: t("pricing.monthly"),
              price: '$14.99',
              period: '/month',
              trial: '3-DAY FREE TRIAL',
              description: 'Most popular choice',
              features: ['Everything in Weekly', 'Priority processing', '32+ design styles', 'Priority support', 'Team collaboration'],
              highlighted: true,
              badge: t("pricing.mostPopular"),
              savings: 'SAVE 60%'
            },
            {
              name: t("pricing.yearly"),
              price: '$119.99',
              period: '/year',
              trial: '3-DAY FREE TRIAL',
              description: 'Best value',
              savings: 'SAVE 60%',
              features: ['Everything in Monthly', 'Custom AI training', 'API access', 'Dedicated support', 'White-label option'],
              highlighted: false
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={cn(
                "relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1",
                plan.highlighted
                  ? "bg-[#0A0A0A] border-brand shadow-xl shadow-brand/20 scale-105"
                  : "bg-[#0A0A0A] border-[#27272A] hover:border-brand/40"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              {plan.savings && !plan.badge && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {plan.savings}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{plan.description}</p>
              </div>

              <div className="text-center mb-2">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-lg" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
                </div>
              </div>

              <div className="text-center mb-8">
                <span className="text-xs font-semibold text-brand">{plan.trial}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm" style={{ color: plan.highlighted ? '#FAFAFA' : 'var(--text-muted)' }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  "w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200",
                  plan.highlighted
                    ? "bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] text-white hover:shadow-lg hover:shadow-brand/30 hover:scale-[1.02]"
                    : "bg-transparent border-2 border-zinc-700 text-white hover:border-brand/50 hover:bg-brand/5"
                )}
              >
                {t("btn.startTrial")}
              </button>
            </div>
          ))}
        </div>

        {/* Pricing FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { q: "Can I cancel anytime?", a: "Yes, cancel with one click" },
              { q: "What happens after trial?", a: "Nothing. We'll notify you first" },
              { q: "Do you offer refunds?", a: "Full refund within 3 days" },
            ].map((faq, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-white mb-1">{faq.q}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <footer className="border-t border-[#27272A] mt-24 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">{t("footer.product")}</h4>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'FAQ', 'Changelog'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-sm text-zinc-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">{t("footer.company")}</h4>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-sm text-zinc-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="mailto:bagasystudio@gmail.com" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">{t("footer.legal")}</h4>
              <ul className="space-y-3">
                {['Privacy', 'Terms', 'Cookies'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-sm text-zinc-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">{t("footer.connect")}</h4>
              <ul className="space-y-3">
                {['Twitter', 'Instagram', 'LinkedIn'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-sm text-zinc-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#27272A] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 relative">
                <img src="/logo-pixel.png" alt="Spacely AI" className="w-full h-full object-contain" />
              </div>
              <span className="text-sm font-semibold text-white">Spacely AI</span>
            </div>
            <p className="text-sm text-zinc-400">
              © 2024 Bagasy Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div >
  );
}

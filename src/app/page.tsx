import { Hero } from "@/components/Hero";
import { FAQ } from "@/components/FAQ";
import { Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      <Hero />

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Every Space. Every Style.", desc: "From living rooms to gardens. Modern to vintage. Your vision, instantly visualized." },
            { title: "Professional Quality", desc: "Export in stunning 4K resolution. Ready for presentations or social media." },
            { title: "Real-Time Preview", desc: "Watch your space transform before your eyes. No waiting, no guessing." }
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

      {/* Real Transformations Gallery */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 w-full py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4">
            Real Transformations
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            See what others have created in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { style: "Modern Minimalist" },
            { style: "Scandinavian" },
            { style: "Industrial" },
            { style: "Mid-Century Modern" },
            { style: "Bohemian" },
            { style: "Coastal" },
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
              <span className="text-brand font-semibold">123</span> designs generated in the last hour
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 w-full py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            All plans include a <span className="text-brand font-semibold">3-day free trial</span>. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              name: 'Weekly',
              price: '$9',
              period: '/week',
              trial: '3-DAY FREE TRIAL',
              description: 'Perfect for trying out',
              features: ['Unlimited generations', '4K quality exports', 'All room types', 'Email support'],
              highlighted: false
            },
            {
              name: 'Monthly',
              price: '$29',
              period: '/month',
              trial: '3-DAY FREE TRIAL',
              description: 'Most popular choice',
              features: ['Everything in Weekly', 'Priority processing', '32+ design styles', 'Priority support', 'Team collaboration'],
              highlighted: true,
              badge: 'MOST POPULAR',
              savings: 'SAVE 60%'
            },
            {
              name: 'Yearly',
              price: '$290',
              period: '/year',
              trial: '3-DAY FREE TRIAL',
              description: 'Best value',
              savings: 'SAVE 70%',
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
                Start Free Trial
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
              <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'FAQ', 'Changelog'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }} onMouseOver={(e) => e.currentTarget.style.color = '#FAFAFA'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }} onMouseOver={(e) => e.currentTarget.style.color = '#FAFAFA'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                      {item}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="mailto:bagasystudio@gmail.com" className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }} onMouseOver={(e) => e.currentTarget.style.color = '#FAFAFA'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-3">
                {['Privacy', 'Terms', 'Cookies'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }} onMouseOver={(e) => e.currentTarget.style.color = '#FAFAFA'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Connect</h4>
              <ul className="space-y-3">
                {['Twitter', 'Instagram', 'LinkedIn'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }} onMouseOver={(e) => e.currentTarget.style.color = '#FAFAFA'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
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
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              © 2024 Bagasy Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div >
  );
}

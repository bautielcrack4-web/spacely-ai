"use client";

import { Hero } from "@/components/Hero";
import { FAQ } from "@/components/FAQ";
import { ExampleGallery } from "@/components/ExampleGallery";
import { MultipleStyles } from "@/components/MultipleStyles";
import { Testimonials } from "@/components/Testimonials";
import { Sparkles, Check, ArrowRight, Zap, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import NextImage from "next/image";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col bg-[#F9FAFB] min-h-screen relative overflow-hidden">
      {/* Modern Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-pink-100/40 rounded-full blur-[120px]" />
      </div>

      <Hero />

      {/* Galería de Transformaciones */}
      <ExampleGallery />

      {/* Sección Múltiples Estilos */}
      <MultipleStyles />

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Diseño de Interior con IA
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para imaginar tu hogar ideal en segundos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Renderizado Instantáneo",
                desc: "Sube una foto y obtén un diseño profesional en menos de 10 segundos.",
                icon: <Sparkles className="w-6 h-6" />
              },
              {
                title: "Múltiples Estilos",
                desc: "Desde Escandinavo hasta Industrial, explora decenas de estilos diferentes.",
                icon: <Check className="w-6 h-6" />
              },
              {
                title: "Calidad Profesional",
                desc: "Nuestra IA entiende la estructura de tu habitación para resultados realistas.",
                icon: <ArrowRight className="w-6 h-6" />
              }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-100 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full mb-6 font-bold text-sm uppercase tracking-wider">
                <Zap className="w-4 h-4 fill-purple-600" />
                {t("pricing.mostPopular")}
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                {t("pricing.title")}
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                {t("pricing.desc")}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                id: "weekly",
                name: t("pricing.weekly"),
                price: "$5.99",
                period: t("dashboard.templates.living").includes("Sala") ? "/semana" : "/week", // Quick hack as it's not in keys
                features: ["pricing.f.unlimited", "pricing.f.allRooms", "pricing.f.4k", "pricing.f.emailSupport"],
                highlighted: false,
                color: "from-blue-500 to-indigo-600"
              },
              {
                id: "monthly",
                name: t("pricing.monthly"),
                price: "$14.99",
                period: t("dashboard.templates.living").includes("Sala") ? "/mes" : "/month",
                features: ["pricing.f.everythingWeekly", "pricing.f.priority", "pricing.f.styles", "pricing.f.prioritySupport"],
                highlighted: true,
                badge: t("pricing.mostPopular"),
                color: "from-purple-600 to-pink-600"
              },
              {
                id: "yearly",
                name: t("pricing.yearly"),
                price: "$119.99",
                period: t("dashboard.templates.living").includes("Sala") ? "/año" : "/year",
                features: ["pricing.f.everythingMonthly", "pricing.f.priority", "pricing.f.allRooms", "pricing.f.prioritySupport"],
                highlighted: false,
                color: "from-amber-500 to-orange-600",
                subtitle: t("dashboard.templates.living").includes("Sala") ? "Solo $9.99/mes" : "Just $9.99/month"
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative group rounded-[2.5rem] transition-all duration-500 flex flex-col h-full",
                  plan.highlighted
                    ? "bg-white border-2 border-purple-500 shadow-2xl shadow-purple-100 scale-105 z-10"
                    : "bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-purple-200 hover:shadow-xl"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black px-6 py-2 rounded-full shadow-xl uppercase tracking-widest">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-8 md:p-10 flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">
                      {plan.name.split(" ")[0]} <span className="text-purple-600">UNLIMITED</span>
                    </h3>
                    <p className="text-gray-500 text-sm font-semibold">{plan.subtitle || t("nav.faq")}</p>
                  </div>

                  <div className="mb-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl md:text-6xl font-black text-gray-900 leading-none">{plan.price}</span>
                      <span className="text-gray-500 font-bold text-lg">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-12 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-sm text-gray-700 font-bold tracking-tight">{t(feature)}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/login" className="w-full">
                    <Button
                      className={cn(
                        "w-full h-16 rounded-[1.25rem] font-black text-lg transition-all active:scale-[0.98] border-none",
                        plan.highlighted
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-200"
                          : "bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200"
                      )}
                    >
                      {t("hero.upload")}
                    </Button>
                  </Link>

                  {/* Trust indicator inside card */}
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(avatar => (
                          <div key={avatar} className="w-8 h-8 rounded-full border-2 border-white relative overflow-hidden bg-gray-100">
                            <NextImage src={`/testimonials/user${avatar}.jpg`} alt="User" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        4.9/5 RATING
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Trust Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-green-50 rounded-[2rem] p-8 md:p-12 border-2 border-green-100 flex flex-col md:flex-row items-center gap-8 text-center md:text-left transition-all hover:shadow-lg">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl shadow-inner">
                💰
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-black text-green-900 uppercase tracking-tight mb-2">
                  7-Day Money-Back Guarantee
                </h4>
                <p className="text-green-700 font-medium text-lg opacity-90 leading-relaxed">
                  Try Spacely AI risk-free. If you're not absolutely thrilled with your new interior designs, we'll refund every penny. No questions asked.
                </p>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <Lock className="w-10 h-10 text-green-600 opacity-50" />
                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">SECURE PAYMENT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <footer className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                <img src="/logo-pixel.png" alt="Spacely AI" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Spacely AI</span>
            </Link>

            <nav className="flex gap-8">
              {['Explorar', 'Precios', 'FAQ', 'Contacto'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-gray-500 hover:text-purple-600 transition-colors">
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-400 font-medium text-center md:text-left">
              © 2024 Spacely AI (Bagasy Studio). Todos los derechos reservados. <br className="md:hidden" />
              Inuitive IA para el rediseño de espacios.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm font-medium">Términos</Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm font-medium">Privacidad</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

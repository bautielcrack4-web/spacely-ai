"use client";

import { Hero } from "@/components/Hero";
import { FAQ } from "@/components/FAQ";
import { ExampleGallery } from "@/components/ExampleGallery";
import { MultipleStyles } from "@/components/MultipleStyles";
import { Testimonials } from "@/components/Testimonials";
import { Sparkles, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      <section id="pricing" className="py-24 bg-[#F9FAFB] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Planes Flexibles para tu Creatividad
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Elige el plan que mejor se adapte a tus necesidades de diseño.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Semanal",
                price: '$5.99',
                period: '/semana',
                description: "Ideal para proyectos rápidos de fin de semana.",
                features: ["Generaciones Ilimitadas", "Calidad 4K", "Sin Marcas de Agua", "Soporte Prioritario"],
                highlighted: false
              },
              {
                name: "Mensual",
                price: '$14.99',
                period: '/mes',
                description: "La mejor opción para rediseñar toda tu casa.",
                features: ["Todo lo del plan Semanal", "Acceso a Estilos Premium", "Nuevos Estilos Mensuales", "Soporte 24/7 VIP"],
                highlighted: true,
                badge: "MÁS POPULAR"
              },
              {
                name: "Anual",
                price: '$119.99',
                period: '/año',
                description: "Para profesionales y amantes del diseño constante.",
                features: ["Todo lo del plan Mensual", "Dos Meses Gratis", "API Access (Pronto)", "Consultoría de IA"],
                highlighted: false
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={cn(
                  "relative p-8 rounded-3xl border transition-all duration-300 flex flex-col h-full",
                  plan.highlighted
                    ? "bg-white border-purple-500 shadow-2xl shadow-purple-200 scale-105 z-10"
                    : "bg-white border-gray-100 hover:border-purple-200 shadow-sm"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 font-medium">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-12 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-3 h-3 text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/login" className="w-full">
                  <Button
                    className={cn(
                      "w-full h-12 rounded-xl font-bold transition-all border-none",
                      plan.highlighted
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200 hover:opacity-90"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    Comenzar Ahora
                  </Button>
                </Link>
              </div>
            ))}
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

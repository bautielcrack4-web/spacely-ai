import { Hero } from "@/components/Hero";
import { Sparkles } from "lucide-react";
import { DesignTool } from "@/components/DesignTool";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <Hero />
      <DesignTool />

      {/* Features Preview Placeholder */}
      <section id="features" className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Transform existing room", desc: "Upload an image of your room and our AI will restyle it." },
            { title: "Manage room type", desc: "No matter what type of room you're designing, we've got you covered." },
            { title: "Upscale Pics with AI", desc: "Boost your photos with AI-powered upscaling for maximum quality." }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-2xl bg-surface-100 border border-border hover:border-brand/30 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section Placeholder */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 w-full py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12"><span className="text-gradient">Gallery Preview</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-square bg-surface-100 rounded-xl border border-border animate-pulse" />
          ))}
        </div>
      </section>

      {/* Pricing Section Placeholder */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 w-full py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Simple Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Weekly', 'Monthly', 'Yearly'].map((plan, i) => (
            <div key={i} className="p-8 bg-surface-100 rounded-2xl border border-border flex flex-col items-center">
              <h3 className="text-xl font-bold text-white mb-2">{plan}</h3>
              <p className="text-gray-400 mb-6">Unlimited Generations</p>
              <div className="w-full h-10 bg-brand/10 rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

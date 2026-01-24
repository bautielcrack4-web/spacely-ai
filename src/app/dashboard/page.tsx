"use client";

import { motion } from "framer-motion";
import {
    LayoutGrid,
    Sparkles,
    Paintbrush,
    Home,
    Maximize2,
    ArrowRight,
    Brush
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TOOLS = [
    {
        id: "interior",
        title: "Diseño de Interiores",
        description: "Sube una foto, elige un estilo, ¡deja que la IA diseñe el cuarto!",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
        href: "/dashboard/create?mode=interior",
        color: "from-purple-500 to-indigo-600",
        tag: "Popular"
    },
    {
        id: "exterior",
        title: "Diseño Exterior",
        description: "Foto de tu hogar, elige estilo e IA diseña fachadas y jardines.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
        href: "/dashboard/create?mode=exterior",
        color: "from-emerald-500 to-teal-600",
        tag: "Nuevo"
    },
    {
        id: "paint",
        title: "Pintura",
        description: "Elige tu color favorito y dale un nuevo look a tu espacio en un instante.",
        image: "https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?auto=format&fit=crop&q=80&w=800",
        href: "/dashboard/create?mode=paint",
        color: "from-pink-500 to-rose-600",
        tag: "Magia"
    },
    {
        id: "magic",
        title: "Edición Mágica",
        description: "Añade plantas, cambia suelos o iluminación con un solo clic.",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
        href: "/dashboard/create?mode=magic",
        color: "from-violet-500 to-fuchsia-600",
        tag: "Nuevo"
    },
    {
        id: "floor-plan",
        title: "Plano Nuevo",
        description: "Edita planos con IA — reordena habitaciones fácilmente.",
        image: "https://images.unsplash.com/photo-1596237553531-97216f947aa6?auto=format&fit=crop&q=80&w=800",
        href: "/dashboard/create?mode=floorplan",
        color: "from-amber-500 to-orange-600",
        tag: "Pro"
    }
];

export default function ToolsPage() {
    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-black tracking-tight text-gray-900"
                >
                    Herramientas <span className="text-purple-600">IA</span>
                </motion.h1>
                <p className="text-gray-500 font-medium">Elige cómo quieres transformar tu espacio hoy.</p>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {TOOLS.map((tool, index) => (
                    <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link
                            href={tool.href}
                            className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-200/40 h-[450px]"
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={tool.image}
                                    alt={tool.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            </div>

                            {/* Badge */}
                            <div className="absolute top-6 left-6 z-10">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg",
                                    "bg-gradient-to-r", tool.color
                                )}>
                                    {tool.tag}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 mt-auto p-8 flex flex-col gap-3">
                                <h3 className="text-3xl font-black text-white tracking-tight">{tool.title}</h3>
                                <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[80%]">
                                    {tool.description}
                                </p>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl font-bold text-sm shadow-xl transition-all group-hover:bg-purple-600 group-hover:text-white">
                                        ¡Pruébalo!
                                        <ArrowRight className="w-4 h-4" />
                                    </div>

                                    <div className="w-12 h-12 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

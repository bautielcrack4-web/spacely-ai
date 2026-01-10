import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-300 border-none font-bold tracking-tight",
                destructive:
                    "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 hover:shadow-red-500/40 transition-all",
                outline:
                    "border-2 border-slate-200 bg-transparent hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 text-slate-700 font-semibold transition-all shadow-sm",
                secondary:
                    "bg-white text-slate-900 border border-slate-100 shadow-sm hover:bg-slate-50/80 hover:shadow-md transition-all font-semibold",
                ghost: "hover:bg-slate-100/50 hover:text-slate-900 font-medium",
                link: "text-purple-600 underline-offset-4 hover:underline font-bold",
                brand: "bg-brand text-slate-900 hover:bg-brand/90",
                premium: "bg-black text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-white/10 relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:-translate-x-full hover:after:animate-shimmer",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-12 rounded-lg px-8 text-base",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }

"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Initialize Supabase Client for client-side usage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session) {
                    router.push('/dashboard');
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [router]);

    if (!mounted) return <div className="min-h-screen bg-[#0A0A0A]" />;

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#0A0A0A]">

            {/* Left Side - Visual / Branding */}
            <div className="hidden md:flex w-1/2 bg-[#121212] relative flex-col items-center justify-center p-12 overflow-hidden border-r border-[#1F1F1F]">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B2F042] rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 text-center space-y-6 max-w-lg">
                    <div className="w-24 h-24 mx-auto relative mb-8">
                        <Image src="/spacely-logo.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <h2 className="text-4xl font-bold text-white tracking-tight">
                        Design your dream space
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Join thousands of users transforming their interiors with the power of Artificial Intelligence.
                    </p>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex justify-between text-xs text-gray-600">
                    <span>© 2024 Design Sense AI</span>
                    <span>Privacy Policy</span>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#0A0A0A] relative">
                <Link href="/" className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="w-full max-w-[400px] space-y-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
                        <p className="text-gray-500 text-sm">Enter your details to access your dashboard</p>
                    </div>

                    <div className="bg-[#121212] p-1 rounded-xl border border-[#1F1F1F]">
                        <Auth
                            supabaseClient={supabase}
                            appearance={{
                                theme: ThemeSupa,
                                variables: {
                                    default: {
                                        colors: {
                                            brand: '#B2F042',
                                            brandAccent: '#9ED33B',
                                            brandButtonText: '#000000',
                                            defaultButtonBackground: '#1F1F1F',
                                            defaultButtonBackgroundHover: '#2F2F2F',
                                            inputBackground: '#121212',
                                            inputBorder: '#2F2F2F',
                                            inputBorderHover: '#B2F042',
                                            inputPlaceholder: '#666666',
                                            inputText: 'white',
                                        },
                                        space: {
                                            inputPadding: '12px',
                                            buttonPadding: '12px',
                                        },
                                        borderWidths: {
                                            buttonBorderWidth: '0px',
                                            inputBorderWidth: '1px',
                                        },
                                        radii: {
                                            borderRadiusButton: '8px',
                                            buttonBorderRadius: '8px',
                                            inputBorderRadius: '8px',
                                        }
                                    }
                                },
                                className: {
                                    button: 'font-bold transition-all duration-200',
                                    input: 'transition-all duration-200 focus:ring-1 focus:ring-[#B2F042]/50',
                                }
                            }}
                            theme="dark"
                            providers={['google', 'github']}
                            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

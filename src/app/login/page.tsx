"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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

    if (!mounted) return <div className="min-h-screen bg-[#F9FAFB]" />;

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#F9FAFB] relative overflow-hidden">
            {/* Modern Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-100/40 rounded-full blur-[120px]" />
            </div>

            {/* Left Side - Visual / Branding */}
            <div className="hidden md:flex w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden border-r border-gray-100">
                <div className="relative z-10 text-center space-y-6 max-w-lg">
                    <div className="w-24 h-24 mx-auto relative mb-8">
                        <Image src="/logo-pixel.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Design your dream space
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Join thousands of users transforming their interiors with the power of Artificial Intelligence.
                    </p>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex justify-between text-xs text-gray-400 font-medium">
                    <span>© 2024 Bagasy Studio</span>
                    <span>Privacy Policy</span>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-transparent relative">
                <Link href="/" className="absolute top-8 left-8 text-gray-500 hover:text-purple-600 flex items-center gap-2 text-sm transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="w-full max-w-[400px] space-y-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
                        <p className="text-gray-500 text-sm">Enter your details to access your dashboard</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-purple-50">
                        <Auth
                            supabaseClient={supabase}
                            appearance={{
                                theme: ThemeSupa,
                                variables: {
                                    default: {
                                        colors: {
                                            brand: '#9333ea',
                                            brandAccent: '#db2777',
                                            brandButtonText: '#FFFFFF',
                                            defaultButtonBackground: '#F9FAFB',
                                            defaultButtonBackgroundHover: '#F3F4F6',
                                            inputBackground: '#F9FAFB',
                                            inputBorder: '#E5E7EB',
                                            inputBorderHover: '#9333ea',
                                            inputPlaceholder: '#9CA3AF',
                                            inputText: '#111827',
                                        },
                                        space: {
                                            inputPadding: '14px',
                                            buttonPadding: '14px',
                                        },
                                        borderWidths: {
                                            buttonBorderWidth: '0px',
                                            inputBorderWidth: '1px',
                                        },
                                        radii: {
                                            borderRadiusButton: '12px',
                                            buttonBorderRadius: '12px',
                                            inputBorderRadius: '12px',
                                        }
                                    }
                                },
                                className: {
                                    button: 'font-bold transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-md',
                                    input: 'transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 border-gray-200',
                                    label: 'text-gray-700 font-medium mb-1.5 block',
                                    anchor: 'text-purple-600 hover:text-pink-600 font-semibold transition-colors',
                                }
                            }}
                            theme="light"
                            providers={[]}
                            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

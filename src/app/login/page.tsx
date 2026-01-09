"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/navigation';

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

    if (!mounted) return <div className="min-h-screen bg-background" />;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-surface-100 p-8 rounded-xl border border-border shadow-2xl">
                <h1 className="text-2xl font-bold text-white text-center mb-6">Welcome to Spacely AI</h1>
                <Auth
                    supabaseClient={supabase}
                    appearance={{
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: '#7ED4FD',
                                    brandAccent: '#5EB6E6',
                                    inputText: 'white',
                                    inputBackground: '#1F1F1F',
                                }
                            }
                        }
                    }}
                    theme="dark"
                    providers={['google', 'github']}
                    redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
                />
            </div>
        </div>
    );
}

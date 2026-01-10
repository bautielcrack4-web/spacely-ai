"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";
import { PaywallProvider } from "@/contexts/PaywallContext";
import { PaywallModal } from "@/components/PaywallModal";
import { usePaywall } from "@/contexts/PaywallContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isOpen, closePaywall } = usePaywall();

    return (
        <>
            <div className="min-h-screen bg-[#F9FAFB] relative overflow-hidden">
                {/* Modern Background Accents */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100/30 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-100/30 rounded-full blur-[120px]" />
                </div>

                <Sidebar />
                <MobileSidebar />
                <main className="md:ml-64 p-4 md:p-8 relative z-10">
                    {children}
                </main>
            </div>
            <PaywallModal isOpen={isOpen} onClose={closePaywall} />
        </>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PaywallProvider>
            <DashboardContent>{children}</DashboardContent>
        </PaywallProvider>
    );
}

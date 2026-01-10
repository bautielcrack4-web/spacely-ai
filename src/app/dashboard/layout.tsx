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
            <div className="min-h-screen bg-[#0A0A0A]">
                <Sidebar />
                <MobileSidebar />
                <main className="md:ml-64 p-4 md:p-8">
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

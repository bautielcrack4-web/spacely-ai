import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            <Sidebar />
            <MobileSidebar />
            <main className="md:ml-64 p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}

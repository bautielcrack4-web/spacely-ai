import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-6 overflow-auto">
                {children}
            </main>
        </div>
    );
}

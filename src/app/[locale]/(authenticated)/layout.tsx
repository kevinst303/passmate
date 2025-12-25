import { Sidebar } from "@/components/Sidebar";

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}

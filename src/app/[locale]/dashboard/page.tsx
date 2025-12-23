export const dynamic = 'force-dynamic';

import { getDashboardData } from "@/app/actions/dashboard";
import DashboardClient from "./DashboardClient";
import { redirect, Link } from "@/i18n/routing";

export default async function DashboardPage() {
    const data = await getDashboardData();

    if (data.error === 'Not authenticated') {
        redirect('/login');
    }

    if (data.error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
                <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm text-center max-w-md">
                    <h2 className="text-2xl font-bold text-accent mb-4">Something went wrong</h2>
                    <p className="text-muted-foreground mb-6">{data.error}</p>
                    <Link
                        href="/dashboard"
                        className="inline-block bg-primary text-white px-6 py-2 rounded-xl font-bold"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        );
    }

    return <DashboardClient data={data} />;
}

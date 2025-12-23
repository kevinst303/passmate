export const dynamic = 'force-dynamic';

import { getDashboardData } from "@/app/actions/dashboard";
import { redirect } from "next/navigation";
import LeaguesClient from "./LeaguesClient";

export default async function LeaguesPage() {
    const data = await getDashboardData();

    if (data.error === 'Not authenticated') {
        redirect('/login');
    }

    if (data.error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
                <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm text-center max-w-md">
                    <h2 className="text-2xl font-bold text-accent mb-4">Something went wrong</h2>
                    <p className="text-muted-foreground">{data.error}</p>
                </div>
            </div>
        );
    }

    return <LeaguesClient data={data} />;
}



export const dynamic = 'force-dynamic';

import { getAchievementsData } from "@/app/actions/achievements";
import { getDashboardData } from "@/app/actions/dashboard";
import { redirect } from "@/i18n/routing";
import AchievementsClient from "./AchievementsClient";

export default async function AchievementsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dashboardData = await getDashboardData();
    const achievementsData = await getAchievementsData();

    if (dashboardData.error === 'Not authenticated') {
        redirect({ href: '/login', locale });
    }

    if (achievementsData.error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
                <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm text-center max-w-md">
                    <h2 className="text-2xl font-bold text-accent mb-4">Something went wrong</h2>
                    <p className="text-muted-foreground">{achievementsData.error}</p>
                </div>
            </div>
        );
    }

    return (
        <AchievementsClient
            achievementsData={achievementsData as any}
            profile={dashboardData.profile as any}
        />
    );
}

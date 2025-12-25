export const dynamic = 'force-dynamic';

import { getDashboardData } from "@/app/actions/dashboard";
import { getAchievementsData } from "@/app/actions/achievements";
import { redirect } from "@/i18n/routing";
import ProfileClient from "./ProfileClient";
import { DashboardData } from "@/types/dashboard";
import { AchievementsData } from "@/types/achievements";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const [data, achievementsData] = await Promise.all([
        getDashboardData(),
        getAchievementsData()
    ]);

    if ('error' in data) {
        if (data.error === 'Not authenticated') {
            redirect({ href: '/login', locale });
        }

        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
                <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm text-center max-w-md">
                    <h2 className="text-2xl font-bold text-accent mb-4">Something went wrong</h2>
                    <p className="text-muted-foreground">{data.error}</p>
                </div>
            </div>
        );
    }

    return <ProfileClient data={data as DashboardData} achievementsData={achievementsData as AchievementsData} />;
}



export const dynamic = 'force-dynamic';

import { getDashboardData } from "@/app/actions/dashboard";
import { getAchievementsData } from "@/app/actions/achievements";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
    const data = await getDashboardData();
    const achievementsData = await getAchievementsData();

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

    return <ProfileClient data={data} achievementsData={achievementsData} />;
}



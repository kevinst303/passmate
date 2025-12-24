export const dynamic = 'force-dynamic';

import { getFriendsData } from "@/app/actions/friends";
import { getDashboardData } from "@/app/actions/dashboard";
import { getChallengesData } from "@/app/actions/challenges";
import { redirect } from "@/i18n/routing";
import FriendsClient from "./FriendsClient";

export default async function FriendsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dashboardData = await getDashboardData();
    const friendsData = await getFriendsData();
    const challengesData = await getChallengesData();

    if (dashboardData.error === 'Not authenticated') {
        redirect({ href: '/login', locale });
    }

    const combinedData = {
        ...friendsData,
        ...challengesData
    };

    return <FriendsClient initialData={combinedData as any} profile={dashboardData.profile as any} />;
}

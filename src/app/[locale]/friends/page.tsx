export const dynamic = 'force-dynamic';

import { getFriendsData } from "@/app/actions/friends";
import { getDashboardData } from "@/app/actions/dashboard";
import { getChallengesData } from "@/app/actions/challenges";
import { redirect } from "next/navigation";
import FriendsClient from "@/app/friends/FriendsClient";

export default async function FriendsPage() {
    const dashboardData = await getDashboardData();
    const friendsData = await getFriendsData();
    const challengesData = await getChallengesData();

    if (dashboardData.error === 'Not authenticated') {
        redirect('/login');
    }

    const combinedData = {
        ...friendsData,
        ...challengesData
    };

    return <FriendsClient initialData={combinedData} profile={dashboardData.profile} />;
}

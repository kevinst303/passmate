export const dynamic = 'force-dynamic';

import { getFriendsData } from "@/app/actions/friends";
import { getDashboardData } from "@/app/actions/dashboard";
import { getChallengesData } from "@/app/actions/challenges";
import { redirect } from "@/i18n/routing";
import FriendsClient, { FriendProfile, Challenge, FriendRequest } from "./FriendsClient";

export default async function FriendsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const [dashboardData, friendsData, challengesData] = await Promise.all([
        getDashboardData(),
        getFriendsData(),
        getChallengesData()
    ]);

    if (dashboardData.error === 'Not authenticated') {
        redirect({ href: '/login', locale });
    }

    const combinedData = {
        friends: (('friends' in friendsData ? friendsData.friends : []) || []) as FriendProfile[],
        pendingRequests: (('pendingRequests' in friendsData ? friendsData.pendingRequests : []) || []) as FriendRequest[],
        pendingReceived: (('pendingReceived' in challengesData ? challengesData.pendingReceived : []) || []) as Challenge[],
        pendingSent: (('pendingSent' in challengesData ? challengesData.pendingSent : []) || []) as Challenge[],
        completed: (('completed' in challengesData ? challengesData.completed : []) || []) as Challenge[],
        error: (('error' in friendsData ? friendsData.error : undefined) || ('error' in challengesData ? challengesData.error : undefined)) as string | undefined
    };

    return <FriendsClient initialData={combinedData} profile={dashboardData.profile as any} />;
}

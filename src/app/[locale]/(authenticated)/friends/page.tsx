export const dynamic = 'force-dynamic';

import { getFriendsData } from "@/app/actions/friends";
import { getDashboardData } from "@/app/actions/dashboard";
import { getChallengesData } from "@/app/actions/challenges";
import { redirect } from "@/i18n/routing";
import FriendsClient from "./FriendsClient";
import { FriendProfile, Challenge, FriendRequest, FriendsCombinedData } from "@/types/friends";
import { DashboardData } from "@/types/dashboard";

export default async function FriendsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const [dashboardData, friendsData, challengesData] = await Promise.all([
        getDashboardData(),
        getFriendsData(),
        getChallengesData()
    ]);

    if ('error' in dashboardData) {
        if (dashboardData.error === 'Not authenticated') {
            redirect({ href: '/login', locale });
        }
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
                <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm text-center max-w-md">
                    <h2 className="text-2xl font-bold text-accent mb-4">Something went wrong</h2>
                    <p className="text-muted-foreground">{dashboardData.error}</p>
                </div>
            </div>
        );
    }

    const combinedData: FriendsCombinedData = {
        friends: ('friends' in friendsData ? friendsData.friends : []) || [],
        pendingRequests: ('pendingRequests' in friendsData ? friendsData.pendingRequests : []) || [],
        pendingReceived: ('pendingReceived' in challengesData ? challengesData.pendingReceived : []) || [],
        pendingSent: ('pendingSent' in challengesData ? challengesData.pendingSent : []) || [],
        completed: ('completed' in challengesData ? challengesData.completed : []) || [],
        error: ('error' in friendsData ? friendsData.error : undefined) || ('error' in challengesData ? challengesData.error : undefined)
    };

    return <FriendsClient initialData={combinedData} profile={dashboardData.profile} />;
}

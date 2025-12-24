import { getDashboardData } from "@/app/actions/dashboard";
import { redirect } from "@/i18n/routing";
import ReferralClient from "./ReferralClient";

export const dynamic = 'force-dynamic';

export default async function ReferralPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const data = await getDashboardData();

    if (data.error === 'Not authenticated') {
        redirect({ href: '/login', locale });
    }

    return <ReferralClient data={data as { profile: { id: string } }} />;
}

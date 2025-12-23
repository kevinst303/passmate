import { getDashboardData } from "@/app/actions/dashboard";
import { redirect } from "next/navigation";
import ReferralClient from "./ReferralClient";

export const dynamic = 'force-dynamic';

export default async function ReferralPage() {
    const data = await getDashboardData();

    if (data.error === 'Not authenticated') {
        redirect('/login');
    }

    return <ReferralClient data={data} />;
}
